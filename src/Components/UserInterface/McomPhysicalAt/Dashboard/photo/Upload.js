import React, { useState, useEffect } from "react";

// Wrapper Component
const Upload = ({ children }) => {
  const containerStyle = {
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "8px",
    width: "300px",
    margin: "10px 10px",
    textAlign: "center",
  };

  return <div style={containerStyle}>{children}</div>;
};

// Header Sub-Component
Upload.Header = function Header({ title }) {
  const headerStyle = {
    fontSize: "18px",
    marginBottom: "12px",
  };

  return <h3 style={headerStyle}>{title}</h3>;
};

// Input Sub-Component
Upload.Input = function Input({ onFileChange }) {
  const inputStyle = {
    margin: "12px 0",
  };

  return (
    <div style={inputStyle}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onFileChange(file);
        }}
      />
    </div>
  );
};

// Preview Sub-Component
Upload.Preview = function Preview({ file }) {
  const [preview, setPreview] = useState(null);

  const previewStyle = {
    marginTop: "12px",
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  return (
    <div style={previewStyle}>
      {preview ? <img src={preview} alt="Preview" style={imageStyle} /> : <p>No image selected</p>}
    </div>
  );
};

// Button Sub-Component
Upload.Button = function Button({ onClick, disabled }) {
  const buttonStyle = {
    backgroundColor: disabled ? "#ccc" : "#007bff",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    marginTop: "12px",
  };

  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      Upload
    </button>
  );
};

export default Upload;
