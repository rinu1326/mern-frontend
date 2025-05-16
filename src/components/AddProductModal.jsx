import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "./../styles/AddProductModal.css";

const AddProductModal = ({ onClose, onAddSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([{ ram: "", price: "", quantity: "" }]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const cats = await API.get("/categories");
        const allSubs = await Promise.all(
          cats.data.map((cat) =>
            API.get(`/subcategories/${cat._id}`).then((res) => res.data)
          )
        );
        setSubCategories(allSubs.flat());
      } catch (err) {
        console.error("Failed to load subcategories:", err);
      }
    };
    fetchSubs();
  }, []);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariantField = () => {
    setVariants([...variants, { ram: "", price: "", quantity: "" }]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!imageFile) {
        alert("Please upload an image.");
        setIsLoading(false);
        return;
      }
      
      if (!title.trim() || !description.trim() || !subCategory) {
        alert("Please fill all required fields.");
        setIsLoading(false);
        return;
      }

      const formattedVariants = variants.map((v) => ({
        ram: v.ram.trim(),
        price: Number(v.price),
        quantity: Number(v.quantity),
      }));

      if (formattedVariants.some(v => !v.ram || isNaN(v.price) || isNaN(v.quantity))) {
        alert("Please fill all variant fields correctly.");
        setIsLoading(false);
        return;
      }

      // Read the file as base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          
          const productData = {
            name: title.trim(),
            description: description.trim(),
            subCategory,
            variants: formattedVariants,
            image: base64Data
          };
          
          await API.post("/products", productData);
          alert("Product added successfully!");
          onAddSuccess();
          onClose();
        } catch (err) {
          console.error("Add product error:", err);
          alert(err.response?.data?.msg || "Failed to add product");
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setIsLoading(false);
        alert("Error reading the image file");
      };
    } catch (err) {
      console.error("Add product error:", err);
      alert(err.response?.data?.msg || "Failed to add product");
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Name"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <label>Variants:</label>
          {variants.map((v, i) => (
            <div key={i} className="variant-row">
              <input
                type="text"
                value={v.ram}
                onChange={(e) => handleVariantChange(i, "ram", e.target.value)}
                placeholder="RAM"
                required
              />
              <input
                type="number"
                value={v.price}
                onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                placeholder="Price"
                required
              />
              <input
                type="number"
                value={v.quantity}
                onChange={(e) => handleVariantChange(i, "quantity", e.target.value)}
                placeholder="Quantity"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addVariantField} className="add-variant-btn">
            Add Variant
          </button>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>

          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="preview-img"
              style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
            />
          )}

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn add" 
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
            <button 
              type="button" 
              className="btn discard" 
              onClick={onClose} 
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;