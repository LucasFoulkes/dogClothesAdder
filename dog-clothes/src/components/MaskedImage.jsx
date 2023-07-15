import React, { useEffect, useState } from "react";
import axios from "axios";

const MaskedImage = ({ editedMask, originalImage }) => {
  const [processedImage, setProcessedImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [editedImageUrl, setEditedImageUrl] = useState(null);

  const processImage = async () => {
    const responseOriginal = await fetch(originalImage);
    const blobOriginal = await responseOriginal.blob();
    const fileOriginal = new File([blobOriginal], "original.png", {
      type: "image/png",
    });

    const responseEdited = await fetch(editedMask);
    const blobEdited = await responseEdited.blob();

    // Create an image object
    const img = new Image();
    img.src = URL.createObjectURL(blobEdited);
    await new Promise((resolve) => (img.onload = resolve));

    // Create a canvas and draw the image onto it
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Convert the image to grayscale
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas to a blob
    const editedBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    const fileEdited = new File([editedBlob], "edited.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("file", fileOriginal);
    formData.append("prediction", fileEdited);

    const serverResponse = await axios.post(
      "http://localhost:5000/process",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      }
    );

    const url = URL.createObjectURL(serverResponse.data);
    setProcessedImage(url);
    setOriginalImageUrl(URL.createObjectURL(fileOriginal));
    setEditedImageUrl(URL.createObjectURL(fileEdited));
  };

  useEffect(() => {
    if (editedMask) {
      processImage();
    }
  }, [editedMask]);

  return (
    <div>
      {originalImageUrl && <img src={originalImageUrl} alt="Original" />}
      {editedImageUrl && <img src={editedImageUrl} alt="Edited" />}
      {processedImage && <img src={processedImage} alt="Processed" />}
      <button onClick={processImage} className="bg-zinc-900">
        Process
      </button>
    </div>
  );
};

export default MaskedImage;
