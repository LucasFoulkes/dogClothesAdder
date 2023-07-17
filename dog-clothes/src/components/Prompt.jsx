/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./Prompt.module.scss";
import useGenerate from "./useGenerate";
import GridLoader from "react-spinners/GridLoader";

export default function Prompt({ originalImage, dogMask }) {
  const [inputText, setInputText] = useState("Bright red Hawaiian shirt");
  const { generatedImage, isLoading, generateImage, resetImage } = useGenerate(
    originalImage,
    dogMask
  );

  const handleButtonClick = () => {
    generateImage(inputText);
  };

  const handleGenerateAgain = () => {
    resetImage();
  };

  return (
    <div className={styles.imageContainer}>
      {!generatedImage && (
        <img className={styles.img} src={originalImage} alt="orignalImage" />
      )}
      {generatedImage && (
        <img className={styles.img} src={generatedImage} alt="generatedImage" />
      )}
      <div className={styles.overlay}>
        {isLoading && <GridLoader color="#ffffff" size={30} />}

        {!generatedImage && (!isLoading || isLoading === undefined) && (
          <form className={styles.textForm}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              Generate
            </button>
          </form>
        )}
      </div>
      {generatedImage && (
        <button onClick={handleGenerateAgain}>Generate Again</button>
      )}
    </div>
  );
}
