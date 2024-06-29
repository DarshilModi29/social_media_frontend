import React from "react";

const Button = ({ type = "", label = "", className = "", children }) => {
  return (
    <button
      type={type}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
    >
      {label || children}
    </button>
  );
};

export default Button;
