import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import productsData from "../productData"; // Import from the centralized data file
import "./Shop.css";

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    // Use the imported product data
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

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Determine the image to display for each product
  const getProductImage = (product) => {
    if (product.images && product.colors && product.colors.length > 0) {
        // Default to the first color's image if available
        const firstColorKey = product.colors[0].imageKey;
        return product.images[firstColorKey];
    }
    return product.image || (product.images && product.images.default);
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Shop</h1>
      </div>

      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search products..."
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

      <div className="layout-toggle">
        <button onClick={() => setLayout("grid")} className={layout === "grid" ? "active" : ""}>
          Grid View
        </button>
        <button onClick={() => setLayout("list")} className={layout === "list" ? "active" : ""}>
          List View
        </button>
      </div>

      <div className={`products-list ${layout}-view`}>
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

                <button className="add-to-cart" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                  <FaShoppingCart className="cart-icon" /> Add to Cart
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
