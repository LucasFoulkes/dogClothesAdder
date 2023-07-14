function ImageDisplay({ imageURL }) {
  return (
    imageURL && (
      <img id="current-image" src={imageURL} alt="Current Image" height={500} />
    )
  );
}

export default ImageDisplay;
