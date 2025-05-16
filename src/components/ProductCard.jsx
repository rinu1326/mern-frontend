// ✅ UPDATED PRODUCTCARD WITH REACT ICONS
import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiStar } from "react-icons/fi";
import "./ProductCard.css";
import API from "../utils/api";

const ProductCard = ({ product }) => {
  const handleWishlist = async (e) => {
    e.preventDefault(); // prevent link click
    try {
      await API.post("/wishlist", { productId: product._id });
      alert("Added to wishlist!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-link">
      <div className="product-card">
        <div className="wishlist-icon" onClick={handleWishlist} title="Add to wishlist">
          <FiHeart size={20} />
        </div>
        <img
          src={product.image?.startsWith("data:image") ? product.image : "/default.png"}
          alt={product.name}
        />
        <h4>{product.name}</h4>
        <p className="price">₹{product.variants[0]?.price.toFixed(2)}</p>
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} color="#c9c0c0" />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
