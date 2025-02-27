import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import InvoiceForm from "./InvoiceForm";
import ShowInvoices from "./ShowInvoices";
import Layout from "./Layout"; // Layout component
import "./App.css"; // Import your CSS file


function App() {
    const [token, setToken] = useState(localStorage.getItem("token")); // Retrieve token from localStorage

    useEffect(() => {
        // Ensure token is updated on page load/refresh
        setToken(localStorage.getItem("token"));
    }, []);

    return (
        <Router>
            <div className="container">
                <Routes>
                    {/* Login and SignUp routes */}
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected Route: Only accessible if the user is logged in */}
                    <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
                        {/* Nested routes that are displayed within the Layout */}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="create-invoice" element={<InvoiceForm />} />
                        <Route path= "/show-invoices" element={<ShowInvoices />} />
                    </Route>
                   
                    {/* Catch-all Route for invalid URLs */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
