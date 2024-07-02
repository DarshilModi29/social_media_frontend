import React from "react";

const Button = ({
  type = "",
  label = "",
  className = "",
  onClick = () => null,
  children,
}) => {
  return (
    <div>
      <button
        type={type}
        className={`${className} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
        onClick={onClick}
      >
        {label || children}
      </button>
    </div>
  );
};

export default Button;
