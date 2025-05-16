import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./../styles/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchData = async () => {
      const prodRes = await API.get(`/products?id=${id}`);
      const item = prodRes.data.products[0];
      setProduct(item);
      setForm({ name: item.name, description: item.description });
      setVariants(item.variants);
      setSubCategory(item.subCategory);

      const cats = await API.get("/categories");
      const all = await Promise.all(
        cats.data.map((cat) =>
          API.get(`/subcategories/${cat._id}`).then((subs) => subs.data)
        )
      );
      setSubCategories(all.flat());
    };
    fetchData();
  }, [id]);

  const handleVariantChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      subCategory,
      variants,
    };
    await API.put(`/products/${id}`, payload);
    alert("Product updated!");
    navigate("/dashboard");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          required
        />

        <label>Variants:</label>
        {variants.map((v, i) => (
          <div key={i} className="variant-row">
            <input
              value={v.ram}
              onChange={(e) => handleVariantChange(i, "ram", e.target.value)}
              placeholder="RAM"
            />
            <input
              value={v.price}
              onChange={(e) => handleVariantChange(i, "price", e.target.value)}
              placeholder="Price"
              type="number"
            />
            <input
              value={v.quantity}
              onChange={(e) => handleVariantChange(i, "quantity", e.target.value)}
              placeholder="Quantity"
              type="number"
            />
          </div>
        ))}

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          required
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <button className="btn update-btn" type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
