import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import InvoiceForm from "./InvoiceForm";
import ShowInvoices from "./ShowInvoices";
import Layout from "./Layout";
import HomePage from "./HomePage";
import FetchData from "./FetchData";
import "./App.css";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
        setToken(storedToken);
        setRoles(userRoles);
        setLoading(false);
    }, []);

    const isAuditorOrSuperUser = roles.includes("ROLE_AUDITOR") || roles.includes("ROLE_SUPERUSER");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        setToken(null);
        setRoles([]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/signup" element={<SignUp />} />
                    {token ? (
                        <Route path="/" element={<Layout handleLogout={handleLogout} />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route 
                                path="create-invoice" 
                                element={roles.includes("ROLE_AUDITOR") ? <Navigate to="/dashboard" /> : <InvoiceForm />} 
                            />
                            <Route path="show-invoices" element={<ShowInvoices />} />
                            {isAuditorOrSuperUser && <Route path="fetch" element={<FetchData />} />}
                        </Route>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
