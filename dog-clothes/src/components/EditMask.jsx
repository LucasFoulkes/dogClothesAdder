/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Controller from "./Controller"; // Import the Controller component

export default function EditMask({ mask, originalImage, setEditedMask }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [brushSize, setBrushSize] = useState(25);
  const [brushColor, setBrushColor] = useState("black");
  const [isEditable, setIsEditable] = useState(true);

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
          brushSize,
          0,
          2 * Math.PI,
          false
        );
        ctx.fillStyle = brushColor;
        ctx.fill();
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      handleMouseMove(touch);
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      handleMouseDown();
    };

    const handleTouchEnd = (event) => {
      event.preventDefault();
      handleMouseUp();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mask, isMouseDown, brushSize, brushColor, isEditable]);

  if (mask) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
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
            opacity: 0.5,
          }}
        />
        <Controller
          resetCanvas={resetCanvas}
          saveCanvas={saveCanvas}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          toggleBrushColor={toggleBrushColor}
          brushColor={brushColor}
        />
      </div>
    );
  }

  return null;
}
