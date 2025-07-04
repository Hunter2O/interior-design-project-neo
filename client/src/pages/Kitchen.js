import React, { useContext, useState } from 'react';
import axios from 'axios';
import './Kitchen.css';
import { BudgetContext } from '../context/BudgetContext';

import modularImg from '../assets/kitchen/modular.png';
import traditionalImg from '../assets/kitchen/traditional.jpg';
import compactImg from '../assets/kitchen/compact.jpg';

const options = [
  {
    name: 'Modular Kitchen',
    price: 30000,
    image: modularImg,
    subItems: [
      { name: 'Overhead Cabinets', price: 5000 },
      { name: 'Chimney', price: 7000 },
      { name: 'Drawer Storage', price: 4000 },
    ],
  },
  {
    name: 'Traditional Kitchen',
    price: 20000,
    image: traditionalImg,
    subItems: [
      { name: 'Wooden Cupboards', price: 3500 },
      { name: 'Stone Countertop', price: 6000 },
    ],
  },
  {
    name: 'Compact Kitchen',
    price: 15000,
    image: compactImg,
    subItems: [
      { name: 'Simple Cupboards', price: 2500 },
      { name: 'Basic Countertop', price: 2000 },
    ],
  },
];

function Kitchen() {
  const { addItem, budget, totalCost } = useContext(BudgetContext);
  const [preview, setPreview] = useState(null);
  const [expandedOption, setExpandedOption] = useState(null);
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

  const handleAdd = async (design) => {
    if (budget - totalCost >= design.price) {
      await axios.post('http://localhost:5000/api/select', {
        room: 'kitchen',
        design: design.name,
        cost: design.price
      });
      addItem({ name: design.name, price: design.price, quantity: 1 });
    } else {
      alert('Not enough budget for this item.');
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
    <div className="kitchen-container">
      <h2>Choose Your Kitchen Design</h2>

      <div className="kitchen-options">
        {options.map((opt) => (
          <div className="kitchen-card" key={opt.name}>
            <img
              src={opt.image}
              alt={opt.name}
              className="clickable"
              onClick={() => setPreview(opt.image)}
            />
            <h4>{opt.name}</h4>
            <p>₹{opt.price}</p>
            <button onClick={() => handleAdd(opt)}>Add</button>

            {opt.subItems.length > 0 && (
              <>
                <button className="dropdown-toggle" onClick={() => toggleExpand(opt.name)}>
                  {expandedOption === opt.name ? 'Hide Extras ▲' : 'Show Extras ▼'}
                </button>

                {expandedOption === opt.name && (
                  <div className="subitem-dropdown">
                    {opt.subItems.map((item) => (
                      <div className="subitem-row" key={item.name}>
                        <span>{item.name} – ₹{item.price}</span>
                        <div className="quantity-controls">
                          <button onClick={() => handleQuantityChange(item.name, -1)}>-</button>
                          <span>{quantities[item.name] || 0}</span>
                          <button onClick={() => handleQuantityChange(item.name, 1)}>+</button>
                        </div>
                        <button onClick={() => handleSubAdd(opt.name, item)}>
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

export default Kitchen;
