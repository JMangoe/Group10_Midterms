import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation matching User.js model
    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Validation passed
    setError("");
    setSuccess(`Form validated successfully! Username: ${form.username}, Role: ${form.role}`);
    console.log("Registration form data:", form);
    
    // Clear form after successful validation
    setForm({ username: "", password: "", role: "user" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
        <input name="username" onChange={handleChange} value={form.username}
               placeholder="Username (min 3 characters)" className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        <input type="password" name="password" onChange={handleChange} value={form.password}
               placeholder="Password (min 6 characters)" className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        <select name="role" onChange={handleChange} value={form.role}
                className="border border-gray-300 p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Register
        </button>
      </form>
    </div>
  );
}