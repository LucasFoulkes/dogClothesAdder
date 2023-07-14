import FileInput from "./FileInput";
import ActionButton from "./ActionButton";
import ImageDisplay from "./ImageDisplay";

function Form({
  step,
  handleChange,
  handleSubmit,
  handleProcess,
  handleEdit,
  handleReset,
  currentImageURL,
}) {
  return (
    <form>
      {step === 0 && <FileInput onChange={handleChange} />}
      {step === 1 && <ActionButton onClick={handleSubmit} label="Upload" />}
      {step === 2 && <ActionButton onClick={handleProcess} label="Process" />}
      {step === 3 && <ActionButton onClick={handleEdit} label="Edit" />}
      {step === 4 && <ActionButton onClick={handleReset} label="Reset" />}
      <div>
        <ImageDisplay imageURL={currentImageURL} />
      </div>
    </form>
  );
}

export default Form;
