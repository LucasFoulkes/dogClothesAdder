import { useState } from "react";
import axios from "axios";

const useGenerate = (originalImage, dogMask) => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (inputText) => {
    setIsLoading(true);

    try {
      let formData = new FormData();

      const fetchOriginalImage = fetch(originalImage).then((res) => res.blob());
      const fetchDogMask = fetch(dogMask).then((res) => res.blob());

      const [originalImageBlob, dogMaskBlob] = await Promise.all([
        fetchOriginalImage,
        fetchDogMask,
      ]);

      formData.append("file", originalImageBlob, "originalImage.png");
      formData.append("prediction", dogMaskBlob, "dogMask.png");

      formData.append("clothing_prompt", inputText);

      const response = await axios.post(
        `${window.location.origin}/generate`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "arraybuffer", // Important for handling binary data
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImage(imageUrl);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetImage = () => {
    setGeneratedImage(null);
  };

  return { generatedImage, isLoading, generateImage, resetImage };
};

export default useGenerate;
