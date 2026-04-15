import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@muhasiboon.com";
const ADMIN_PASSWORD = "Muhasiboon@2026";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("muhasiboon_admin", "true");
        navigate("/admin");
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-bl from-blue-900 to-blue-700 flex items-center justify-center px-4"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-900 font-bold text-2xl">م</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-900">محاسبون</h1>
          <p className="text-gray-500 text-sm mt-1">تسجيل دخول المدير</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-50">
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
