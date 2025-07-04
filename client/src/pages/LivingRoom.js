// src/pages/LivingRoom.js
import React, { useContext, useState } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import './LivingRoom.css';

import modernImg from '../assets/livingroom/modern.jpg';
import classicImg from '../assets/livingroom/classic.jpg';
import minimalistImg from '../assets/livingroom/minimalist.jpg';

const options = [
  {
    name: 'Modern Living Room',
    price: 13000,
    image: modernImg,
    subItems: [
      { name: 'Sofa', price: 3000 },
      { name: 'Coffee Table', price: 1200 },
      { name: 'Bookshelf', price: 2000 },
      { name: 'Armchair', price: 2500 },
    ],
  },
  {
    name: 'Classic Living Room',
    price: 11000,
    image: classicImg,
    subItems: [
      { name: 'Carved Sofa Set', price: 3200 },
      { name: 'Vintage Coffee Table', price: 1500 },
      { name: 'Classic Bookshelf', price: 2200 },
      { name: 'Rocking Chair', price: 2700 },
    ],
  },
  {
    name: 'Minimalist Living Room',
    price: 9000,
    image: minimalistImg,
    subItems: [
      { name: 'Compact Sofa', price: 2500 },
      { name: 'Simple Coffee Table', price: 1000 },
      { name: 'Wall Shelf', price: 1800 },
      { name: 'Minimalist Chair', price: 2000 },
    ],
  },
];

function LivingRoom() {
  const { addItem, budget, totalCost } = useContext(BudgetContext);
  const [expandedOption, setExpandedOption] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quantities, setQuantities] = useState({});

  const toggleExpand = (name) => {
    setExpandedOption(prev => (prev === name ? null : name));
  };

  const handleQuantityChange = (itemName, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) + change, 0),
    }));
  };

  const handleAdd = (option) => {
    if (budget - totalCost >= option.price) {
      addItem({ name: option.name, price: option.price, quantity: 1 });
    } else {
      alert('Not enough budget for this design.');
    }
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
    <div className="livingroom-container">
      <h2>Choose Your Living Room Design</h2>

      <div className="livingroom-options">
        {options.map((option) => (
          <div className="livingroom-card" key={option.name}>
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
        <div className="modal" onClick={() => setPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Preview" />
            <button className="close-modal" onClick={() => setPreview(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LivingRoom;
