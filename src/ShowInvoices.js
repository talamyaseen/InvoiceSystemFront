import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, InputGroup, FormControl, Pagination } from "react-bootstrap";

const ShowInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [updatedItems, setUpdatedItems] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [roles, setRoles] = useState([]);  // Store user roles
    const pageSize = 10;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRoles = JSON.parse(localStorage.getItem("roles")) || [];  // Assuming roles are stored in localStorage
        setRoles(userRoles);

        if (token) {
            fetchInvoices(currentPage);
        } else {
            setError("You must log in first.");
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredInvoices(invoices);
        } else {
            const filtered = invoices.filter((invoice) =>
                invoice.id.toString().includes(searchQuery)
            );
            setFilteredInvoices(filtered);
        }
    }, [searchQuery, invoices]);

    const fetchInvoices = async (page) => {
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
                params: {
                    page: page - 1,
                    size: pageSize,
                },
            });

            if (Array.isArray(response.data)) {
                setInvoices(response.data);
                setFilteredInvoices(response.data);
            } else {
                setError("Invalid response format.");
            }

            setTotalPages(response.headers['x-total-pages']);
        } catch (err) {
            setError("Failed to fetch invoices.");
        }
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
            };

            await axios.put(`http://localhost:8081/invoices/${selectedInvoiceId}`, updatedInvoice, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Check if the user has the "ROLE_AUDITOR" role
    const isAuditor = roles.includes("ROLE_AUDITOR");

    return (
        <div className="container mt-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h2 className="text-center">Invoices</h2>
            {error && <p className="text-danger">{error}</p>}

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search by Invoice ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>

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
                    {Array.isArray(filteredInvoices) && filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
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
                                    {/* Conditionally render "Update" and "Delete" buttons */}
                                    {!isAuditor && (
                                        <>
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
                                                    backgroundColor: "#2D6A4F",
                                                    borderColor: "#2D6A4F",
                                                }}
                                                className="ms-2"
                                                onClick={() => setSelectedInvoice(invoice) & setShowUpdateForm(true)}
                                            >
                                                Update
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No invoices found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>

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
                        {selectedInvoice?.items?.map((item) => (
                            <div key={item.itemId} className="mb-3">
                                <Form.Label>{item.itemName}</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const updated = selectedInvoice.items.map((i) =>
                                            i.itemId === item.itemId ? { ...i, quantity: e.target.value } : i
                                        );
                                        setSelectedInvoice({ ...selectedInvoice, items: updated });
                                    }}
                                />
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
