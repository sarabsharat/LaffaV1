// Shop.jsx
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./Shop.css";

const Shop = ({ updateCartCount }) => { // Add this prop
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [layout, setLayout] = useState("grid");
  const [cart, setCart] = useState([]);

 useEffect(() => {
    if (updateCartCount) {
      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      updateCartCount(totalQuantity);
    }
  }, [cart, updateCartCount]);

  useEffect(() => {
    const dummyProducts = [
      {
        id: 1,
        name: "Vintage Headphones",
        category: "electronics",
        categories: ["Audio", "Accessories"],
        price: 100,
        image: "path/to/product1.jpg",
        onSale: true,
        oldPrice: 140,
      },
      {
        id: 2,
        name: "Notebook — Ruled",
        category: "books",
        categories: ["Stationery", "Books"],
        price: 20,
        image: "path/to/product2.jpg",
      },
      {
        id: 3,
        name: "Portable Speaker",
        category: "electronics",
        categories: ["Audio"],
        price: 150,
        image: "path/to/product3.jpg",
      },
      {
        id: 4,
        name: "Cozy Sweater",
        category: "clothing",
        categories: ["Apparel"],
        price: 50,
        image: "path/to/product4.jpg",
      },
      {
        id: 5,
        name: "Art Book",
        category: "books",
        categories: ["Books", "Art"],
        price: 30,
        image: "path/to/product5.jpg",
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
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
       let newCart;
      if (existing) {
        newCart = prevCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
      else {
      newCart = [...prevCart, { ...product, quantity: 1 }];
    }
     localStorage.setItem('cart', JSON.stringify(newCart));
    return newCart;
    });
  };
  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Shop</h1>

        {/* optional small cart indicator (only visual) */}
        <div className="cart-icon">
          <FaShoppingCart size={20} />
          {/* show total quantity if there are items */}
          {cart.length > 0 && (
            <span className="cart-count">
              {cart.reduce((sum, it) => sum + (it.quantity || 0), 0)}
            </span>
          )}
        </div>
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
          {/* you can generate these dynamically */}
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
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

              {/* Categories: prefer product.categories (array), fallback to product.category (string) */}
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
