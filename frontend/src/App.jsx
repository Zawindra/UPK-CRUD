import { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./api/api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "pengeluaran",
    category: "Lain-lain",
    date: new Date().toISOString().split("T")[0],
  });

  const loadData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  useEffect(() => { loadData(); }, []);

  // --- FITUR BARU: LOGIKA PERHITUNGAN ---
  const totalPemasukan = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const saldoTotal = totalPemasukan - totalPengeluaran;
  // --------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateTransaction(currentId, formData);
      setIsEditing(false);
      setCurrentId(null);
    } else {
      await addTransaction(formData);
    }
    setFormData({ ...formData, description: "", amount: "" });
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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 text-slate-700">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">JO<span className="text-blue-600">PersonalFinance.</span></h1>
          <p className="text-slate-500 mt-2 font-medium italic">"Make Big Money."</p>
        </header>

        {/* --- FITUR BARU: DASHBOARD CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Saldo</p>
            <h3 className={`text-2xl font-bold mt-2 ${saldoTotal >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              Rp {saldoTotal.toLocaleString('id-ID')}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pemasukan</p>
            <h3 className="text-2xl font-bold mt-2 text-emerald-600">
              + Rp {totalPemasukan.toLocaleString('id-ID')}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-rose-500 hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pengeluaran</p>
            <h3 className="text-2xl font-bold mt-2 text-rose-600">
              - Rp {totalPengeluaran.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>
        {/* ---------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-10">
              <h2 className="text-xl font-semibold mb-6">{isEditing ? "📝 Edit Transaksi" : "✨ Tambah Baru"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-1">Deskripsi</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-1">Tipe</label>
                  <select 
                    className="w-full border border-slate-200 p-3 rounded-xl outline-none appearance-none bg-slate-50 cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="pengeluaran">🔴 Pengeluaran</option>
                    <option value="pemasukan">🟢 Pemasukan</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-slate-50"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isEditing ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                >
                  {isEditing ? "Update Perubahan" : "Simpan Transaksi"}
                </button>
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setFormData({...formData, description: "", amount: ""}); }}
                    className="w-full text-slate-400 text-sm hover:underline"
                  >
                    Batal Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Main Content (Table) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-400 text-sm uppercase">
                  <tr>
                    <th className="p-5 font-semibold text-left">Transaksi</th>
                    <th className="p-5 font-semibold text-right">Nominal</th>
                    <th className="p-5 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <p className="font-semibold text-slate-800">{t.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(t.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</p>
                      </td>
                      <td className={`p-5 text-right font-bold ${t.type === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'pemasukan' ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(t)} className="p-2 bg-blue-400 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(t.id)} className="p-2 bg-rose-400 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="p-20 text-center text-slate-400">
                  <div className="text-5xl mb-4">Empty 🍃</div>
                  <p className="font-medium">Belum Ada Riwayat Transaksi.</p>
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