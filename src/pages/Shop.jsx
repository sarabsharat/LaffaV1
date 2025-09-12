// Shop.jsx
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./Shop.css";
import product1_image from "../components/assets/Product1.jpg";
import product2_image from "../components/assets/product2.jpg";
import product3_image from "../components/assets/Front.png";

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    const dummyProducts = [
      {
        id: 1,
        name: "Vintage Headphones",
        category: "electronics",
        categories: ["Audio", "Accessories", "Gadgets"],
        price: 100,
        image: product1_image,
        onSale: true,
        oldPrice: 140,
      },
      {
        id: 2,
        name: "Notebook — Ruled",
        category: "stationery",
        categories: ["Stationery", "Books", "Office"],
        price: 20,
        image: product2_image,
      },
      {
        id: 3,
        name: "Portable Speaker",
        category: "electronics",
        categories: ["Audio", "Gadgets", "Outdoor"],
        price: 150,
        image: product3_image,
      },
      {
        id: 4,
        name: "Cozy Sweater",
        category: "clothing",
        categories: ["Apparel", "Fashion", "Winter"],
        price: 50,
        image: product1_image,
      },
      {
        id: 5,
        name: "Art Book",
        category: "books",
        categories: ["Books", "Art", "Hobbies"],
        price: 30,
        image: product2_image,
      },
    ];
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
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

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Shop</h1>
      </div>

      {/* Search + Filter */}
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

      {/* Layout toggle */}
      <div className="layout-toggle">
        <button onClick={() => setLayout("grid")} className={layout === "grid" ? "active" : ""}>
          Grid View
        </button>
        <button onClick={() => setLayout("list")} className={layout === "list" ? "active" : ""}>
          List View
        </button>
      </div>

      {/* Products */}
      <div className={`products-list ${layout}-view`}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item">
            {product.onSale && <span className="sale-badge">SALE</span>}

            <img
              src={product.image || "https://via.placeholder.com/150"}
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
                {(product.categories && product.categories.length > 0
                  ? product.categories
                  : product.category
                    ? [product.category]
                    : []
                ).map((cat) => (
                  <span key={cat} className="category-tag">
                    {cat}
                  </span>
                ))}
              </div>

              <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                <FaShoppingCart className="cart-icon" /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
