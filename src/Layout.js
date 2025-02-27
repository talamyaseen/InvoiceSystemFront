import React from "react";
import Sidebar from "./Sidebar"; 
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div className="dashboard-container">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
