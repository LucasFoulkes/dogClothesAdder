/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Circle } from "react-konva";
import Konva from "konva";
import styles from "./EditMask.module.scss";

export default function EditMask({
  dogMask,
  setDogMask,
  originalImage,
  setEdited,
}) {
  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const bottomRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [maskImage, setMaskImage] = useState(null);
  const [circlePos, setCirclePos] = useState([]);
  const [brushColor, setBrushColor] = useState("black");
  const radius = 20;

  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      setDimensions({ width: image.width, height: image.height });
    }

    const img = new window.Image();
    img.src = dogMask;
    img.onload = () => {
      setMaskImage(img);
    };
  }, []);

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const handleMove = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setCirclePos((oldPos) => [...oldPos, { ...pos, color: brushColor }]);
  };

  const toggleBrushColor = () => {
    setBrushColor((prevColor) => (prevColor === "black" ? "white" : "black"));
  };

  const generateMask = () => {
    const stage = stageRef.current;
    if (stage) {
      const url = stage.toDataURL();
      setDogMask(url);
      setEdited(true);
    }
  };

  return (
    <div className={styles.imageContainer}>
      <button
        className={styles.brushToggle}
        onClick={toggleBrushColor}
        style={{
          backgroundColor: brushColor,
          color: brushColor === "black" ? "white" : "black",
        }}
      >
        Brush Color
      </button>
      <button onClick={generateMask}>Generate</button>
      <img
        ref={imageRef}
        src={originalImage}
        alt="Original"
        className={styles.img}
        onLoad={() => {
          setDogMask(dogMask);
        }}
      />
      <div className={styles.overlay}>
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          <Layer>
            {maskImage && (
              <Image
                image={maskImage}
                width={dimensions.width}
                height={dimensions.height}
                filters={[Konva.Filters.RGBA]}
              />
            )}
            {circlePos.map((pos, i) => (
              <Circle
                key={i}
                x={pos.x}
                y={pos.y}
                radius={radius}
                fill={pos.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
