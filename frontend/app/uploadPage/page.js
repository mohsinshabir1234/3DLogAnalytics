"use client";
import React, { useState } from "react";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first");
      return;
    }
    if (onUpload) onUpload(file);
    alert(`File "${file.name}" uploaded successfully!`);
    setFile(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC)",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            color: "#4364F7",
            fontWeight: "bold",
          }}
        >
          Upload File
        </h2>

        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background:
              "linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC)",
            color: "white",
            fontWeight: "700",
            fontSize: "1.1rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </form>
    </div>
  );
}
