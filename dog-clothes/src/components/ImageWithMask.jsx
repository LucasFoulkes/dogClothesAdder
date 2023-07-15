/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const ImageWithMask = ({ originalImage, maskImage }) => {
  const canvasRef = useRef(null);

  const editPixels = (data) => {
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3];

      if ((red === 255 && green === 255 && blue === 255) || alpha === 0) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.src = URL.createObjectURL(originalImage);

    const mask = new Image();
    mask.src = maskImage;

    const loadImages = [
      new Promise((resolve) => {
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        mask.onload = resolve;
      }),
    ];

    Promise.all(loadImages).then(() => {
      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(mask, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      editPixels(imageData.data);

      context.putImageData(imageData, 0, 0);
    });
  }, [originalImage, maskImage]);

  return (
    <div className="relative h-2/3">
      <img
        src={URL.createObjectURL(originalImage)}
        alt="Original"
        className="h-full"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full opacity-80"
      />
    </div>
  );
};

export default ImageWithMask;
