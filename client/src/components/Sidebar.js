// src/components/Sidebar.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Correct import
import { BudgetContext } from '../context/BudgetContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate(); // ✅ Must be inside this function

  const {
    budget,
    selectedItems = [],
    totalCost,
    setBudget,
    clearItems,
  } = useContext(BudgetContext);

  const [expanded, setExpanded] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [openGroups, setOpenGroups] = useState({});

  const remainingBudget = budget - totalCost;
  const isOverBudget = remainingBudget < 0;

  const handleCheckout = () => {
    if (!isOverBudget) {
      navigate('/checkout'); // ✅ Navigate on checkout
    }
  };

  const handleBudgetChange = () => {
    const value = parseInt(newBudget, 10);
    if (!isNaN(value) && value >= totalCost) {
      setBudget(value);
      setNewBudget('');
    } else {
      alert('Budget must be a number and not less than the total cost.');
    }
  };

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const groupedItems = {};
  selectedItems.forEach((item) => {
    const [group, ...rest] = item.name.split(':');
    const cleanName = rest.length > 0 ? rest.join(':').trim() : null;
    if (!groupedItems[group]) groupedItems[group] = [];
    if (cleanName) {
      groupedItems[group].push({ ...item, name: cleanName });
    } else {
      groupedItems[group].push(item);
    }
  });

  return (
    <div
      className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="toggle-arrow">⇨</div>

      {expanded && (
        <>
          <div className="sidebar-content">
            <h3>Selected Items</h3>

            {Object.entries(groupedItems).map(([group, items], idx) => (
              <div className="group-block" key={idx}>
                <div className="group-header" onClick={() => toggleGroup(group)}>
                  <span>{group}</span>
                  <span>{openGroups[group] ? '▼' : '▶'}</span>
                </div>
                {openGroups[group] && (
                  <ul className="group-list">
                    {items.map((item, index) => (
                      <li key={index}>
                        {item.name} ×{item.quantity} — ₹{item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <p>
              <strong>Total Cost:</strong> ₹{totalCost}
            </p>

            {isOverBudget && (
              <div className="budget-warning">
                ⚠️ <strong>Over Budget!</strong>
                <br />
                Please increase your budget.
              </div>
            )}

            <button
              className="checkout-btn"
              disabled={isOverBudget}
              onClick={handleCheckout}
              title={isOverBudget ? 'You are over budget. Please adjust items or budget.' : ''}
            >
              Checkout
            </button>

            <button className="contact-btn">Contact</button>
            <button className="clear-btn" onClick={clearItems}>
              Clear All
            </button>
          </div>

          <div className="sidebar-footer">
            <p>
              <strong>Remaining Budget:</strong> ₹{remainingBudget}
            </p>
            <div className="budget-input-group">
              <input
                type="number"
                placeholder="Update Budget"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBudgetChange();
                  }
                }}
              />
              <button onClick={handleBudgetChange}>⇨</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
