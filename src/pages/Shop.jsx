import React, { useState, useEffect } from 'react';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState('grid'); // Add state for layout mode

  useEffect(() => {
    // In a real application, i would fetch product data from an API
    // For this example, ill use dummy data
    const dummyProducts = [
      { id: 1, name: 'Product 1', category: 'electronics', price: 100, image: 'path/to/product1.jpg' },
      { id: 2, name: 'Product 2', category: 'books', price: 20, image: 'path/to/product2.jpg' },
      { id: 3, name: 'Product 3', category: 'electronics', price: 150, image: 'path/to/product3.jpg' },
      { id: 4, name: 'Product 4', category: 'clothing', price: 50, image: 'path/to/product4.jpg' },
      { id: 5, name: 'Product 5', category: 'books', price: 30, image: 'path/to/product5.jpg' },
    ];
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter(product =>
      (filter === 'all' || product.category === filter) &&
      (product.name.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, filter, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <div className="shop-container">
      <h1>Shop</h1>
      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <select value={filter} onChange={handleFilterChange} className="filter-dropdown">
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      {/* Layout toggle buttons - visible only on mobile via CSS */}
      <div className="layout-toggle">
        <button onClick={() => handleLayoutChange('grid')} className={layout === 'grid' ? 'active' : ''}>Grid View</button>
        <button onClick={() => handleLayoutChange('list')} className={layout === 'list' ? 'active' : ''}>List View</button>
      </div>

      <div className={`products-list ${layout}-view`}> {/* Apply class based on layout state */}
        {filteredProducts.map(product => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              {/* Add more product details here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
