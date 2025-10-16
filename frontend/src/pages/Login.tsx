import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full mx-auto text-center mb-8">
        <h1 className="text-6xl font-black mb-4 text-[#7c3aed] font-serif italic tracking-tight drop-shadow-lg">Vivid Recipes</h1>
        <p className="text-xl text-[#2d3748] max-w-2xl mx-auto font-fira font-semibold italic tracking-wide">
          Login to access personalized recipes powered by AI
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
  <h2 className="text-3xl font-bold mb-6 text-center text-[#7c3aed] font-serif">Login to Vivid Recipes</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-primary hover:underline">
            Don't have an account? Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;