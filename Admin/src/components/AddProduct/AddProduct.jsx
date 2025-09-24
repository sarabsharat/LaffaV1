import React, { useState } from 'react';
import "./AddProduct.css";
import { MdCloudUpload } from "react-icons/md";

const AddProduct = () => {
    const [productDetails, setProductDetails] = useState({
        name: "",
        old_price: "",
        new_price: "",
        category: "",
        image: null,
        description: "",
        sizes: [],
        colors: [] // Now manages both name and hex
    });

    const maxLength = 500;

    const imageHandler = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProductDetails(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        let newSizes = [...productDetails.sizes];

        if (checked) {
            newSizes.push(value);
        } else {
            newSizes = newSizes.filter(size => size !== value);
        }

        setProductDetails({ ...productDetails, sizes: newSizes });
    };

    const addColor = () => {
        // Add a new color object with an empty name and a default hex
        setProductDetails(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000' }]
        }));
    };

    const updateColorField = (index, field, value) => {
        const updatedColors = productDetails.colors.map((color, i) =>
            i === index ? { ...color, [field]: value } : color
        );
        setProductDetails(prev => ({ ...prev, colors: updatedColors }));
    };

    const removeColor = (index) => {
        const updatedColors = productDetails.colors.filter((_, i) => i !== index);
        setProductDetails(prev => ({ ...prev, colors: updatedColors }));
    };
    
    // Handlers to update both name and hex
    const handleColorNameChange = (index, e) => {
        updateColorField(index, 'name', e.target.value);
    };

    const handleColorHexChange = (index, e) => {
        updateColorField(index, 'hex', e.target.value);
    };

    const saveProduct = async() => {
        let responseData;
        let formData = new FormData();
        formData.append("product", productDetails.image);

        // Upload the image first
        await fetch("http://localhost:2000/upload", {
            method: "POST",
            body: formData
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        if (responseData.success) {
            // Prepare the product data payload for the backend
            const finalProduct = {
                ...productDetails,
                image: responseData.image_url,
                // The colors and sizes are already in the correct format from the state
            };

            // Send the product data to the addproduct endpoint
            await fetch("http://localhost:2000/addproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(finalProduct)
            }).then((resp) => resp.json()).then((data) => {
                data.success ? alert("Product Added Successfully") : alert("Failed to add product");
            });
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Product Title' />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type Price' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type Price' />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Description</p>
                <textarea
                    name="description"
                    value={productDetails.description}
                    onChange={changeHandler}
                    maxLength={maxLength}
                    placeholder="Write a clear and engaging product description..."
                    className="addproduct-description"
                />
                <span className="char-counter">{productDetails.description.length} / {maxLength}</span>
            </div>

            <div className="addproduct-colorfield">
                <p>Available Colors</p>
                <div className="color-options">
                    {productDetails.colors.map((color, index) => (
                        <div key={index} className="color-entry">
                            <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => handleColorHexChange(index, e)}
                                className="color-picker"
                            />
                            <input
                                type="text"
                                placeholder="Enter color name (e.g., Midnight Blue)"
                                value={color.name}
                                onChange={(e) => handleColorNameChange(index, e)}
                                className="color-name-input"
                            />
                            <span
                                className="color-preview"
                                style={{ backgroundColor: color.hex }}
                            ></span>
                            <button
                                type="button"
                                onClick={() => removeColor(index)}
                                className="color-remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {productDetails.colors.length === 0 && (
                        <p className="color-empty-state">No colors added yet. Click below to add one.</p>
                    )}
                    <button
                        type="button"
                        onClick={addColor}
                        className="color-add-btn"
                    >
                        + Add Color
                    </button>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select name="category" value={productDetails.category} onChange={changeHandler} className='add-product-selector'>
                    <option value="summer">عبايات الصيف</option>
                    <option value="winter">عبايات الشتاء</option>
                    <option value="offers">العروض</option>
                </select>
            </div>
            <div className="addproduct-sizefield">
                <p>Available Sizes</p>
                <div className="size-options">
                    {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
                        <label key={size} className="size-checkbox">
                            <input
                                type="checkbox"
                                value={size}
                                checked={productDetails.sizes.includes(size)}
                                onChange={handleSizeChange}
                            />
                            <span>{size}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input" className="upload-label">
                    {productDetails.image ? (
                        <img
                            src={URL.createObjectURL(productDetails.image)}
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
            <button className='addproduct-btn' onClick={saveProduct}>Add Product</button>
        </div>
    );
};

export default AddProduct;