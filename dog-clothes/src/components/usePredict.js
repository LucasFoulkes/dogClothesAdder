import { useState, useEffect } from "react";
import axios from "axios";

export default function usePredict(file) {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file) {
      sendImage(file);
    }
  }, [file]);

  const sendImage = async (imageFile) => {
    const blob = await fetch(imageFile).then((r) => r.blob());
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", blob);

      const response = await axios.post(
        `${window.location.origin}/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );

      const image = new Blob([response.data], { type: "image/png" });
      const imageSrc = URL.createObjectURL(image);

      setPrediction(imageSrc);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return { loading, prediction, error, sendImage };
}
