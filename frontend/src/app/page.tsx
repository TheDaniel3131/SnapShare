"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-green-500 to-teal-500 p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center text-white">
      SnapShare
      </h1>
      <input
      type="file"
      onChange={handleFileChange}
      className="mb-4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
      onClick={handleUpload}
      className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      Upload
      </button>

      {imageUrl && (
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">
        Uploaded Photo
        </h2>
        <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        >
        <Image
          src={imageUrl}
          alt="Uploaded"
          className="max-w-full h-auto rounded-lg shadow-lg"
          width={300}
          height={300}
        />
        </a>
      </div>
      )}
    </div>
  );
}
