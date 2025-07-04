import React, { createContext, useState } from 'react';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(100000);
  const [selectedItems, setSelectedItems] = useState([]);

  const addItem = (item) => {
    const id = item.group ? `${item.group}:${item.name}` : item.name;

    setSelectedItems(prev => {
      const existingItemIndex = prev.findIndex(i =>
        (i.group ? `${i.group}:${i.name}` : i.name) === id
      );

      if (existingItemIndex !== -1) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += item.quantity || 1;
        return updated;
      } else {
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeItem = (itemName) => {
    setSelectedItems(prev => {
      return prev
        .map(i =>
          (i.group ? `${i.group}:${i.name}` : i.name) === itemName
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0);
    });
  };

  const clearItems = () => setSelectedItems([]);

  const updateBudget = (newBudget) => {
    const parsed = parseInt(newBudget);
    if (!isNaN(parsed) && parsed >= 0) setBudget(parsed);
  };

  const totalCost = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <BudgetContext.Provider
      value={{
        budget,
        selectedItems,
        totalCost,
        addItem,
        removeItem,
        clearItems,
        setBudget: updateBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
