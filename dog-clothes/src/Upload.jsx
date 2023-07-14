import { useState } from "react";
import Form from "./Form";

function Upload() {
  const [image, setImage] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState(null);
  const [step, setStep] = useState(0);

  const handleChange = async (e) => {
    setImage(e.target.files[0]);
    setCurrentImageURL(URL.createObjectURL(e.target.files[0]));
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      setCurrentImageURL(URL.createObjectURL(blob));
      setStep(2);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();

    const response = await fetch(currentImageURL);
    const maskBlob = await response.blob();

    const formData = new FormData();
    formData.append("file", image);
    formData.append("prediction", maskBlob);

    try {
      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      setCurrentImageURL(URL.createObjectURL(blob));
      setStep(3);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    // Fetch the processed image from its URL and create a Blob object
    const response = await fetch(currentImageURL);
    const processedImageBlob = await response.blob();

    // Create a FormData instance and append the processed image Blob
    const formData = new FormData();
    formData.append("file", processedImageBlob);

    try {
      const response = await fetch("http://localhost:5000/edit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      setCurrentImageURL(URL.createObjectURL(blob));
      setStep(4);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    setImage(null);
    setCurrentImageURL(null);
    setStep(0);
  };

  return (
    <Form
      step={step}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleProcess={handleProcess}
      handleEdit={handleEdit}
      handleReset={handleReset}
      currentImageURL={currentImageURL}
    />
  );
}

export default Upload;
