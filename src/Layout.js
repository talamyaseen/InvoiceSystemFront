import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css"; // Make sure you import the Layout CSS

const Layout = () => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="content-container">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
