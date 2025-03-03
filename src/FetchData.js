import React, { useState } from "react";
import axios from "axios";
import { Button, Table, Form, Container, Card } from "react-bootstrap";

const FetchData = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleExecute = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:8081/execute", 
                query,
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
                }
            );
            setResults(response.data);
            console.log("API response data:", response.data);  // Debugging the API response
        } catch (err) {
            setError("Failed to execute query. Please check your input and try again.");
            console.error("Error executing query:", err);
        }
        setLoading(false);
    };

    return (
        <Container className="mt-4">
            <Card className="shadow p-4">
                <h3 className="text-center mb-3">Execute SQL Query</h3>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter SQL Query</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SELECT * FROM invoices;"
                        />
                    </Form.Group>
                    <Button 
                        variant="success"  // Light green button color
                        onClick={handleExecute} 
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? "Executing..." : "Execute"}
                    </Button>
                </Form>
                {error && <p className="text-danger mt-3">{error}</p>}
                {results.length > 0 && (
                    <Table striped bordered hover responsive className="mt-4">
                        <thead>
                            <tr>

                                {Object.keys(results[0]).map((key) => (
                                    <th key={key}>{key}</th>  
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx}>{value}</td>  
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </Container>
    );
};

export default FetchData;
