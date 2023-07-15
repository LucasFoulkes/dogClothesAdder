/* eslint-disable react/prop-types */
import { useState } from "react";

const UploadImage = ({ setOriginalImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setOriginalImage(file);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <>
      {selectedImage ? (
        <img src={selectedImage} alt="Selected" className="max h-2/3" />
      ) : (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}
    </>
  );
};

export default UploadImage;
