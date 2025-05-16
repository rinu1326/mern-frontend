import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import WishlistDrawer from "./WishlistDrawer";
import { SearchContext } from "../context/SearchContext";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import "./Navbar/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { search, setSearch } = useContext(SearchContext);
  
  const isLoggedIn = !!localStorage.getItem("token");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search any things"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-button">
              Search
            </button>
          </div>
          
          <div className="navbar-actions">
            <div className="nav-item wishlist">
              <button className="icon-btn" onClick={() => setIsWishlistOpen(true)}>
                <FiHeart className="icon" />
                <span className="heart-badge">0</span>
              </button>
            </div>
            
            <div className="nav-item signin">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="nav-link">
                  Sign out
                </button>
              ) : (
                <Link to="/login" className="nav-link">
                  Sign in
                </Link>
              )}
            </div>
            
            <div className="nav-item cart">
              <Link to="/cart" className="cart-link">
                <FiShoppingCart className="icon" />
                <span className="cart-badge">0</span>
                <span className="nav-text">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;