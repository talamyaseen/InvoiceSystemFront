import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const ShowInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [updatedItems, setUpdatedItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must log in first.");
                return;
            }

            const response = await axios.get("http://localhost:8081/invoices", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInvoices(response.data);
        } catch (err) {
            setError("Failed to fetch invoices.");
        }
    };

    const calculateTotalAmount = () => {
        return updatedItems.reduce(
            (total, item) => total + item.quantity * item.price, // Assuming each item has a 'price' property
            0
        );
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must log in first.");
                return;
            }

            await axios.delete(`http://localhost:8081/invoices/${selectedInvoiceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setInvoices(invoices.filter((invoice) => invoice.id !== selectedInvoiceId));
            setShowConfirm(false);
        } catch (err) {
            setError("Failed to delete invoice.");
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must log in first.");
                return;
            }

            const updatedInvoice = {
                ...selectedInvoice,
                items: updatedItems,
                totalAmount: calculateTotalAmount(), // Update total amount
            };

            // Send the updated invoice data to the server
            await axios.put(`http://localhost:8081/invoices/${selectedInvoiceId}`, updatedInvoice, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the invoice list with the new data
            setInvoices(
                invoices.map((invoice) =>
                    invoice.id === selectedInvoiceId ? updatedInvoice : invoice
                )
            );

            setShowUpdateForm(false);
        } catch (err) {
            setError("Failed to update invoice.");
        }
    };

    const handleItemQuantityChange = (itemId, newQuantity) => {
        const updatedItemsList = updatedItems.map((item) =>
            item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        );
        setUpdatedItems(updatedItemsList);
    };

    const handleItemRemove = (itemId) => {
        const updatedItemsList = updatedItems.filter((item) => item.itemId !== itemId);
        setUpdatedItems(updatedItemsList);
    };

    const openUpdateForm = (invoice) => {
        setSelectedInvoiceId(invoice.id);
        setSelectedInvoice(invoice);
        setUpdatedItems(invoice.items);
        setShowUpdateForm(true);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Invoices</h2>
            {error && <p className="text-danger">{error}</p>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.status}</td>
                            <td>${invoice.totalAmount.toFixed(2)}</td>
                            <td>
                                <ul>
                                    {invoice.items.map((item) => (
                                        <li key={item.itemId}>
                                            {item.itemName} (Quantity: {item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setSelectedInvoiceId(invoice.id);
                                        setShowConfirm(true);
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: "#2D6A4F", // Custom color
                                        borderColor: "#2D6A4F",
                                    }}
                                    className="ms-2"
                                    onClick={() => openUpdateForm(invoice)}
                                >
                                    Update
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this invoice?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Form Modal */}
            <Modal show={showUpdateForm} onHide={() => setShowUpdateForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {updatedItems.map((item) => (
                            <div key={item.itemId} className="mb-3">
                                <Form.Label>{item.itemName}</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleItemQuantityChange(item.itemId, e.target.value)
                                    }
                                    min="0"
                                />
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    onClick={() => handleItemRemove(item.itemId)}
                                >
                                    Remove Item
                                </Button>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateForm(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ShowInvoices;


