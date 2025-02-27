import React, { useState } from "react";
import axios from "axios";

const CreateInvoice = () => {
    const [totalAmount, setTotalAmount] = useState("");
    const [status, setStatus] = useState("");
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [invoice, setInvoice] = useState(null);

    // Handle adding new invoice items
    const handleAddItem = () => {
        setItems([...items, { itemId: "", quantity: 0 }]);
    };

    // Handle input change for items
    const handleItemChange = (index, e) => {
        const updatedItems = [...items];
        updatedItems[index][e.target.name] = e.target.value;
        setItems(updatedItems);
    };

    // Handle invoice creation
    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            // Get the token from localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must log in first.");
                return;
            }

            // Create the invoice object
            const invoiceData = {
                totalAmount,
                status,
                items,
            };

            // Send the request to the backend with the token in the Authorization header
            const response = await axios.post(
                "http://localhost:8081/invoices",
                invoiceData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token here
                    },
                }
            );

            setInvoice(response.data);  // Set the response (newly created invoice)
            setError("");  // Clear error if invoice creation is successful
        } catch (err) {
            setError("Failed to create invoice. Please try again.");
        }
    };

    return (
        <div>
            <h2>Create Invoice</h2>
            <form onSubmit={handleCreateInvoice}>
                <div>
                    <label>Total Amount</label>
                    <input
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Status</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>

                <h3>Invoice Items</h3>
                {items.map((item, index) => (
                    <div key={index}>
                        <label>Item ID</label>
                        <input
                            type="text"
                            name="itemId"
                            value={item.itemId}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddItem}>
                    Add Item
                </button>

                <button type="submit">Create Invoice</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {invoice && (
                <div>
                    <h3>Invoice Created</h3>
                    <p>Invoice ID: {invoice.id}</p>
                    <p>Total Amount: {invoice.totalAmount}</p>
                    <p>Status: {invoice.status}</p>
                </div>
            )}
        </div>
    );
};

export default CreateInvoice;
