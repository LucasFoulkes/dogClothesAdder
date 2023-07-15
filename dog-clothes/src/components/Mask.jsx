/* eslint-disable react/prop-types */
import { useState } from "react";

const Mask = ({ originalImage, setMaskImage }) => {
  const [localMaskImage, setLocalMaskImage] = useState(null);

  const handleMask = async () => {
    const formData = new FormData();
    formData.append("file", originalImage);

    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const maskImageUrl = URL.createObjectURL(blob);
      setMaskImage(maskImageUrl); // Update the mask image state in the parent component
      setLocalMaskImage(maskImageUrl); // Update the local mask image state
    } else {
      console.error("Failed to generate mask");
    }
  };

  return (
    <>
      {!localMaskImage && originalImage && (
        <button
          onClick={handleMask}
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border-white border-2 "
        >
          Generate Mask
        </button>
      )}
    </>
  );
};

export default Mask;
