

import React, { useState, useEffect, useMemo } from 'react';
import { User, BookOpen, Mail, Edit2, Trash2, Plus, Search, CheckCircle, AlertCircle, Upload, Camera, X, Star, TrendingUp, Users, Award, Filter, Grid, List } from 'lucide-react';
// Photo Upload Component
const PhotoUpload = ({ currentImage, onImageChange, className = "" }) => {
  const [preview, setPreview] = useState(currentImage);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreview(imageUrl);
        onImageChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative w-32 h-32 rounded-full border-4 border-dashed transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${preview ? 'border-solid border-blue-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Camera className="w-8 h-8 mb-2" />
            <span className="text-xs text-center">Drop photo here</span>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
        />
        
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
          <Upload className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
export default PhotoUpload;