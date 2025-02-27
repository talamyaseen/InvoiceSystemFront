import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:8081/items', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            if (Array.isArray(response.data)) {
                const formattedItems = response.data.map(item => ({
                    itemId: item[0],
                    description: item[1],
                    name: item[2],
                    price: item[3]
                }));
                setItems(formattedItems);
            } else {
                console.error("Unexpected response format:", response.data);
            }
        })
        .catch(error => {
            console.error("Error fetching items:", error);
        });
    }, []);

    const handleQuantityChange = (itemId, quantity) => {
        const updatedInvoiceItems = [...invoiceItems];
        const itemIndex = updatedInvoiceItems.findIndex(item => item.itemId === itemId);

        if (itemIndex === -1) {
            updatedInvoiceItems.push({ itemId, quantity });
        } else {
            updatedInvoiceItems[itemIndex].quantity = quantity;
        }

        setInvoiceItems(updatedInvoiceItems);
        calculateTotal(updatedInvoiceItems);
    };

    const calculateTotal = (invoiceItems) => {
        let total = 0;
        invoiceItems.forEach(invoiceItem => {
            const item = items.find(i => i.itemId === invoiceItem.itemId);
            if (item) {
                total += item.price * invoiceItem.quantity;
            }
        });
        setTotalAmount(total);
    };

    const createInvoice = () => {
        const invoiceData = {
            status,
            totalAmount,
            description: 'Invoice created via React',
            items: invoiceItems.map(invoiceItem => {
                const item = items.find(i => i.itemId === invoiceItem.itemId);
                return {
                    itemId: invoiceItem.itemId,
                    quantity: invoiceItem.quantity,
                    price: item ? item.price : 0
                };
            })
        };

        axios.post('http://localhost:8081/invoices', invoiceData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
            alert('Invoice created successfully!');
        })
        .catch(error => {
            console.error("Error creating invoice:", error);
        });
    };

    return (
        <div className="container mt-5">
            <h3>Create Invoice</h3>
            <div className="mb-3">
                <label>Status:</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div className="row">
                {items.length > 0 ? (
                    items.map(item => (
                        <div key={item.itemId} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text">Price: ${item.price.toFixed(2)}</p>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control"
                                        placeholder="Quantity"
                                        onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading items...</p>
                )}
            </div>

            <div className="d-flex justify-content-between mt-3">
                <h4>Total: ${totalAmount.toFixed(2)}</h4>
                <button className="btn btn-success" onClick={createInvoice}>Create Invoice</button>
            </div>
        </div>
    );
};

export default InvoiceForm;
