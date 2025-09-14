import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import products from '../productData';
import './Product.css';

const ProductPage = ({ addToCart }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        const selectedProduct = products.find(p => p.id === parseInt(productId));
        if (selectedProduct) {
            setProduct(selectedProduct);
            if (selectedProduct.colors && selectedProduct.colors.length > 0) {
                setSelectedColor(selectedProduct.colors[0]);
            }
            if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
                setSelectedSize(selectedProduct.sizes[0]);
            }
        }
    }, [productId]);

    if (!product) {
        return <div>Product not found!</div>;
    }

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    // Correctly handle the Add to Cart action
    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if the button is inside a link
        e.stopPropagation();
        if (product && typeof addToCart === 'function') {
            addToCart(product);
        } else {
            console.error("addToCart is not a function or product is not available.");
        }
    };

    const currentImage = selectedColor && product.images[selectedColor.imageKey] 
        ? product.images[selectedColor.imageKey]
        : product.image || (product.images && product.images.default);

    return (
        <div className="product-page-container">
            <div className="product-gallery">
                <div className="main-product-image">
                    <img src={currentImage} alt={product.name} />
                </div>
                 <div className="thumbnail-images">
                    {product.colors && product.colors.map(color => (
                        <img 
                            key={color.name}
                            src={product.images[color.imageKey]}
                            alt={`${product.name} in ${color.name}`}
                            className={selectedColor?.name === color.name ? 'active' : ''}
                            onClick={() => handleColorClick(color)}
                        />
                    ))}
                </div>
            </div>

            <div className="product-details-panel">
                <h1>{product.name}</h1>
                {product.subtitle && <div className="subtitle">{product.subtitle}</div>}
                
                <div className="price-section">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                    {product.onSale && product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
                </div>
                
                <p className="description">
                    {product.description}
                </p>
                
                {product.colors && product.colors.length > 0 && (
                    <div className="color-options">
                        <h3>Color: <span>{selectedColor?.name}</span></h3>
                        <div className="color-circles">
                            {product.colors.map(color => (
                                <div 
                                    key={color.name} 
                                    className={`color-circle ${selectedColor?.name === color.name ? 'active' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => handleColorClick(color)}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                    <div className="size-options">
                        <h3>Select Size</h3>
                        <div className="sizes">
                            {product.sizes.map(size => (
                                <div 
                                    key={size}
                                    className={`size ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => handleSizeClick(size)}
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="actions">
                    <button className="add-to-cart" onClick={handleAddToCart}>
                        <FaShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
