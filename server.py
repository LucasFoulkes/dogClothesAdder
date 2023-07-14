from flask import Flask, request, send_file
from PIL import Image
import torch
from torchvision import models, transforms
import numpy as np
import cv2
import io
from flask_cors import CORS
import openai
import requests
from io import BytesIO

openai.api_key = "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"

model = models.segmentation.deeplabv3_resnet101(pretrained=True)
model.eval()

preprocess = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)

app = Flask(__name__)
CORS(app)


def get_prediction_mask(file):
    input_tensor = preprocess(file.convert("RGB"))
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model(input_batch)["out"][0]
    output_predictions = output.argmax(0)
    output_predictions = output_predictions.byte().cpu().numpy()
    output_predictions[output_predictions != 12] = 0
    return output_predictions


def apply_transparency(file, prediction):
    mask = file.copy()
    mask_np = np.array(mask)
    mask_np[prediction == 12, 3] = 0
    return Image.fromarray(mask_np)


def image_to_byte_arr(image):
    byte_arr = io.BytesIO()
    image.save(byte_arr, format="PNG")
    return byte_arr.getvalue()


@app.route("/predict", methods=["POST"])
def predict():
    file = Image.open(request.files["file"].stream).convert("RGBA")
    prediction = get_prediction_mask(file)
    image = Image.fromarray(prediction)
    byte_arr = image_to_byte_arr(image)
    return send_file(io.BytesIO(byte_arr), mimetype="image/png")


@app.route("/process", methods=["POST"])
def process():
    file = Image.open(request.files["file"].stream).convert("RGBA")
    prediction_image = Image.open(request.files["prediction"].stream)
    prediction_image = prediction_image.resize((file.width, file.height))
    prediction = np.array(prediction_image)
    mask = apply_transparency(file, prediction)
    byte_arr = image_to_byte_arr(mask)
    return send_file(io.BytesIO(byte_arr), mimetype="image/png")


from PIL import ImageOps


@app.route("/edit", methods=["POST"])
def edit():
    try:
        file = Image.open(request.files["file"].stream).convert("RGBA")
        file.thumbnail((256, 256))
        mask = ImageOps.pad(file, (256, 256), color="white")
        byte_arr = image_to_byte_arr(mask)

        response = openai.Image.create_edit(
            image=byte_arr,
            prompt="photograph of a dog wearing a bright blue shirt",
            n=1,
            size="256x256",
        )
        image_url = response["data"][0]["url"]
        response = requests.get(image_url)
        edited_img = Image.open(BytesIO(response.content))
        edited_byte_arr = image_to_byte_arr(edited_img)
        return send_file(io.BytesIO(edited_byte_arr), mimetype="image/png")

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}, 400


if __name__ == "__main__":
    app.run(port=5000, debug=True)
