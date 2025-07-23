// src/pages/admin/Users.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Confetti configs for Users vs Admin (3 each per action)
const confettiConfigs = {
  Users: {
    create: [
      { spread: 60, particleCount: 80, origin: { y: 0.7 } },
      { spread: 90, particleCount: 60, origin: { x: 0.25, y: 0.75 } },
      { spread: 120, particleCount: 40, origin: { x: 0.75, y: 0.75 } },
    ],
    edit: [
      { spread: 50, particleCount: 60, origin: { y: 0.6 } },
      { spread: 80, particleCount: 50, origin: { x: 0.3, y: 0.65 } },
      { spread: 100, particleCount: 30, origin: { x: 0.7, y: 0.65 } },
    ],
    delete: [
      { spread: 40, particleCount: 50, origin: { y: 0.5 } },
      { spread: 70, particleCount: 40, origin: { x: 0.2, y: 0.55 } },
      { spread: 90, particleCount: 20, origin: { x: 0.8, y: 0.55 } },
    ],
  },
  Admin: {
    create: [
      { spread: 70, particleCount: 120, origin: { y: 0.7 } },
      { spread: 110, particleCount: 80, origin: { x: 0.3, y: 0.75 } },
      { spread: 130, particleCount: 60, origin: { x: 0.7, y: 0.75 } },
    ],
    edit: [
      { spread: 60, particleCount: 100, origin: { y: 0.6 } },
      { spread: 90, particleCount: 70, origin: { x: 0.3, y: 0.65 } },
      { spread: 110, particleCount: 50, origin: { x: 0.7, y: 0.65 } },
    ],
    delete: [
      { spread: 50, particleCount: 80, origin: { y: 0.5 } },
      { spread: 85, particleCount: 60, origin: { x: 0.2, y: 0.55 } },
      { spread: 105, particleCount: 40, origin: { x: 0.8, y: 0.55 } },
    ],
  },
};

function fireConfetti(action, role) {
  const set = confettiConfigs[role] || confettiConfigs.Users;
  const variants = set[action] || [];
  if (variants.length) {
    const cfg = variants[Math.floor(Math.random() * variants.length)];
    confetti(cfg);
  }
}

export default function Users() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // which row’s menu is open?
  const [openMenuFor, setOpenMenuFor] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    district: '',
    phoneNumber: '',
    role: 'Users',
    isVerified: false,
  });

  // ─── Load users ───────────────────────────────────────────
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not load users');
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  // ─── Open Create/Edit ─────────────────────────────────────
  const openCreate = () => {
    setIsEdit(false);
    setEditingUser(null);
    setForm({
      fullName: '',
      email: '',
      password: '',
      district: '',
      phoneNumber: '',
      role: 'Users',
      isVerified: false,
    });
    setModalOpen(true);
  };
  const openEdit = (u) => {
    setIsEdit(true);
    setEditingUser(u);
    setForm({
      fullName: u.fullName,
      email: u.email,
      password: '',
      district: u.district,
      phoneNumber: u.phoneNumber,
      role: u.role,
      isVerified: u.isVerified,
    });
    setModalOpen(true);
  };

  // ─── Confirm Delete ───────────────────────────────────────
  const confirmDelete = (u) => {
    setDeleteTarget(u);
    setConfirmOpen(true);
  };
  const doDelete = async () => {
    const id = deleteTarget._id || deleteTarget.id;
    const targetRole = deleteTarget.role || 'Users';
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted ' + deleteTarget.fullName);
      fireConfetti('delete', targetRole);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  // ─── Create/Update ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !form.password.trim()) {
      toast.error('Password required for new user');
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      district: form.district.trim(),
      phoneNumber: form.phoneNumber.trim(),
      role: form.role,
      isVerified: form.isVerified,
    };
    if (!isEdit || form.password.trim()) {
      payload.password = form.password.trim();
    }

    const url = isEdit
      ? `${API_URL}/admin/users/${editingUser._id || editingUser.id}`
      : `${API_URL}/admin/users`;
    const method = isEdit ? 'PUT' : 'POST';
    const targetRole = isEdit ? editingUser.role : form.role;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { msg } = await res.json();
        throw new Error(msg || 'Save failed');
      }
      toast.success(isEdit ? 'Updated ' + form.fullName : 'Created ' + form.fullName);
      fireConfetti(isEdit ? 'edit' : 'create', targetRole);
      setModalOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ─── Form change ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="p-6 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add User
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-100">
            <tr>
              {['Name', 'Email', 'Role', 'Verified', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-sm font-semibold text-green-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, i) => {
                const id = u._id || u.id;
                return (
                  <tr key={id} className={i % 2 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{u.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{u.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.isVerified ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                      {/* toggle menu for this row */}
                      <button
                        onClick={() => setOpenMenuFor(openMenuFor === id ? null : id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      </button>

                      {/* only render this row’s menu */}
                      {openMenuFor === id && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg w-32 z-50"
                        >
                          <button
                            onClick={() => {
                              openEdit(u);
                              setOpenMenuFor(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-2 text-blue-600" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              confirmDelete(u);
                              setOpenMenuFor(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
                          >
                            <TrashIcon className="h-4 w-4 mr-2 text-red-600" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? 'Edit User' : 'Create User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', name: 'fullName' },
                { label: 'Email', name: 'email', type: 'email' },
                {
                  label: `Password${isEdit ? ' (leave blank)' : ''}`,
                  name: 'password',
                  type: 'password',
                },
                { label: 'District', name: 'district' },
                { label: 'Phone Number', name: 'phoneNumber' },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium">{label}</label>
                  <input
                    name={name}
                    type={type || 'text'}
                    value={form[name]}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                    required={name === 'password' ? !isEdit : true}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option>Admin</option>
                  <option>Users</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  name="isVerified"
                  type="checkbox"
                  checked={form.isVerified}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600"
                />
                <label className="text-sm">Verified</label>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  {isEdit ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Delete <b>{deleteTarget.fullName}</b>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
