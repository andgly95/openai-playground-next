import React from "react";

interface ModelSelectorProps {
  model: string;
  isChangingModel: boolean;
  setModel: (model: string) => void;
  setIsChangingModel: (isChanging: boolean) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  model,
  isChangingModel,
  setModel,
  setIsChangingModel,
}) => {
  const modelOptions = ["dall-e-3", "dall-e-2"];

  return (
    <>
      {!isChangingModel ? (
        <button
          className="flex text-white text-sm"
          onClick={() => setIsChangingModel(true)}
        >
          {model}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="shrink-0 ml-1 mt-1 text-text-500"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
      ) : (
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setIsChangingModel(false);
          }}
          className="border border-gray-300 bg-neutral-400 px-4 py-2 rounded-md"
        >
          {modelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default ModelSelector;
