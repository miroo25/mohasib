import { useState, useEffect } from "react";
import { supabase } from "../src/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("muhasiboon_admin")) {
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [a, j, s] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("softwares").select("*").order("created_at", { ascending: false }),
    ]);
    setArticles(a.data || []);
    setJobs(j.data || []);
    setSoftwares(s.data || []);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("muhasiboon_admin");
    navigate("/login");
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    await supabase.from(table).delete().eq("id", id);
    loadData();
  };

  const handleSave = async () => {
    const table = activeTab;
    if (editId) {
      await supabase.from(table).update(form).eq("id", editId);
    } else {
      await supabase.from(table).insert([form]);
    }
    setShowForm(false);
    setForm({});
    setEditId(null);
    loadData();
  };

  const openEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const openNew = () => {
    setForm({});
    setEditId(null);
    setShowForm(true);
  };

  const currentData = activeTab === "articles" ? articles : activeTab === "jobs" ? jobs : softwares;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header className="bg-gradient-to-l from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">م</span>
            </div>
            <h1 className="text-xl font-bold">لوحة إدارة محاسبون</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="text-sm bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-500">الموقع</Link>
            <button onClick={handleLogout} className="text-sm bg-red-500 px-4 py-2 rounded-full hover:bg-red-600">خروج</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { key: "articles", label: "📰 المقالات", count: articles.length, color: "blue" },
            { key: "jobs", label: "💼 الوظائف", count: jobs.length, color: "green" },
            { key: "softwares", label: "🛠 البرامج", count: softwares.length, color: "purple" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`p-5 rounded-2xl shadow text-center transition-all ${activeTab === tab.key ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:shadow-md"}`}>
              <p className="text-2xl font-bold">{tab.count}</p>
              <p className="text-sm mt-1">{tab.label}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "articles" ? "📰 المقالات" : activeTab === "jobs" ? "💼 الوظائف" : "🛠 البرامج"}
            </h2>
            <button onClick={openNew} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700">+ إضافة جديد</button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">جاري التحميل...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="p-3 text-right">الاسم / العنوان</th>
                    <th className="p-3 text-right">التصنيف</th>
                    <th className="p-3 text-right">الحالة</th>
                    <th className="p-3 text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map(item => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{item.title || item.name}</td>
                      <td className="p-3 text-gray-500">{item.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (item.is_published || item.is_active) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {(item.is_published || item.is_active) ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline text-xs">تعديل</button>
                          <button onClick={() => handleDelete(activeTab, item.id)} className="text-red-500 hover:underline text-xs">حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">{editId ? "تعديل" : "إضافة جديد"}</h3>
            {Object.keys(form).filter(k => !["id","created_at","updated_at","created_by_id","created_by","is_sample"].includes(k)).map(key => (
              <div key={key} className="mb-3">
                <label className="text-sm text-gray-600 mb-1 block">{key}</label>
                <input value={form[key] || ""} onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700">حفظ</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
