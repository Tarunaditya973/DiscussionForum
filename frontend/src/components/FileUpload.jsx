import { useState } from "react";

export default function FileUpload({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const convertToBase64 = (event) => {
    const file = event.target.files[0];

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      alert(
        "Unsupported file format. Please select a JPG, JPEG, or PNG image."
      );
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64URL = event.target.result;
      setPreviewImage(base64URL);
      onFileSelect(base64URL); // Pass the base64 URL to the parent component
    };

    reader.onerror = (error) => {
      console.error("Error:", error);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner" style={{ width: "auto" }}>
        {previewImage && (
          <img src={previewImage} alt="Selected image preview" />
        )}

        <input accept="image/*" type="file" onChange={convertToBase64} />
      </div>
    </div>
  );
}
