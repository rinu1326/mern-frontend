import React, { useState } from "react";
import API from "../utils/api";
import "./../styles/AddModal.css";

const AddCategoryModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/category", { name });
    alert("Category added!");
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Category</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="form-buttons">
            <button className="btn add" type="submit">Add</button>
            <button className="btn discard" onClick={onClose} type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
