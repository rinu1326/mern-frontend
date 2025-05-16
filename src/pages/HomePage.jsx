// ✅ UPDATED HOMEPAGE with CONTEXT-BASED SEARCH
import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import SidebarFilters from "../components/SidebarFilters";
import Pagination from "../components/Pagination";
import AddProductModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import AddSubCategoryModal from "../components/AddSubCategoryModal";
import API from "../utils/api";
import { SearchContext } from "../context/SearchContext";
import "./HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);

  const { search } = useContext(SearchContext); // ✅ use search from context

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products", {
        params: {
          search,
          subCategory,
          page
        }
      });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, subCategory, page]);

  return (
    <div className="home-container">
      <SidebarFilters onSubCategorySelect={setSubCategory} />

      <div className="home-content">
        <div className="home-top-actions">
          <button className="btn yellow" onClick={() => setShowAddCategory(true)}>
            Add Category
          </button>
          <button className="btn yellow" onClick={() => setShowAddSubCategory(true)}>
            Add Sub Category
          </button>
          <button className="btn yellow" onClick={() => setShowAddProduct(true)}>
            Add Product
          </button>
        </div>

        <div className="product-grid">
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>

        <Pagination
          total={total}
          page={page}
          limit={6}
          onPageChange={setPage}
        />
      </div>

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onAddSuccess={fetchProducts}
        />
      )}

      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSuccess={fetchProducts}
        />
      )}

      {showAddSubCategory && (
        <AddSubCategoryModal
          onClose={() => setShowAddSubCategory(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default HomePage;
