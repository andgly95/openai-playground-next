import React from "react";

interface ModelSelectorProps {
  model: string;
  modelOptions: string[];
  setModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  model,
  modelOptions,
  setModel,
}) => {
  return (
    <div>
      <select
        value={model}
        onChange={(e) => {
          setModel(e.target.value);
        }}
        className="bg-transparent shrink-0 text-white margin-right-auto text-sm rounded-md"
      >
        {modelOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
