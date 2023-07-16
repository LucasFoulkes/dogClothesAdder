/* eslint-disable react/prop-types */

const Controller = ({
  resetCanvas,
  saveCanvas,
  brushSize,
  setBrushSize,
  toggleBrushColor,
  brushColor,
}) => {
  return (
    <div className="absolute top-0  flex flex-row items-center justify-center p-5 w-full">
      <div className="flex flex-col items-center justify-center p-2 space-y-2">
        <button
          onClick={resetCanvas}
          className="bg-zinc-900 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded w-24"
        >
          Reset
        </button>
        <button
          onClick={saveCanvas}
          className="bg-zinc-900 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded w-24"
        >
          Generate
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-2 space-y-2">
        <input
          type="range"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="slider bg-zinc-900"
        />
        <button
          onClick={toggleBrushColor}
          className={`font-bold py-2 px-4 rounded w-24 ${
            brushColor === "black"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          {brushColor === "black" ? "Black Brush" : "White Brush"}
        </button>
      </div>
    </div>
  );
};

export default Controller;
