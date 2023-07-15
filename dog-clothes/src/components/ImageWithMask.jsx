import { useEffect, useRef, useState } from "react";

const ImageWithMask = ({ originalImage, maskImage, setEditedMask }) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const mousePressed = useRef(false);
  const circleRadius = useRef(50);
  const [radius, setRadius] = useState(50);
  const [showCanvas, setShowCanvas] = useState(true);
  const [editedImage, setEditedImage] = useState(null);
  let animationFrameId;

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

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = URL.createObjectURL(originalImage);

    const mask = new Image();
    mask.src = maskImage;

    Promise.all([
      new Promise((resolve) => {
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        mask.onload = resolve;
      }),
    ]).then(() => {
      context.drawImage(mask, 0, 0, canvas.width, canvas.height);

      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      editPixels(imageData.data);
      context.putImageData(imageData, 0, 0);
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setEditedMask(dataUrl);
    setEditedImage(dataUrl);
    setShowCanvas(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.src = URL.createObjectURL(originalImage);

    const mask = new Image();
    mask.src = maskImage;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
    };

    const handleMouseDown = () => {
      mousePressed.current = true;
    };

    const handleMouseUp = () => {
      mousePressed.current = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    Promise.all([
      new Promise((resolve) => {
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        mask.onload = resolve;
      }),
    ]).then(() => {
      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(mask, 0, 0, canvas.width, canvas.height);

      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      editPixels(imageData.data);
      context.putImageData(imageData, 0, 0);

      const render = () => {
        if (mousePressed.current) {
          context.save();
          context.translate(mousePos.current.x, mousePos.current.y);
          context.fillStyle = "#000000";
          context.beginPath();
          context.arc(0, 0, circleRadius.current, 0, 2 * Math.PI, false);
          context.fill();
          context.restore();
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [originalImage, maskImage]);

  return (
    <div className="relative h-2/3">
      <img
        src={URL.createObjectURL(originalImage)}
        alt="Original"
        className="h-full"
      />
      {showCanvas ? (
        <>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 h-full opacity-30"
          />
          <input
            type="range"
            min="10"
            max="200"
            value={radius}
            onChange={(e) => {
              setRadius(e.target.value);
              circleRadius.current = e.target.value;
            }}
            className="absolute top-0 right-0"
          />
          <button
            onClick={resetCanvas}
            className="absolute top-0 right-0 m-4 bg-zinc-900"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="absolute top-20 right-0 m-4 bg-zinc-900"
          >
            Save
          </button>
        </>
      ) : (
        <img
          src={editedImage}
          alt="Edited"
          className="absolute top-0 left-0 h-full"
        />
      )}
    </div>
  );
};

export default ImageWithMask;
