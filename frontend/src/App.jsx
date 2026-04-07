import { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./api/api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Fitur Dark Mode State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "pengeluaran",
    category: "Lain-lain",
    date: new Date().toISOString().split("T")[0],
  });

  // Effect untuk Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const loadData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  useEffect(() => { loadData(); }, []);

  const totalPemasukan = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const saldoTotal = totalPemasukan - totalPengeluaran;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      date: formData.date || new Date().toISOString().split("T")[0]
    };

    if (isEditing) {
      await updateTransaction(currentId, dataToSubmit);
      setIsEditing(false);
      setCurrentId(null);
    } else {
      await addTransaction(dataToSubmit);
    }

    setFormData({ 
      description: "", 
      amount: "", 
      type: "pengeluaran",
      category: "Lain-lain",
      date: new Date().toISOString().split("T")[0] 
    });
    loadData();
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      description: item.description,
      amount: item.amount,
      type: item.type,
      category: item.category,
      date: item.date.split("T")[0],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus catatan ini?")) {
      await deleteTransaction(id);
      loadData();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-700'} p-6 lg:p-12`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex justify-between items-center">
          <div className="text-left">
            <h1 className={`text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              JO<span className="text-blue-500">PersonalFinance.</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium italic">"Make Big Money."</p>
          </div>
          
          {/* Dark Mode Toggle Icon */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-2xl transition-all shadow-sm ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-900 border border-slate-100'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border-l-4 border-blue-500`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Saldo</p>
            <h3 className={`text-2xl font-bold mt-2 ${saldoTotal >= 0 ? (darkMode ? 'text-white' : 'text-slate-900') : 'text-rose-500'}`}>
              Rp {saldoTotal.toLocaleString('id-ID')}
            </h3>
          </div>

          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pemasukan</p>
            <h3 className="text-2xl font-bold mt-2 text-emerald-500">+ Rp {totalPemasukan.toLocaleString('id-ID')}</h3>
          </div>

          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border-l-4 border-rose-500`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pengeluaran</p>
            <h3 className="text-2xl font-bold mt-2 text-rose-500">- Rp {totalPengeluaran.toLocaleString('id-ID')}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-8 rounded-2xl shadow-sm border sticky top-10`}>
              <h2 className="text-xl font-semibold mb-6">{isEditing ? "📝 Edit Transaksi" : "✨ Tambah Baru"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-1">Deskripsi</label>
                  <input
                    type="text"
                    className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                    placeholder="Misal: Gaji Pokok"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                
                {/* Custom Smooth Type Switcher */}
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-2">Tipe Transaksi</label>
                  <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'pengeluaran'})}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'pengeluaran' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-rose-400'}`}
                    >
                      Pengeluaran
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'pemasukan'})}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'pemasukan' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-emerald-400'}`}
                    >
                      Pemasukan
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'}`}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${isEditing ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                >
                  {isEditing ? "Update Perubahan" : "Simpan Transaksi"}
                </button>
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setFormData({ ...formData, description: "", amount: "" }); }}
                    className="w-full text-slate-400 text-sm hover:underline"
                  >
                    Batal Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Main Table Content */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'} text-slate-400 text-xs uppercase tracking-wider`}>
                  <tr>
                    <th className="p-5 font-semibold text-left">Transaksi</th>
                    <th className="p-5 font-semibold text-right">Nominal</th>
                    <th className="p-5 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                  {transactions.map((t) => (
                    <tr key={t.id} className={`transition-colors group ${darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="p-5">
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(t.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</p>
                      </td>
                      <td className={`p-5 text-right font-bold ${t.type === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'pemasukan' ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(t)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(t.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="p-20 text-center text-slate-500">
                  <div className="text-5xl mb-4 opacity-20">🍃</div>
                  <p className="font-medium italic">Belum Ada Riwayat Transaksi.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;