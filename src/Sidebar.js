import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Import icon
import "./Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true); // Sidebar state

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <ul className="sidebar-menu">
                {/* Toggle Button (inside Sidebar) */}
                <li className="toggle-icon" onClick={() => setIsOpen(!isOpen)}>
                    <FaBars />
                </li>

                {isOpen && (
                    <>
                        <li><Link to="/create-invoice">Create Invoice</Link></li>
                        <li><Link to="/show-invoices">Show Invoices</Link></li>
                        <li><Link to="/update-invoice">Delete/Update Invoice</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
