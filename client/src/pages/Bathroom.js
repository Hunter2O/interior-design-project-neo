// src/pages/Bathroom.js
import React, { useContext, useState } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import './Bathroom.css';

import modernImg from '../assets/bathroom/modernbathroom.jpg';
import classicImg from '../assets/bathroom/classicbathroom.jpg';
import compactImg from '../assets/bathroom/compactbathroom.jpg';

const bathroomOptions = [
  {
    name: 'Modern Bathroom',
    price: 10000,
    image: modernImg,
    subItems: [
      { name: 'Rain Shower', price: 3000 },
      { name: 'Vanity Mirror', price: 1500 },
      { name: 'Heated Towel Rail', price: 2000 },
    ],
  },
  {
    name: 'Classic Bathroom',
    price: 7500,
    image: classicImg,
    subItems: [
      { name: 'Ceramic Sink', price: 1200 },
      { name: 'Wall Cabinet', price: 1700 },
    ],
  },
  {
    name: 'Compact Bathroom',
    price: 5000,
    image: compactImg,
    subItems: [
      { name: 'Corner Sink', price: 1000 },
      { name: 'Foldable Mirror', price: 800 },
      { name: 'Space-Saving Shelf', price: 900 },
    ],
  },
];

function Bathroom() {
  const { budget, addItem, totalCost } = useContext(BudgetContext);
  const [preview, setPreview] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [quantities, setQuantities] = useState({});

  const handleAdd = (option) => {
    if (budget - totalCost >= option.price) {
      addItem({ name: option.name, price: option.price, quantity: 1 });
    } else {
      alert('Not enough budget for this item.');
    }
  };

  const handleSubAdd = (roomName, item) => {
    const quantity = quantities[item.name] || 0;
    const total = item.price * quantity;
    if (quantity === 0) return;
    if (budget - totalCost >= total) {
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

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleQuantityChange = (itemName, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) + change, 0),
    }));
  };

  const openPreview = (image) => setPreview(image);
  const closePreview = () => setPreview(null);

  return (
    <div className="bathroom-container">
      <h2>Choose Your Bathroom Design</h2>

      <div className="bathroom-options">
        {bathroomOptions.map((option, index) => (
          <div className="bathroom-card" key={option.name}>
            <img
              src={option.image}
              alt={option.name}
              onClick={() => openPreview(option.image)}
              className="clickable"
            />
            <h4>{option.name}</h4>
            <p>₹{option.price}</p>
            <button onClick={() => handleAdd(option)}>Add</button>

            {option.subItems.length > 0 && (
              <>
                <button
                  className="dropdown-toggle"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedIndex === index ? 'Hide Extras ▲' : 'Show Extras ▼'}
                </button>

                {expandedIndex === index && (
                  <div className="subitem-dropdown">
                    {option.subItems.map((item) => (
                      <div className="subitem-row" key={item.name}>
                        <span>{item.name} – ₹{item.price}</span>
                        <div className="quantity-controls">
                          <button onClick={() => handleQuantityChange(item.name, -1)}>-</button>
                          <span>{quantities[item.name] || 0}</span>
                          <button onClick={() => handleQuantityChange(item.name, 1)}>+</button>
                        </div>
                        <button onClick={() => handleSubAdd(option.name, item)}>
                          Add {quantities[item.name] || 0}
                        </button>
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
        <div className="modal" onClick={closePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Enlarged preview" />
            <button className="close-modal" onClick={closePreview}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bathroom;
