// src/components/Base/Form/FormRadioGroup.tsx

import React, { ChangeEvent } from "react";

interface FormRadioGroupProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ name, value, onChange, options, style }) => {
  return (
    <div style={style}>
      {options.map((option) => (
        <label key={option.value} style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            style={{ marginRight: '10px' }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default FormRadioGroup;
