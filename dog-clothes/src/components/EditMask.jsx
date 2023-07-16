/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export default function EditMask({ mask, originalImage, setEditedMask }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false); // State to track whether the mouse button is pressed
  const [brushSize, setBrushSize] = useState(25); // State to control the size of the brush
  const [brushColor, setBrushColor] = useState("black"); // State to control the color of the brush
  const [isEditable, setIsEditable] = useState(true); // State to control whether the canvas is editable

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);
  };

  const toggleBrushColor = () => {
    setBrushColor(brushColor === "black" ? "white" : "black");
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    setEditedMask(canvas.toDataURL("image/png"));
    setIsEditable(false);
  };

  useEffect(() => {
    if (!mask) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = img.width / rect.width;
      const scaleY = img.height / rect.height;

      mousePos.current = {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
      if (isMouseDown && isEditable) {
        ctx.beginPath();
        ctx.arc(
          mousePos.current.x,
          mousePos.current.y,
          brushSize, // Use the current brush size from the state
          0,
          2 * Math.PI,
          false
        );
        ctx.fillStyle = brushColor; // Use the current brush color from the state
        ctx.fill();
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mask, isMouseDown, brushSize, brushColor, isEditable]); // React hook dependency array

  if (mask) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={originalImage}
          alt="Original"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        <img ref={imgRef} src={mask} alt="Mask" style={{ display: "none" }} />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            width: window.innerWidth < 768 ? "100%" : "auto",
            height: window.innerWidth < 768 ? "auto" : "100%",
            objectFit: "contain",
            opacity: 0.5, // Semi-transparent canvas
          }}
        />
        <button
          onClick={resetCanvas}
          style={{ position: "absolute", top: 10, right: 10 }}
          className="bg-zinc-900"
        >
          Reset Canvas
        </button>
        <button
          onClick={saveCanvas}
          style={{ position: "absolute", top: 130, right: 10 }}
          className="bg-zinc-900"
        >
          Save Canvas
        </button>
        <input
          type="range"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          style={{ position: "absolute", top: 50, right: 10 }}
        />
        <button
          onClick={toggleBrushColor}
          style={{
            position: "absolute",
            top: 90,
            right: 10,
            backgroundColor: brushColor,
            color: brushColor === "black" ? "white" : "black",
          }}
        >
          {brushColor === "black" ? "Black Brush" : "White Brush"}
        </button>
      </div>
    );
  }

  return null;
}
