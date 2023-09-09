"use client";
import { useState } from "react";

import Image from "next/image";
import axios from "axios";
import { Buffer } from "buffer";

export default function Home() {
  const [message, setMessage] = useState("initial");

  const handleUploadClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    // const bf = Buffer.from(file, "base64");
    formData.append("name", file.name);
    formData.append("file", file);
    // let s = Buffer.from(formData.toString("base64");
    console.log(file);
    // console.log(formData.keys);

    try {
      setMessage("uploading...");
      await axios
        .post(
          "https://h5g5tm8jr0.execute-api.ap-northeast-1.amazonaws.com/v1/upload",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setMessage("completed");
        });
    } catch (e) {
      console.error(e);
      setMessage("catch error");
    }
  };

  return (
    <main className="flex  flex-col items-center justify-between p-24">
      <label
        htmlFor="upload-button"
        style={{
          border: "1px solid #222",
          borderRadius: 10,
          padding: 10,
          cursor: "pointer",
        }}
      >
        <input
          accept="image/*"
          id="upload-button"
          type="file"
          onChange={handleUploadClick}
          hidden
        />
        Choose file
      </label>
      {message}
    </main>
  );
}
