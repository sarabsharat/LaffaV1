import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./ListProduct.css";

export const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const fetchInfo = async () => {
    await fetch("http://localhost:2000/allproducts")
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const delete_product = async (id) => {
    await fetch(`http://localhost:2000/deleteproduct/${id}`, {
      method: "POST", // matches backend POST route
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    fetchInfo(); // refresh list after delete
  };

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalTitle("");
    setModalContent(null);
  };

  const truncateDescription = (text) => {
    if (!text) return "N/A";
    return text.length > 50 ? `${text.substring(0, 50)}...` : text;
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <div>Products</div>
        <div>Title</div>
        <div>Old Price</div>
        <div>New Price</div>
        <div>Category</div>
        <div>Colors</div>
        <div>Sizes</div>
        <div>Description</div>
        <div>Remove</div>
      </div>

      <div className="listproducts-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={product.id || index}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={product.image}
                alt=""
                className="listproduct-product-item"
              />
              <div>{product.name}</div>
              <div>{product.old_price} JOR</div>
              <div>{product.new_price} JOR</div>
              <div>{product.category}</div>

              {/* Colors */}
              <div>
                {product.colors && product.colors.length > 0 ? (
                  <div
                    className="color-circles-container"
                    onClick={() =>
                      openModal(
                        "Product Colors",
                        <ul>
                          {product.colors.map((c, i) => (
                            <li key={i} className="modal-color-item">
                              <span
                                className="color-circle"
                                style={{ backgroundColor: c.hex }}
                              ></span>
                              {c.name}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                  >
                    {product.colors.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="color-circle"
                        style={{ backgroundColor: c.hex }}
                      ></span>
                    ))}
                    {product.colors.length > 4 && (
                      <span className="clickable-link">
                        +{product.colors.length - 4} more
                      </span>
                    )}
                  </div>
                ) : (
                  "N/A"
                )}
              </div>

              {/* Sizes */}
              <div>
                {product.sizes && product.sizes.length > 0
                  ? product.sizes.map((s, i) => (
                      <span key={i}>
                        {s.size || s}
                        {i < product.sizes.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "No sizes"}
              </div>

              {/* Description */}
              <div
                className="description-text clickable-link"
                onClick={() =>
                  openModal(
                    "Product Description",
                    <div className="modal-description-text">
                      {product.description}
                    </div>
                  )
                }
              >
                {truncateDescription(product.description)}
                {product.description && product.description.length > 50 && (
                  <span className="clickable-link"> See more</span>
                )}
              </div>

              {/* Remove icon */}
              <div
                className="remove-icon"
                onClick={() => delete_product(product.id)}
              >
                <FaTrash />
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="modal-close-btn">
              &times;
            </button>
            <h2>{modalTitle}</h2>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
