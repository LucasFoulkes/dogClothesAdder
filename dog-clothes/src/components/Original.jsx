/* eslint-disable react/prop-types */
import { useState } from "react";
import { BounceLoader } from "react-spinners";

const Original = ({ setOriginalImage }) => {
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileSelected(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = () => {
        setLoading(true);
      };
      reader.onloadend = () => {
        setLoading(false);
        setOriginalImage(reader.result);
      };
    }
  };

  if (!fileSelected) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="upload-button"
        />
        <label
          htmlFor="upload-button"
          className="bg-zinc-900 px-4 py-2 rounded-md border-white border-2 capitalize cursor-pointer"
        >
          Upload Image
        </label>
        {loading && (
          <div className="flex flex-col items-center justify-center">
            <BounceLoader color="#123abc" size={50} />
          </div>
        )}
      </div>
    );
  }

  // If file is selected, you can return something else here, or nothing at all
  return null;
};

export default Original;
