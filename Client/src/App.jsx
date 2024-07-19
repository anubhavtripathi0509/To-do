import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Login from './components/Login';
import SignUP from './components/SignUP';
import PricingSection from './components/PricingSection';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<PricingSection />} />
        {/* <Route element={<NotFound />} /> */}
        <Route path="/signup" element={<SignUP />} />
      </Routes>
    </Router>
  );
}

export default App;
