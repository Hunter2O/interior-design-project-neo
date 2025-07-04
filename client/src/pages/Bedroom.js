// src/pages/Bedroom.js
import React, { useContext, useState } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import './bedroom.css';

import modularImg from '../assets/bedroom/modular.jpg';
import compactImg from '../assets/bedroom/compact.jpg';
import classicImg from '../assets/bedroom/classic.jpg';

const bedroomOptions = [
  {
    name: 'Modular Bedroom',
    price: 12000,
    image: modularImg,
    subItems: [
      { name: 'Bed Frame', price: 3000 },
      { name: 'Wardrobe', price: 4500 },
      { name: 'Nightstand', price: 1200 },
      { name: 'Desk', price: 1800 },
    ],
  },
  {
    name: 'Compact Bedroom',
    price: 10000,
    image: compactImg,
    subItems: [
      { name: 'Compact Bed', price: 2500 },
      { name: 'Corner Wardrobe', price: 3500 },
      { name: 'Floating Shelf', price: 800 },
    ],
  },
  {
    name: 'Classic Bedroom',
    price: 8500,
    image: classicImg,
    subItems: [
      { name: 'Vintage Bed', price: 4000 },
      { name: 'Ornate Wardrobe', price: 5000 },
      { name: 'Classic Dresser', price: 3000 },
    ], 
  },
];

const Bedroom = () => {
  const { budget, addItem, totalCost } = useContext(BudgetContext);
  const [expandedOption, setExpandedOption] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quantities, setQuantities] = useState({});

  const handleAdd = (option) => {
    if (budget - totalCost >= option.price) {
      addItem({ name: option.name, price: option.price, quantity: 1 });
    } else {
      alert('Not enough budget for this item.');
    }
  };

  const toggleExpand = (name) => {
    setExpandedOption(prev => (prev === name ? null : name));
  };

  const handleQuantityChange = (itemName, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) + change, 0),
    }));
  };

  const handleSubAdd = (roomName, item) => {
    const quantity = quantities[item.name] || 0;
    const itemTotal = item.price * quantity;

    if (quantity === 0) return;
    if (budget - totalCost >= itemTotal) {
      addItem({
        name: `${roomName}:${item.name}`,
        group: roomName,
        price: item.price,
        quantity,
      });
    } else {
      alert('Not enough budget for sub-items.');
    }
  };

  return (
    <div className="room-page">
      <h2>Design Your Bedroom</h2>

      <div className="room-options">
        {bedroomOptions.map((option) => (
          <div className="room-card" key={option.name}>
            <img
              src={option.image}
              alt={option.name}
              onClick={() => setPreview(option.image)}
            />
            <h4>{option.name}</h4>
            <p>₹{option.price}</p>
            <button onClick={() => handleAdd(option)}>Add</button>

            {option.subItems.length > 0 && (
              <>
                <button className="dropdown-toggle" onClick={() => toggleExpand(option.name)}>
                  {expandedOption === option.name ? 'Hide Extras ▲' : 'Show Extras ▼'}
                </button>

                {expandedOption === option.name && (
                  <div className="subitem-dropdown">
                    {option.subItems.map((item) => (
                      <div className="subitem-row" key={item.name}>
                        <span className="subitem-name">{item.name} – ₹{item.price}</span>
                        <div className="subitem-actions">
                          <div className="quantity-controls">
                            <button onClick={() => handleQuantityChange(item.name, -1)}>-</button>
                            <span>{quantities[item.name] || 0}</span>
                            <button onClick={() => handleQuantityChange(item.name, 1)}>+</button>
                          </div>
                          <button
                            className="add-subitem-btn"
                            onClick={() => handleSubAdd(option.name, item)}
                          >
                            Add {quantities[item.name] || 0}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <div className="modal" onClick={() => setPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Preview" />
            <button className="close-modal" onClick={() => setPreview(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bedroom;

