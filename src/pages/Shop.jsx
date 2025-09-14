import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import productsData from "../productData";
import "./Shop.css";

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [addedProducts, setAddedProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const matchesFilter = filter === "all" || p.category === filter;
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, filter, products]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (addedProducts.includes(product.id)) {
        return;
    }

    if (product && typeof addToCart === 'function') {
      addToCart(product);
    } else {
      console.error("addToCart is not a function or product is not available.");
      return;
    }

    setAddedProducts(prev => [...prev, product.id]);

    setTimeout(() => {
        setAddedProducts(prev => prev.filter(id => id !== product.id));
    }, 1500);
  };

  const getProductImage = (product) => {
    if (product.images && product.colors && product.colors.length > 0) {
        const firstColorKey = product.colors[0].imageKey;
        return product.images[firstColorKey];
    }
    return product.image || (product.images && product.images.default);
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Shop Our Collection</h1>
      </div>

      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search for your favorite abaya..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="stationery">Stationery</option>
        </select>
      </div>

      <div className="products-list">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-item-link">
            <div className="product-item">
              {product.onSale && <span className="sale-badge">SALE</span>}

              <img
                src={getProductImage(product)}
                alt={product.name}
                className="product-image"
              />

              <div className="product-details">
                <h3>{product.name}</h3>

                <div className="price-section">
                  <span className="current-price">${product.price.toFixed(2)}</span>
                  {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
                </div>

                <div className="categories">
                  {(product.categories || []).map((cat) => (
                    <span key={cat} className="category-tag">{cat}</span>
                  ))}
                </div>

                <button 
                  className={`add-to-cart ${addedProducts.includes(product.id) ? 'added' : ''}`}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  {addedProducts.includes(product.id) ? (
                    'ADDED!'
                  ) : (
                    <>
                      <FaShoppingCart className="cart-icon" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;
