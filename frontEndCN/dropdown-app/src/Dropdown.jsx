import React, { useState } from "react";

// This component displays the items received from App.
function Dropdown({ items }) {
  // Keep track of whether the dropdown is open.
  const [isOpen, setIsOpen] = useState(false);

  // Store the option selected by the user.
  const [selectedItem, setSelectedItem] = useState("Select");

  // Save the selected item and close the dropdown.
  function selectItem(item) {
    setSelectedItem(item);
    setIsOpen(false);
  }

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Clicking also opens the dropdown on touch screens. */}
      <button
        type="button"
        className="dropdown-button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {selectedItem}
        <span className="arrow" aria-hidden="true"></span>
      </button>

      {/* Show the items when the dropdown is open. */}
      {isOpen && (
        <ul className="dropdown-options">
          {items.map((item) => (
            <li key={item}>
              <button type="button" onClick={() => selectItem(item)}>
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;