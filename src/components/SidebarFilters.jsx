// import React, { useEffect, useState } from "react";
// import API from "../utils/api";
// import "./Sidebar.css";

// const SidebarFilters = ({ onSubCategorySelect }) => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     API.get("/categories").then((res) => setCategories(res.data));
//   }, []);

//   return (
//     <div className="sidebar">
//       <h4>Categories</h4>
//       {categories.map((cat) => (
//         <div key={cat._id}>
//           <p><strong>{cat.name}</strong></p>
//           <SubList categoryId={cat._id} onSelect={onSubCategorySelect} />
//         </div>
//       ))}
//     </div>
//   );
// };

// const SubList = ({ categoryId, onSelect }) => {
//   const [subs, setSubs] = useState([]);

//   useEffect(() => {
//     API.get(`/subcategories/${categoryId}`).then((res) => setSubs(res.data));
//   }, [categoryId]);

//   return (
//     <ul>
//       {subs.map((sub) => (
//         <li key={sub._id}>
//           <button onClick={() => onSelect(sub._id)}>{sub.name}</button>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarFilters;
// ✅ UPDATED SIDEBARFILTERS TO WORK WITH SUBCATEGORY FILTERING
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const SidebarFilters = ({ onSubCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleSubcategoryClick = (subId) => {
    if (selectedSub === subId) {
      setSelectedSub("");
      onSubCategorySelect("");
    } else {
      setSelectedSub(subId);
      onSubCategorySelect(subId);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <div className="nav-item">
          <span onClick={()=> navigate('/dashboard')}>Home</span>
          <span className="chevron-right"> ›</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Categories</h3>

        <div
          className={`category-item ${!selectedSub ? "selected" : ""}`}
          onClick={() => handleSubcategoryClick("")}
        >
          <span>All categories</span>
        </div>

        {categories.map((category) => (
          <div key={category._id} className="category-container">
            <div
              className="category-item"
              onClick={() => toggleCategory(category._id)}
            >
              <span>{category.name}</span>
              <span className={`chevron ${expandedCategory === category._id ? "down" : "right"}`}>
                {expandedCategory === category._id ? "⌵" : "›"}
              </span>
            </div>

            {expandedCategory === category._id && (
              <div className="subcategory-list">
                <SubList
                  categoryId={category._id}
                  onClick={handleSubcategoryClick}
                  selectedSub={selectedSub}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SubList = ({ categoryId, onClick, selectedSub }) => {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    API.get(`/subcategories/${categoryId}`).then((res) => setSubs(res.data));
  }, [categoryId]);

  return (
    <>
      {subs.map((sub) => (
        <div
          key={sub._id}
          className={`subcategory-item ${selectedSub === sub._id ? "selected" : ""}`}
          onClick={() => onClick(sub._id)}
        >
          <span>{sub.name}</span>
        </div>
      ))}
    </>
  );
};

export default SidebarFilters;
