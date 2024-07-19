import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function SignUP() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const registerUser = () => {
        axios.post('http://127.0.0.1:5000/signup', {
            email: email,
            password: password
        })
        .then(function (response) {
            console.log(response);
            navigate("/");
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response && error.response.status === 401) {
                alert("Invalid credentials");
            }
        });
    };

    return (
        <div className="mx-auto my-10 max-w-md rounded-xl border px-4 py-10 text-gray-700 shadow-lg sm:px-8">
            <div className="mb-16 flex justify-between">
                <span className="font-bold">
                    <span className="inline-block h-3 w-3 bg-blue-600"></span> Sign Up
                </span>
                <span className="">Have an account? <a href="/login" className="font-medium text-blue-600 hover:underline">Log in</a></span>
            </div>
            <p className="mb-5 text-3xl font-medium">Create Your Account</p>
            <p className="mb-6 text-sm">Fill out the form below to create your account.</p>
            <div className="mb-6">
                <div className="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                        placeholder="Email"
                    />
                </div>
                <div className="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                        placeholder="Password"
                    />
                </div>
            </div>
            <button
                type="button"
                className="mb-6 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
                onClick={() => registerUser()}
            >
                Sign Up
            </button>
            <p className="">By signing up you are agreeing to our <a href="#" className="whitespace-nowrap font-medium text-gray-900 hover:underline">Terms and Conditions</a></p>
        </div>
    );
}
