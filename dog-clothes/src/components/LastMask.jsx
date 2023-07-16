/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import GridLoader from "react-spinners/GridLoader";

export default function LastMask({ editedMask, originalImage }) {
  const [processedImageSrc, setProcessedImageSrc] = useState(null);
  const [editedImageSrc, setEditedImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clothingPrompt, setClothingPrompt] = useState(
    "bright hawaian red hawaian shirt"
  );
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [showEditAgainButton, setShowEditAgainButton] = useState(false);

  useEffect(() => {
    if (editedMask && originalImage) {
      processImage();
    }
  }, [editedMask, originalImage]);

  const processImage = async () => {
    setLoading(true);
    const formData = new FormData();

    // Convert images to PNG format and append to form data
    const originalImageBlob = await fetch(originalImage).then((r) => r.blob());
    const editedMaskBlob = await fetch(editedMask).then((r) => r.blob());
    formData.append("file", originalImageBlob, "original.png");
    formData.append("prediction", editedMaskBlob, "mask.png");

    try {
      const response = await axios.post(
        "http://localhost:5000/process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setProcessedImageSrc(url);
      setShowPromptInput(true);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while processing the image:", error);
      setLoading(false);
    }
  };

  const editImage = async () => {
    setLoading(true);
    setShowPromptInput(false);
    const formData = new FormData();

    // Fetch the processed image and convert it to a blob before appending to form data
    const imageBlob = await fetch(processedImageSrc).then((r) => r.blob());
    formData.append("file", imageBlob, "processed.png");
    formData.append("clothing_prompt", clothingPrompt);

    try {
      const response = await axios.post(
        "http://localhost:5000/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setEditedImageSrc(url);
      setShowEditAgainButton(true);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while editing the image:", error);
      setLoading(false);
    }
  };

  const handlePromptSubmit = (event) => {
    event.preventDefault();
    editImage();
  };

  const handleEditAgain = () => {
    setShowEditAgainButton(false);
    setShowPromptInput(true);
  };

  return (
    <div className="h-full flex items-center justify-center relative">
      {loading && <GridLoader color="#ffffff" size={30} />}
      {showPromptInput && (
        <div className="absolute inset-0 flex items-center justify-center">
          <form
            onSubmit={handlePromptSubmit}
            className="p-4 bg-black text-white rounded flex flex-col items-center"
          >
            <input
              type="text"
              value={clothingPrompt}
              onChange={(e) => setClothingPrompt(e.target.value)}
              placeholder="Enter clothing prompt"
              className="mr-2 p-1 bg-black text-white mb-2"
            />
            <button
              type="submit"
              className="p-1 bg-black text-white rounded border border-white"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {showEditAgainButton && (
        <button
          onClick={handleEditAgain}
          className="absolute bottom-0 right-0 m-4 p-2 bg-black text-white rounded"
        >
          Edit Again
        </button>
      )}
      {editedImageSrc && (
        <img
          src={editedImageSrc}
          alt="Edited image"
          className="h-full"
          style={{
            width: window.innerWidth < 768 ? "100%" : "auto",
            height: window.innerWidth < 768 ? "auto" : "100%",
          }}
        />
      )}
    </div>
  );
}
