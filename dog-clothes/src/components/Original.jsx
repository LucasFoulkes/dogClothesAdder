/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import pica from "pica";

export default function Original({ setOriginalImage }) {
  const fileInput = useRef();
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      const url = URL.createObjectURL(img);
      setImage(url);
      setLoading(true); // Set loading to true immediately after a file is selected

      const imgElem = new Image();
      imgElem.onload = function () {
        setImageSize({
          width: this.width,
          height: this.height,
        });
      };
      imgElem.src = url;
    } else {
      setLoading(false); // If no file is selected (dialog is cancelled), set loading back to false
    }
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  useEffect(() => {
    if (image && imageSize.width && imageSize.height) {
      const screenWidth = window.innerWidth;
      const aspectRatio = imageSize.width / imageSize.height;
      const screenHeight = screenWidth / aspectRatio;

      const canvas = document.createElement("canvas");
      canvas.width = screenWidth;
      canvas.height = screenHeight;

      const imgElem = new Image();
      imgElem.onload = function () {
        pica()
          .resize(this, canvas)
          .then((result) => pica().toBlob(result, "image/jpeg", 0.9))
          .then((blob) => {
            setOriginalImage(URL.createObjectURL(blob));
            setLoading(false);
          });
      };
      imgElem.src = image;
    }
  }, [image, imageSize, setOriginalImage]);

  return (
    <>
      {!loading && <button onClick={handleClick}>Upload Image</button>}
      {loading && <p>Uploading...</p>}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </>
  );
}
