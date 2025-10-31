import React, { useContext, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { UserContext } from "../Context/userContext";

const ModelCard = () => {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null); // store the File object
 const { user} = useContext(UserContext)
 const [ detect , setDetect] = useState('') 
 const imageInput = () => {
    inputRef.current.click();
  };
  

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const formData = new URLSearchParams()

const handleDetect = async () => {
  if (!image) {
    alert("Please upload an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", image);
  formData.append("userId", user.id); // replace with actual userId

  try {
    const response = await fetch("http://127.0.0.1:8080/chat", {
      method: "POST",
      body: formData, // DO NOT set Content-Type manually
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      return;
    }

    const data = await response.json();
    setDetect(data)
    console.log("✅ Detection result:", data);
  } catch (err) {
    console.error("❌ Request failed:", err);
  }
};


  return (
    <div className="shadow-2xl w-[400px] h-[570px] justify-center flex flex-col gap-4 rounded-4xl flex-wrap">
      <div className="mx-auto top-0 w-[300px] h-[250px] shadow-inner object-cover item-center flex justify-center overflow-hidden rounded-4xl">
        <img
          className=" w-full hover:scale-110 transition-all duration-300"
          src={image ? URL.createObjectURL(image) : "/Glioma-header.png"}
          alt="MRI preview"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={imageInput}
        className="border w-[300px] mx-auto h-[70px] border-dashed items-center justify-center hover:bg-slate-100 rounded-2xl flex cursor-pointer"
      >
        {image ? image.name : <FiUpload size={25} />}
      </div>

      <p className="text-xs text-center">Upload MRI image</p>

      <button onClick={handleDetect} className="w-[300px] bg-black text-white font-semibold mx-auto p-3 hover:bg-slate-900 rounded-3xl">
        Detect
      </button>
      {
        detect ?
        <div className="flex flex-col  mx-auto">
<p className="text-center">{detect.result }</p>
      <p className="text-center">Confidence Score : {Number(detect.confidence_score*100).toFixed(2)}</p>
        </div>
        :
        <p className="text-sm text-slate-600 text-center">
          Result will appere here 
        </p>
      }
      
    </div>
  );
};

export default ModelCard;
