"""
Flask Backend API --- PneumoShield AI
Chest X-Ray Pneumonia Detection using DenseNet-121 + Grad-CAM

Endpoints:
  GET  /api/health   -> returns model load status
  POST /api/predict  -> accepts image + threshold, returns prediction + Grad-CAM
"""

import io
import os
import base64
import logging

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image

# TensorFlow / Keras
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf
from tensorflow.keras.applications.densenet import preprocess_input

# App Setup
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
def find_model_path():
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", "best_densenet121_finetuned.keras"),
        os.path.join(os.path.dirname(__file__), "..", "..", "best_densenet121_finetuned.keras"),
        os.path.join(os.path.dirname(__file__), "best_densenet121_finetuned.keras"),
    ]
    for path in candidates:
        abs_p = os.path.abspath(path)
        if os.path.isfile(abs_p):
            return abs_p
    return os.path.abspath(candidates[0])


MODEL_PATH = find_model_path()
IMG_SIZE = (224, 224)
DEFAULT_THRESHOLD = 0.75
MAX_FILE_BYTES = 15 * 1024 * 1024  # 15 MB

# Global model handle
model = None


def load_model():
    global model
    abs_path = os.path.abspath(MODEL_PATH)
    if not os.path.isfile(abs_path):
        logger.error("Model file not found at: %s", abs_path)
        return
    try:
        logger.info("Loading DenseNet-121 model from: %s", abs_path)
        model = tf.keras.models.load_model(abs_path)
        dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
        model.predict(dummy, verbose=0)
        logger.info("Model loaded and warmed up successfully.")
    except Exception as exc:
        logger.exception("Failed to load model: %s", exc)
        model = None


def preprocess_image(pil_img):
    img = pil_img.convert("RGB").resize(IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)
    return arr


def compute_gradcam(input_tensor, pil_img):
    global model

    # Locate inner DenseNet sub-model
    inner_model = None
    for layer in model.layers:
        if "densenet" in layer.name.lower():
            inner_model = layer
            break
    if inner_model is None:
        inner_model = model

    # Find last Conv2D layer
    last_conv_layer = None
    for layer in reversed(inner_model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            last_conv_layer = layer
            break

    if last_conv_layer is None:
        raise ValueError("Could not find a Conv2D layer for Grad-CAM.")

    logger.info("Grad-CAM target conv layer: %s", last_conv_layer.name)

    grad_model = tf.keras.Model(
        inputs=inner_model.inputs,
        outputs=[last_conv_layer.output, inner_model.output],
    )

    tensor = tf.constant(input_tensor, dtype=tf.float32)

    with tf.GradientTape() as tape:
        tape.watch(tensor)
        conv_outputs, predictions = grad_model(tensor, training=False)
        if predictions.shape[-1] == 1:
            class_score = predictions[:, 0]
        else:
            class_score = predictions[:, 1]

    grads = tape.gradient(class_score, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    heatmap = heatmap.numpy()

    orig_w, orig_h = pil_img.size
    heatmap_resized = cv2.resize(heatmap, (orig_w, orig_h))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    orig_array = np.array(pil_img.convert("RGB"), dtype=np.uint8)
    overlay = (orig_array * 0.55 + heatmap_rgb * 0.45).astype(np.uint8)

    def _encode_png(arr):
        img_pil = Image.fromarray(arr)
        buf = io.BytesIO()
        img_pil.save(buf, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

    return _encode_png(overlay), _encode_png(heatmap_rgb)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "message": (
            "DenseNet-121 model is loaded and ready."
            if model is not None
            else "Model not loaded --- check server logs."
        ),
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 503

    if "image" not in request.files:
        return jsonify({"error": "No image file provided in the request."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename --- please select a valid image."}), 400

    allowed_exts = {".jpg", ".jpeg", ".png"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_exts:
        return jsonify({"error": f"Unsupported file type '{ext}'. Upload PNG or JPEG."}), 400

    raw_bytes = file.read()
    if len(raw_bytes) > MAX_FILE_BYTES:
        return jsonify({"error": "File exceeds the 15 MB limit."}), 413

    try:
        threshold = float(request.form.get("threshold", DEFAULT_THRESHOLD))
        threshold = max(0.05, min(0.99, threshold))
    except (TypeError, ValueError):
        threshold = DEFAULT_THRESHOLD

    try:
        pil_img = Image.open(io.BytesIO(raw_bytes))
        pil_img.verify()
        pil_img = Image.open(io.BytesIO(raw_bytes))
    except Exception:
        return jsonify({"error": "Unable to decode the image. Is it a valid chest X-ray?"}), 400

    try:
        input_tensor = preprocess_image(pil_img)
    except Exception as exc:
        logger.exception("Preprocessing error")
        return jsonify({"error": f"Image preprocessing failed: {exc}"}), 500

    try:
        raw_output = model.predict(input_tensor, verbose=0)
        if raw_output.shape[-1] == 1:
            pneumonia_prob = float(raw_output[0, 0])
        else:
            pneumonia_prob = float(raw_output[0, 1])
        normal_prob = 1.0 - pneumonia_prob
    except Exception as exc:
        logger.exception("Inference error")
        return jsonify({"error": f"Model inference failed: {exc}"}), 500

    prediction = "PNEUMONIA" if pneumonia_prob >= threshold else "NORMAL"
    confidence = (
        pneumonia_prob * 100 if prediction == "PNEUMONIA" else normal_prob * 100
    )

    try:
        gradcam_b64, heatmap_b64 = compute_gradcam(input_tensor, pil_img)
    except Exception as exc:
        logger.warning("Grad-CAM generation failed: %s", exc)
        gradcam_b64 = None
        heatmap_b64 = None

    return jsonify({
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "pneumonia_probability": round(pneumonia_prob, 6),
        "normal_probability": round(normal_prob, 6),
        "threshold": threshold,
        "gradcam_url": gradcam_b64,
        "heatmap_url": heatmap_b64,
    })


if __name__ == "__main__":
    load_model()
    logger.info("Starting Flask dev server on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False)
