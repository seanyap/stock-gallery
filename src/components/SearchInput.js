import React from "react";

const SearchInput = (props) => {
  const onSubmit = (e) => {
    // Prevents GET request/page refresh on submit
    e.preventDefault();
    props.onFormSubmit();
  };

  return (
    <form onSubmit={onSubmit} className="search-form">
      <div className="control">
        <input
          autoFocus
          value={props.inputValue}
          onChange={(e) => props.onSearch(e.target.value)}
          className="input is-primary"
          type="text"
          placeholder="Search..."
        />
      </div>
    </form>
  );
};

export default SearchInput;
