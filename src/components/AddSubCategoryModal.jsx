import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "./../styles/AddModal.css";

const AddSubCategoryModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/subcategory", { name, categoryId });
    alert("Sub-category added!");
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Subcategory</h3>
        <form onSubmit={handleSubmit}>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            placeholder="Subcategory name"
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

export default AddSubCategoryModal;
