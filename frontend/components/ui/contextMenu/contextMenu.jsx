import React from 'react';

const ContextMenu = ({ xPos, yPos, isVisible, menuOptions, onClose }) => {
  const menuStyle = {
    position: 'fixed',
    top: yPos,
    left: xPos,
    display: isVisible ? 'block' : 'none',
    backgroundColor: 'white',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    }
    if (onClose) {
      onClose(); // Close the context menu after option click
    }
  };

  return (
    <div style={menuStyle} className="p-2 context-menu">
      <ul className="list-none">
        {menuOptions.map((option, index) => (
          <li 
            key={index} 
            className="py-2 px-4 flex items-center text-primary hover:bg-gray-100 cursor-pointer"
            onClick={() => handleOptionClick(option)}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
