/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import GridLoader from "react-spinners/GridLoader";

export default function LastMask({ editedMask, originalImage }) {
  const [editedImageSrc, setEditedImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processImage = async () => {
      setLoading(true);
      const formData = new FormData();

      // Convert images to PNG format and append to form data
      const originalImageBlob = await fetch(originalImage).then((r) =>
        r.blob()
      );
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
        editImage(url);
      } catch (error) {
        console.error("An error occurred while processing the image:", error);
        setLoading(false);
      }
    };

    const editImage = async (imageSrc) => {
      const formData = new FormData();
      const imageBlob = await fetch(imageSrc).then((r) => r.blob());
      formData.append("file", imageBlob, "processed.png");

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
        setLoading(false);
      } catch (error) {
        console.error("An error occurred while editing the image:", error);
        setLoading(false);
      }
    };

    if (editedMask && originalImage) {
      processImage();
    }
  }, [editedMask, originalImage]);

  return (
    <div className="h-full flex items-center justify-center">
      {loading ? (
        <GridLoader color="#ffffff" size={30} />
      ) : (
        editedImageSrc && (
          <img src={editedImageSrc} alt="Edited image" className="h-full" />
        )
      )}
    </div>
  );
}
