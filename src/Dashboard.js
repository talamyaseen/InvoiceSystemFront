import React from "react";
import Sidebar from "./Sidebar";  // Import the Sidebar component

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-layout">
                <Sidebar />
                <div className="dashboard-content">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Select an action from the sidebar.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
