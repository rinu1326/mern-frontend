import React from "react";
import "./Pagination.css";

const Pagination = ({ total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          className={page === idx + 1 ? "active" : ""}
          onClick={() => onPageChange(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
