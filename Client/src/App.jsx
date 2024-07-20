import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import TodoList from './components/TodoList';
import SignUP from './components/SignUP';
import PricingSection from './components/PricingSection';

function AuthenticatedApp() {
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<TodoList />} />
                <Route path="/pricing" element={<PricingSection />} />
                <Route path="/signup" element={<SignUP />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthenticatedApp />
        </Router>
    );
}

export default App;
