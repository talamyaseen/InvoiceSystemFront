import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
            setRoles(userRoles);
        }
    }, []);

    const isAuditorOrSuperUser = roles.includes("ROLE_AUDITOR") || roles.includes("ROLE_SUPERUSER");

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <ul className="sidebar-menu">
                <li className="toggle-icon" onClick={() => setIsOpen(!isOpen)}>
                    <FaBars />
                </li>
                {isOpen && (
                    <>
                        {!roles.includes("ROLE_AUDITOR") && (
                            <li><Link to="/create-invoice">Create Invoice</Link></li>
                        )}
                        <li><Link to="/show-invoices">Show Invoices</Link></li>
                        {isAuditorOrSuperUser && (
                            <li><Link to="/fetch">Fetch</Link></li>
                        )}
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
