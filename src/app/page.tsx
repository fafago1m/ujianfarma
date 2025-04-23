"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaPencil } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

const BASE_URL = "http://192.168.1.201:5003/api/group";

interface Group {
  group_id: number;
  group_name: string;
  active: string;
}

export default function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState({ group_name: "", active: "yes" });
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1); 

  useEffect(() => {
    fetchGroups(page);
  }, [page]);

  useEffect(() => {
    setPage(1); 
  }, [search]);

  const fetchGroups = async (currentPage = 1) => {
    try {
      const res = await axios.post(`${BASE_URL}/list?p=${currentPage}`, {
        id: "",
        name: "",
        active: "",
      });
      console.log("Fetched groups:", res.data.response.data);
      setGroups(res.data.response.data);
    } catch (err) {
      toast.error("Gagal mengambil data group.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res;
      if (editing) {
        res = await axios.post(`${BASE_URL}/edit`, {
          group_id: editing.group_id,
          group_name: form.group_name,
          active: form.active,
        });
      } else {
        res = await axios.post(`${BASE_URL}/add`, {
          group_id: -1,
          group_name: form.group_name,
          active: form.active,
        });
      }

      toast.success(res.data.metaData.message[0]);
      fetchGroups(page);
      resetForm();
    } catch (err) {
      console.error("Error saving group:", err);
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.post(`${BASE_URL}/delete`, { group_id: id });
      toast.success("Group berhasil dihapus.");
      fetchGroups(page);
    } catch {
      toast.error("Gagal menghapus group.");
    }
  };

  const resetForm = () => {
    setForm({ group_name: "", active: "yes" });
    setEditing(null);
    setModal(false);
  };

  const filtered = groups.filter(
    (g) =>
      g.group_name.toLowerCase().includes(search.toLowerCase()) ||
      g.active.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="container mx-auto px-4 py-8">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-center mb-4">User List</h1>

        <div className="flex justify-between mb-4">
          <input
            className="border px-3 py-2 rounded w-1/2"
            placeholder="Cari group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => {
              resetForm();
              setModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Tambah User
          </button>
          <button
            onClick={() => {
              resetForm();
              setModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Input Page
          </button>
        </div>

        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Nama</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.group_id} className="border-t">
                <td className="p-3">{g.group_name}</td>
                <td className="p-3">{g.active}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditing(g);
                      setForm({ group_name: g.group_name, active: g.active });
                      setModal(true);
                    }}
                    className="text-blue-500"
                  >
                    <FaPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(g.group_id)}
                    className="text-red-500"
                  >
                    <BiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editing ? "Edit Group" : "Tambah Group"}
              </h2>
              <form onSubmit={handleSave}>
                <input
                  className="w-full border p-2 mb-3 rounded"
                  placeholder="Nama Group"
                  value={form.group_name}
                  onChange={(e) =>
                    setForm({ ...form, group_name: e.target.value })
                  }
                  required
                />
                <select
                  className="w-full border p-2 mb-3 rounded"
                  value={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.value })
                  }
                >
                  <option value="yes">Aktif</option>
                  <option value="no">Tidak Aktif</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
