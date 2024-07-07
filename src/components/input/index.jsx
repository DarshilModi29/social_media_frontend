import React from "react";

const Input = ({
  name = "",
  label = "",
  type = "text",
  placeholder = "",
  className = "",
  value = "",
  onChange = () => null,
  isRequired = true,
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        id={name}
        className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
        value={value}
        onChange={onChange}
        required={isRequired}
      />
    </div>
  );
};

export default Input;
