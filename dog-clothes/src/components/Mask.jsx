/* eslint-disable react/prop-types */
import { useState } from "react";
import GridLoader from "react-spinners/GridLoader";

const Mask = ({ originalImage, setMaskImage }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [mask, setMask] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    setOverlayVisible(true);
  };

  const handleChangePicture = () => {
    window.location.reload();
  };

  const handleContinue = async () => {
    setLoading(true);
    setOverlayVisible(false);
    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.png");

      const serverResponse = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!serverResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const predictionBlob = await serverResponse.blob();
      const url = URL.createObjectURL(predictionBlob);
      setMaskImage(url);
      setMask(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mask) {
    return (
      <>
        {originalImage && (
          <img
            src={originalImage}
            alt="Original"
            className="max-h-full cursor-pointer"
            onClick={handleImageClick}
          />
        )}
        {overlayVisible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-20">
            <button
              onClick={handleChangePicture}
              className="bg-zinc-900 w-full  py-2 rounded-md border-white border-2 capitalize cursor-pointer mb-4"
            >
              Change Picture
            </button>
            <button
              onClick={handleContinue}
              className="bg-zinc-900 w-full py-2 rounded-md border-white border-2 capitalize cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <GridLoader color="#ffffff" size={30} />
          </div>
        )}
      </>
    );
  }
};

export default Mask;
