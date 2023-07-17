/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import styles from "./Pick.module.scss";
import usePredict from "./usePredict";

export default function Pick({ originalImage, setOriginalImage, setDogMask }) {
  const { loading, prediction, error, sendImage } = usePredict(null);
  const [pick, setPick] = useState(false);

  const handleKeep = async () => {
    if (originalImage) {
      setPick(true);
      sendImage(originalImage);
    }
  };

  const handleChange = () => {
    setOriginalImage(null);
  };

  useEffect(() => {
    if (prediction) {
      setDogMask(prediction);
    }
  }, [prediction, setDogMask]);

  if (error) return <div>Error occurred: {error}</div>;

  return (
    <div className={styles.imageContainer}>
      {!prediction && (
        <img className={styles.img} src={originalImage} alt="Original" />
      )}
      <div className={styles.overlay}>
        {loading && <GridLoader color="#ffffff" size={30} />}
        {!pick && (
          <>
            <button onClick={handleKeep}>KEEP</button>
            <hr />
            <button onClick={handleChange}>CHANGE</button>
          </>
        )}
      </div>
    </div>
  );
}
