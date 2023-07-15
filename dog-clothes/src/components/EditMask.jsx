/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

// EditMask component allows to draw a circle on a mask image at the current mouse position
export default function EditMask({ mask, originalImage, setEditedMask }) {
  // References to the image and canvas elements and the current mouse position
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false); // State to track whether the mouse button is pressed
  const [brushSize, setBrushSize] = useState(25); // State to control the size of the brush
  const [brushColor, setBrushColor] = useState("black"); // State to control the color of the brush
  const [isEditable, setIsEditable] = useState(true); // State to control whether the canvas is editable

  // Function to clear the canvas and redraw the mask image
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the mask image
    ctx.drawImage(img, 0, 0, img.width, img.height);
  };

  // Function to toggle the color of the brush
  const toggleBrushColor = () => {
    setBrushColor(brushColor === "black" ? "white" : "black");
  };

  // Function to save the canvas as a PNG image
  const saveCanvas = () => {
    const canvas = canvasRef.current;

    // Convert the canvas to a PNG image and save it to the state
    setEditedMask(canvas.toDataURL("image/png"));

    // Make the canvas uneditable
    setIsEditable(false);
  };

  // useEffect hook to add event listeners and start the animation when the mask changes
  useEffect(() => {
    // If mask is not defined, do nothing
    if (!mask) return;

    // Get references to the image and canvas elements and the canvas context
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Event handler for the mousemove event
    const handleMouseMove = (event) => {
      // Get the bounding rectangle of the canvas
      const rect = canvas.getBoundingClientRect();
      // Calculate the scale factors based on the actual dimensions of the image
      const scaleX = img.width / rect.width;
      const scaleY = img.height / rect.height;

      // Update the current mouse position
      mousePos.current = {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };

      // If the mouse button is pressed, draw a circle at the current mouse position
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

    // Event handlers for the mousedown and mouseup events
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    // Add the mousemove, mousedown, and mouseup event listeners to the canvas
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    // When the image is loaded, set the dimensions of the canvas and draw the mask image
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };

    // Remove the event listeners when the component unmounts
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mask, isMouseDown, brushSize, brushColor, isEditable]); // React hook dependency array

  // Render the image, mask, and canvas elements if mask is defined
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
            height: "100%",
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

  // If mask is not defined, render nothing
  return null;
}
