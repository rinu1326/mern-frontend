// ✅ FINAL UPDATED PRODUCT DETAIL PAGE
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import API from "./utils/api";
import API from '../utils/api'
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setSelectedRAM(res.data.variants?.[0]?.ram || "");
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleWishlist = async () => {
    try {
      await API.post("/wishlist", { productId: id });
      alert("Added to wishlist");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  if (!product) return <p>Loading...</p>;

  const selectedVariant = product.variants.find(v => v.ram === selectedRAM);

  return (
    <div className="product-detail-container">
      <div className="left">
        <img
          src={product.image?.startsWith("data:image") ? product.image : "/default.png"}
          alt={product.name}
        />

        <div className="thumbnails">
          <img src={product.image || "/default.png"} alt="thumb" />
          <img src={product.image || "/default.png"} alt="thumb" />
        </div>
      </div>

      <div className="right">
        <h2>{product.name}</h2>
        <p className="price">₹{selectedVariant?.price?.toFixed(2)}</p>
        <p className="availability">
          Availability: <span className="in-stock">In stock</span>
        </p>
        <p className="stock-count">
          Hurry up! only {selectedVariant?.quantity} product left in stock!
        </p>

        <div className="variants">
          <p>Ram:</p>
          {product.variants.map((v, i) => (
            <button
              key={i}
              className={selectedRAM === v.ram ? "active" : ""}
              onClick={() => setSelectedRAM(v.ram)}
            >
              {v.ram}
            </button>
          ))}
        </div>

        <div className="quantity">
          <p>Quantity:</p>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        <div className="buttons">
          <button className="btn edit" onClick={() => navigate(`/edit-product/${id}`)}>
            Edit product
          </button>
          <button className="btn buy">Buy it now</button>
          <button className="btn wish" onClick={handleWishlist}>❤️</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
