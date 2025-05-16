import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "./../styles/WishlistDrawer.css";

const WishlistDrawer = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist");
    }
  };

  useEffect(() => {
    if (isOpen) fetchWishlist();
  }, [isOpen]);

  const handleRemove = async (id) => {
    await API.delete(`/wishlist/${id}`);
    fetchWishlist();
  };

  return (
    <div className={`wishlist-drawer ${isOpen ? "open" : ""}`}>
      <div className="drawer-header">
        <h3>My Wishlist ❤️</h3>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>

      <div className="drawer-body">
        {items.length === 0 && <p>No items in wishlist.</p>}
        {items.map((item) => (
          <div key={item._id} className="wish-item">
            <img src={item.product.image || "/default.png"} alt={item.product.name} />
            <div className="info">
              <h4>{item.product.name}</h4>
              <button className="remove-btn" onClick={() => handleRemove(item.product._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistDrawer;
