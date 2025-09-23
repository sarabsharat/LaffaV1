import React, { useState } from 'react';
import "./AddProduct.css";
import { MdCloudUpload } from "react-icons/md";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState(""); // description state
  const maxLength = 500;

  const [productDetails, setProductDetails] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "",
    image: null,
    description: ""
  });

  // New state for dynamic colors
  const [availableColors, setAvailableColors] = useState([]); // Array of { name: string, color: string } objects

  const imageHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Functions for dynamic colors
  const addColor = () => {
    // Add a new empty color entry
    setAvailableColors([...availableColors, { name: '', color: '#000000' }]);
  };

  const updateColor = (index, field, value) => {
    const updatedColors = availableColors.map((color, i) =>
      i === index ? { ...color, [field]: value } : color
    );
    setAvailableColors(updatedColors);
  };

  const removeColor = (index) => {
    const updatedColors = availableColors.filter((_, i) => i !== index);
    setAvailableColors(updatedColors);
  };

  const handleColorChange = (index, e) => {
    updateColor(index, 'color', e.target.value);
  };

  const handleNameChange = (index, e) => {
    updateColor(index, 'name', e.target.value);
  };

  return (
    <div className='add-product'>
      {/* Title */}
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input type="text" name="name" placeholder='Product Title' />
      </div>

      {/* Prices */}
      <div className="div addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="text" name="old_price" placeholder='Type Price' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="text" name="new_price" placeholder='Type Price' />
        </div>
      </div>

      {/* ✅ Description */}
      <div className="addproduct-itemfield">
        <p>Description</p>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          maxLength={maxLength}
          placeholder="Write a clear and engaging product description..."
          className="addproduct-description"
        />
        <span className="char-counter">{desc.length} / {maxLength}</span>
      </div>

      {/* Dynamic Colors - Replaced the simple input */}
   {/* Dynamic Colors Section - Updated */}
<div className="addproduct-colorfield">
  <p>Available Colors</p>
  <div className="color-options">
    {availableColors.map((color, index) => (
      <div key={index} className="color-entry">
        {/* Color Picker */}
        <input
          type="color"
          value={color.color}
          onChange={(e) => handleColorChange(index, e)}
          className="color-picker" // Optional extra class if needed
        />
        
        {/* Color Name Input */}
        <input
          type="text"
          placeholder="Enter color name (e.g., Midnight Blue)"
          value={color.name}
          onChange={(e) => handleNameChange(index, e)}
          className="color-name-input" // Optional; the rules target input[type="text"]
        />
        
        {/* Visual Preview - Now with class */}
        <span
          className="color-preview"
          style={{ backgroundColor: color.color }} // Keep inline for dynamic color
        ></span>
        
        {/* Remove Button - Now with class */}
        <button
          type="button"
          onClick={() => removeColor(index)}
          className="color-remove-btn"
        >
          Remove
        </button>
      </div>
    ))}
    
    {/* Empty State */}
    {availableColors.length === 0 && (
      <p className="color-empty-state">No colors added yet. Click below to add one.</p>
    )}
    
    {/* Add Button - Now with class */}
    <button
      type="button"
      onClick={addColor}
      className="color-add-btn"
    >
      + Add Color
    </button>
  </div>
</div>


      {/* Category */}
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select name="category" lang="ar" className='add-product-selector'>
          <option value="summer">عبايات الصيف</option>
          <option value="winter">عبايات الشتاء</option>
          <option value="offers">العروض</option>
        </select>
      </div>

      {/* Available Sizes - Using checkboxes for multiple selection */}
      <div className="addproduct-sizefield">
  <p>Available Sizes</p>
  <div className="size-options">
    <label className="size-checkbox">
      <input type="checkbox" name="availableSizes" value="XS" />
      <span>XS</span>
    </label>
    <label className="size-checkbox">
      <input type="checkbox" name="availableSizes" value="S" />
      <span>S</span>
    </label>
    <label className="size-checkbox">
      <input type="checkbox" name="availableSizes" value="M" />
      <span>M</span>
    </label>
    <label className="size-checkbox">
      <input type="checkbox" name="availableSizes" value="L" />
      <span>L</span>
    </label>
    <label className="size-checkbox">
      <input type="checkbox" name="availableSizes" value="XL" />
      <span>XL</span>
    </label>
    <label className="size-checkbox">
      <input type="checkbox" name="availableSizes" value="XXL" />
      <span>XXL</span>
    </label>
  </div>
</div>

      {/* Image Upload */}
      <div className="addproduct-itemfield">
        <label htmlFor="file-input" className="upload-label">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              className="thumbnail-img"
              alt="Upload Preview"
            />
          ) : (
            <MdCloudUpload className="upload-icon" />
          )}
        </label>
        <input
          onChange={imageHandler}
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          hidden
        />
      </div>

      {/* Button */}
      <button className='addproduct-btn'>Add Product</button>
    </div>
  );
};

export default AddProduct;
