import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError("Account already exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-5">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-6">

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Create account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Start tracking your expenses
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleRegister}
          className="rounded-2xl bg-white p-6 shadow-sm space-y-4"
        >
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white active:scale-[0.98] transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}