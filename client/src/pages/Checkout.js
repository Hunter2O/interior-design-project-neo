import React, { useContext, useState } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import './Checkout.css';
import axios from 'axios';
import jsPDF from 'jspdf';

const Checkout = () => {
  const { selectedItems, totalCost, clearItems } = useContext(BudgetContext);
  const [showPayment, setShowPayment] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || !phone) {
      alert('Please enter both email and phone.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/submit', {
        email,
        phone,
        items: selectedItems,
        totalCost
      });
      setSubmitted(true);
      clearItems();
    } catch (error) {
      console.error('Error submitting contact:', error);
      alert('❌ Something went wrong.');
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.text('INVOICE', 150, 20, { align: 'right' });

    // Invoice Meta Info
    doc.setFontSize(10);
    const date = new Date().toLocaleDateString();
    doc.text(`INVOICE NO: 00001`, 150, 30, { align: 'right' });
    doc.text(`DATE: ${date}`, 150, 35, { align: 'right' });
    doc.text(`DUE DATE: ${date}`, 150, 40, { align: 'right' });

    // Table Header
    let y = 60;
    doc.setFontSize(11);
    doc.text('DESCRIPTION', 20, y);
    doc.text('UNIT PRICE', 100, y);
    doc.text('QTY', 140, y);
    doc.text('TOTAL', 170, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    // Items
    selectedItems.forEach((item, i) => {
      const totalItemCost = item.price * item.quantity;
      doc.text(item.name, 20, y);
      doc.text(`₹${item.price}`, 100, y);
      doc.text(`${item.quantity}`, 140, y);
      doc.text(`₹${totalItemCost}`, 170, y);
      y += 8;
    });

    // Totals
    doc.line(20, y, 190, y);
    y += 10;
    const subtotal = totalCost * 0.9;
    const tax = totalCost * 0.1;

    doc.setFontSize(11);
    doc.text(`SUBTOTAL`, 140, y);
    doc.text(`₹${subtotal.toFixed(2)}`, 170, y);
    y += 7;
    doc.text(`Tax (10%)`, 140, y);
    doc.text(`₹${tax.toFixed(2)}`, 170, y);
    y += 7;
    doc.setFontSize(12);
    doc.text(`TOTAL`, 140, y);
    doc.text(`₹${totalCost.toFixed(2)}`, 170, y);

    // Footer
    y += 20;
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 20, y);
    doc.text('Authorized Signature', 150, y);
    doc.line(140, y + 2, 190, y + 2);

    doc.save('interior_invoice.pdf');
  };

  return (
    <div className="checkout-container">
      <h2>Checkout Summary</h2>

      <div className="checkout-items">
        {selectedItems.map((item, index) => (
          <div key={index} className="checkout-item">
            <span>{item.name}</span>
            <span>×{item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <h3 className="total-cost">Total: ₹{totalCost}</h3>

      <button className="pdf-btn" onClick={downloadInvoice}>
        📄 Download Invoice
      </button>

      <button className="pay-btn" onClick={() => setShowPayment(!showPayment)}>
        {showPayment ? 'Hide Payment Form' : 'Proceed to Payment'}
      </button>

      {showPayment && (
        <div className="payment-section">
          <h4>Contact Information</h4>
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setPhone(value);
            }}
          />
          <button className="contact-btn" onClick={handleSubmit}>
            Submit Details
          </button>
        </div>
      )}

      {submitted && <p className="success-msg">✅ Details submitted successfully! Will Contact soon through email.</p>}
    </div>
  );
};

export default Checkout;
