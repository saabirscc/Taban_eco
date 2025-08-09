// // src/pages/admin/Users.jsx
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   PencilSquareIcon,
//   TrashIcon,
//   PlusIcon,
//   ChevronDownIcon,
// } from '@heroicons/react/24/outline';
// import toast, { Toaster } from 'react-hot-toast';
// import confetti from 'canvas-confetti';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Confetti configs for Users vs Admin (3 each per action)
// const confettiConfigs = {
//   Users: {
//     create: [
//       { spread: 60, particleCount: 80, origin: { y: 0.7 } },
//       { spread: 90, particleCount: 60, origin: { x: 0.25, y: 0.75 } },
//       { spread: 120, particleCount: 40, origin: { x: 0.75, y: 0.75 } },
//     ],
//     edit: [
//       { spread: 50, particleCount: 60, origin: { y: 0.6 } },
//       { spread: 80, particleCount: 50, origin: { x: 0.3, y: 0.65 } },
//       { spread: 100, particleCount: 30, origin: { x: 0.7, y: 0.65 } },
//     ],
//     delete: [
//       { spread: 40, particleCount: 50, origin: { y: 0.5 } },
//       { spread: 70, particleCount: 40, origin: { x: 0.2, y: 0.55 } },
//       { spread: 90, particleCount: 20, origin: { x: 0.8, y: 0.55 } },
//     ],
//   },
//   Admin: {
//     create: [
//       { spread: 70, particleCount: 120, origin: { y: 0.7 } },
//       { spread: 110, particleCount: 80, origin: { x: 0.3, y: 0.75 } },
//       { spread: 130, particleCount: 60, origin: { x: 0.7, y: 0.75 } },
//     ],
//     edit: [
//       { spread: 60, particleCount: 100, origin: { y: 0.6 } },
//       { spread: 90, particleCount: 70, origin: { x: 0.3, y: 0.65 } },
//       { spread: 110, particleCount: 50, origin: { x: 0.7, y: 0.65 } },
//     ],
//     delete: [
//       { spread: 50, particleCount: 80, origin: { y: 0.5 } },
//       { spread: 85, particleCount: 60, origin: { x: 0.2, y: 0.55 } },
//       { spread: 105, particleCount: 40, origin: { x: 0.8, y: 0.55 } },
//     ],
//   },
// };

// function fireConfetti(action, role) {
//   const set = confettiConfigs[role] || confettiConfigs.Users;
//   const variants = set[action] || [];
//   if (variants.length) {
//     const cfg = variants[Math.floor(Math.random() * variants.length)];
//     confetti(cfg);
//   }
// }

// export default function Users() {
//   const { token } = useAuth();

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   // which row’s menu is open?
//   const [openMenuFor, setOpenMenuFor] = useState(null);

//   const [form, setForm] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     district: '',
//     phoneNumber: '',
//     role: 'Users',
//     isVerified: false,
//   });

//   // ─── Load users ───────────────────────────────────────────
//   const loadUsers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_URL}/admin/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Could not load users');
//       setUsers(await res.json());
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (token) loadUsers();
//   }, [token]);

//   // ─── Open Create/Edit ─────────────────────────────────────
//   const openCreate = () => {
//     setIsEdit(false);
//     setEditingUser(null);
//     setForm({
//       fullName: '',
//       email: '',
//       password: '',
//       district: '',
//       phoneNumber: '',
//       role: 'Users',
//       isVerified: false,
//     });
//     setModalOpen(true);
//   };
//   const openEdit = (u) => {
//     setIsEdit(true);
//     setEditingUser(u);
//     setForm({
//       fullName: u.fullName,
//       email: u.email,
//       password: '',
//       district: u.district,
//       phoneNumber: u.phoneNumber,
//       role: u.role,
//       isVerified: u.isVerified,
//     });
//     setModalOpen(true);
//   };

//   // ─── Confirm Delete ───────────────────────────────────────
//   const confirmDelete = (u) => {
//     setDeleteTarget(u);
//     setConfirmOpen(true);
//   };
//   const doDelete = async () => {
//     const id = deleteTarget._id || deleteTarget.id;
//     const targetRole = deleteTarget.role || 'Users';
//     try {
//       const res = await fetch(`${API_URL}/admin/users/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Delete failed');
//       toast.success('Deleted ' + deleteTarget.fullName);
//       fireConfetti('delete', targetRole);
//       loadUsers();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setConfirmOpen(false);
//       setDeleteTarget(null);
//     }
//   };

//   // ─── Create/Update ────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isEdit && !form.password.trim()) {
//       toast.error('Password required for new user');
//       return;
//     }

//     const payload = {
//       fullName: form.fullName.trim(),
//       email: form.email.trim(),
//       district: form.district.trim(),
//       phoneNumber: form.phoneNumber.trim(),
//       role: form.role,
//       isVerified: form.isVerified,
//     };
//     if (!isEdit || form.password.trim()) {
//       payload.password = form.password.trim();
//     }

//     const url = isEdit
//       ? `${API_URL}/admin/users/${editingUser._id || editingUser.id}`
//       : `${API_URL}/admin/users`;
//     const method = isEdit ? 'PUT' : 'POST';
//     const targetRole = isEdit ? editingUser.role : form.role;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const { msg } = await res.json();
//         throw new Error(msg || 'Save failed');
//       }
//       toast.success(isEdit ? 'Updated ' + form.fullName : 'Created ' + form.fullName);
//       fireConfetti(isEdit ? 'edit' : 'create', targetRole);
//       setModalOpen(false);
//       loadUsers();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   // ─── Form change ──────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
//   };

//   return (
//     <div className="p-6 relative">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold">Users</h1>
//         <button
//           onClick={openCreate}
//           className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" /> Add User
//         </button>
//       </div>

//       {error && <div className="mb-4 text-red-600">{error}</div>}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-green-100">
//             <tr>
//               {['Name', 'Email', 'Role', 'Verified', 'Actions'].map((h) => (
//                 <th
//                   key={h}
//                   className="px-6 py-3 text-left text-sm font-semibold text-green-700"
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8">
//                   Loading…
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8 text-gray-500">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               users.map((u, i) => {
//                 const id = u._id || u.id;
//                 return (
//                   <tr key={id} className={i % 2 ? 'bg-green-50' : ''}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">{u.fullName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">{u.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">{u.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {u.isVerified ? 'Yes' : 'No'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm relative">
//                       {/* toggle menu for this row */}
//                       <button
//                         onClick={() => setOpenMenuFor(openMenuFor === id ? null : id)}
//                         className="p-1 rounded hover:bg-gray-100"
//                       >
//                         <ChevronDownIcon className="h-5 w-5 text-gray-500" />
//                       </button>

//                       {/* only render this row’s menu */}
//                       {openMenuFor === id && (
//                         <div
//                           className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg w-32 z-50"
//                         >
//                           <button
//                             onClick={() => {
//                               openEdit(u);
//                               setOpenMenuFor(null);
//                             }}
//                             className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
//                           >
//                             <PencilSquareIcon className="h-4 w-4 mr-2 text-blue-600" />
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => {
//                               confirmDelete(u);
//                               setOpenMenuFor(null);
//                             }}
//                             className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
//                           >
//                             <TrashIcon className="h-4 w-4 mr-2 text-red-600" />
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Create/Edit Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
//             <button
//               onClick={() => setModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4">
//               {isEdit ? 'Edit User' : 'Create User'}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {[
//                 { label: 'Full Name', name: 'fullName' },
//                 { label: 'Email', name: 'email', type: 'email' },
//                 {
//                   label: `Password${isEdit ? ' (leave blank)' : ''}`,
//                   name: 'password',
//                   type: 'password',
//                 },
//                 { label: 'District', name: 'district' },
//                 { label: 'Phone Number', name: 'phoneNumber' },
//               ].map(({ label, name, type }) => (
//                 <div key={name}>
//                   <label className="block text-sm font-medium">{label}</label>
//                   <input
//                     name={name}
//                     type={type || 'text'}
//                     value={form[name]}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                     required={name === 'password' ? !isEdit : true}
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label className="block text-sm font-medium">Role</label>
//                 <select
//                   name="role"
//                   value={form.role}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                 >
//                   <option>Admin</option>
//                   <option>Users</option>
//                 </select>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   name="isVerified"
//                   type="checkbox"
//                   checked={form.isVerified}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-green-600"
//                 />
//                 <label className="text-sm">Verified</label>
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setModalOpen(false)}
//                   className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   {isEdit ? 'Save' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation */}
//       {confirmOpen && (
//         <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 text-center">
//             <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
//             <p className="mb-6">
//               Delete <b>{deleteTarget.fullName}</b>?
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => setConfirmOpen(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={doDelete}
//                 className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


















//update
// src/pages/admin/Users.jsx
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   PencilSquareIcon,
//   TrashIcon,
//   PlusIcon,
//   MagnifyingGlassIcon,
// } from '@heroicons/react/24/outline';
// import toast, { Toaster } from 'react-hot-toast';
// import confetti from 'canvas-confetti';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Confetti configs for Users vs Admin (3 each per action)
// const confettiConfigs = {
//   Users: {
//     create: [
//       { spread: 60, particleCount: 80, origin: { y: 0.7 } },
//       { spread: 90, particleCount: 60, origin: { x: 0.25, y: 0.75 } },
//       { spread: 120, particleCount: 40, origin: { x: 0.75, y: 0.75 } },
//     ],
//     edit: [
//       { spread: 50, particleCount: 60, origin: { y: 0.6 } },
//       { spread: 80, particleCount: 50, origin: { x: 0.3, y: 0.65 } },
//       { spread: 100, particleCount: 30, origin: { x: 0.7, y: 0.65 } },
//     ],
//     delete: [
//       { spread: 40, particleCount: 50, origin: { y: 0.5 } },
//       { spread: 70, particleCount: 40, origin: { x: 0.2, y: 0.55 } },
//       { spread: 90, particleCount: 20, origin: { x: 0.8, y: 0.55 } },
//     ],
//   },
//   Admin: {
//     create: [
//       { spread: 70, particleCount: 120, origin: { y: 0.7 } },
//       { spread: 110, particleCount: 80, origin: { x: 0.3, y: 0.75 } },
//       { spread: 130, particleCount: 60, origin: { x: 0.7, y: 0.75 } },
//     ],
//     edit: [
//       { spread: 60, particleCount: 100, origin: { y: 0.6 } },
//       { spread: 90, particleCount: 70, origin: { x: 0.3, y: 0.65 } },
//       { spread: 110, particleCount: 50, origin: { x: 0.7, y: 0.65 } },
//     ],
//     delete: [
//       { spread: 50, particleCount: 80, origin: { y: 0.5 } },
//       { spread: 85, particleCount: 60, origin: { x: 0.2, y: 0.55 } },
//       { spread: 105, particleCount: 40, origin: { x: 0.8, y: 0.55 } },
//     ],
//   },
// };

// function fireConfetti(action, role) {
//   const set = confettiConfigs[role] || confettiConfigs.Users;
//   const variants = set[action] || [];
//   if (variants.length) {
//     const cfg = variants[Math.floor(Math.random() * variants.length)];
//     confetti(cfg);
//   }
// }

// export default function Users() {
//   const { token } = useAuth();

//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const [modalOpen, setModalOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const [form, setForm] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     district: '',
//     phoneNumber: '',
//     role: 'Users',
//     isVerified: false,
//   });

//   // ─── Load users ───────────────────────────────────────────
//   const loadUsers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_URL}/admin/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Could not load users');
//       const data = await res.json();
//       setUsers(data);
//       setFilteredUsers(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (token) loadUsers();
//   }, [token]);

//   // ─── Search functionality ─────────────────────────────────
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredUsers(users);
//     } else {
//       const term = searchTerm.toLowerCase();
//       const filtered = users.filter(
//         (user) =>
//           user.fullName.toLowerCase().includes(term) ||
//           user.email.toLowerCase().includes(term) ||
//           user.role.toLowerCase().includes(term) ||
//           user.district?.toLowerCase().includes(term)
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchTerm, users]);

//   // ─── Open Create/Edit ─────────────────────────────────────
//   const openCreate = () => {
//     setIsEdit(false);
//     setEditingUser(null);
//     setForm({
//       fullName: '',
//       email: '',
//       password: '',
//       district: '',
//       phoneNumber: '',
//       role: 'Users',
//       isVerified: false,
//     });
//     setModalOpen(true);
//   };
//   const openEdit = (u) => {
//     setIsEdit(true);
//     setEditingUser(u);
//     setForm({
//       fullName: u.fullName,
//       email: u.email,
//       password: '',
//       district: u.district,
//       phoneNumber: u.phoneNumber,
//       role: u.role,
//       isVerified: u.isVerified,
//     });
//     setModalOpen(true);
//   };

//   // ─── Confirm Delete ───────────────────────────────────────
//   const confirmDelete = (u) => {
//     setDeleteTarget(u);
//     setConfirmOpen(true);
//   };
//   const doDelete = async () => {
//     const id = deleteTarget._id || deleteTarget.id;
//     const targetRole = deleteTarget.role || 'Users';
//     try {
//       const res = await fetch(`${API_URL}/admin/users/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Delete failed');
//       toast.success('Deleted ' + deleteTarget.fullName);
//       fireConfetti('delete', targetRole);
//       loadUsers();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setConfirmOpen(false);
//       setDeleteTarget(null);
//     }
//   };

//   // ─── Create/Update ────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isEdit && !form.password.trim()) {
//       toast.error('Password required for new user');
//       return;
//     }

//     const payload = {
//       fullName: form.fullName.trim(),
//       email: form.email.trim(),
//       district: form.district.trim(),
//       phoneNumber: form.phoneNumber.trim(),
//       role: form.role,
//       isVerified: form.isVerified,
//     };
//     if (!isEdit || form.password.trim()) {
//       payload.password = form.password.trim();
//     }

//     const url = isEdit
//       ? `${API_URL}/admin/users/${editingUser._id || editingUser.id}`
//       : `${API_URL}/admin/users`;
//     const method = isEdit ? 'PUT' : 'POST';
//     const targetRole = isEdit ? editingUser.role : form.role;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const { msg } = await res.json();
//         throw new Error(msg || 'Save failed');
//       }
//       toast.success(isEdit ? 'Updated ' + form.fullName : 'Created ' + form.fullName);
//       fireConfetti(isEdit ? 'edit' : 'create', targetRole);
//       setModalOpen(false);
//       loadUsers();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   // ─── Form change ──────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
//   };

//   return (
//     <div className="p-6 relative">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <h1 className="text-3xl font-bold">Users</h1>
        
//         <div className="flex flex-col sm:flex-row gap-4">
//           {/* Search Bar */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
//             />
//           </div>
          
//           <button
//             onClick={openCreate}
//             className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
//           >
//             <PlusIcon className="h-5 w-5 mr-2" /> Add User
//           </button>
//         </div>
//       </div>

//       {error && <div className="mb-4 text-red-600">{error}</div>}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-green-100">
//             <tr>
//               {['Name', 'Email', 'Role', 'Verified', 'Actions'].map((h) => (
//                 <th
//                   key={h}
//                   className="px-6 py-3 text-left text-sm font-semibold text-green-700"
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8">
//                   Loading…
//                 </td>
//               </tr>
//             ) : filteredUsers.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-8 text-gray-500">
//                   {searchTerm ? 'No matching users found' : 'No users found'}
//                 </td>
//               </tr>
//             ) : (
//               filteredUsers.map((u) => {
//                 const id = u._id || u.id;
//                 return (
//                   <tr key={id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {u.fullName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {u.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {u.role}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {u.isVerified ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Yes
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                           No
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => openEdit(u)}
//                           className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
//                           title="Edit"
//                         >
//                           <PencilSquareIcon className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => confirmDelete(u)}
//                           className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
//                           title="Delete"
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Create/Edit Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
//             <button
//               onClick={() => setModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4">
//               {isEdit ? 'Edit User' : 'Create User'}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {[
//                 { label: 'Full Name', name: 'fullName' },
//                 { label: 'Email', name: 'email', type: 'email' },
//                 {
//                   label: `Password${isEdit ? ' (leave blank)' : ''}`,
//                   name: 'password',
//                   type: 'password',
//                 },
//                 { label: 'District', name: 'district' },
//                 { label: 'Phone Number', name: 'phoneNumber' },
//               ].map(({ label, name, type }) => (
//                 <div key={name}>
//                   <label className="block text-sm font-medium">{label}</label>
//                   <input
//                     name={name}
//                     type={type || 'text'}
//                     value={form[name]}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                     required={name === 'password' ? !isEdit : true}
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label className="block text-sm font-medium">Role</label>
//                 <select
//                   name="role"
//                   value={form.role}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                 >
//                   <option>Admin</option>
//                   <option>Users</option>
//                 </select>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   name="isVerified"
//                   type="checkbox"
//                   checked={form.isVerified}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-green-600"
//                 />
//                 <label className="text-sm">Verified</label>
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setModalOpen(false)}
//                   className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   {isEdit ? 'Save' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation */}
//       {confirmOpen && (
//         <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 text-center">
//             <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
//             <p className="mb-6">
//               Delete <b>{deleteTarget.fullName}</b>?
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => setConfirmOpen(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={doDelete}
//                 className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





















//latest 
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  XMarkIcon,
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [roleFilter, setRoleFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  // ─── Sorting functionality ────────────────────────────────
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  // ─── Filtering functionality ──────────────────────────────
  useEffect(() => {
    let result = users;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.fullName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term) ||
          user.district?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== 'All') {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply verification filter
    if (verificationFilter !== 'All') {
      const verifiedStatus = verificationFilter === 'Verified';
      result = result.filter((user) => user.isVerified === verifiedStatus);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, verificationFilter]);

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

  // ─── Reset filters ────────────────────────────────────────
  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('All');
    setVerificationFilter('All');
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all registered users in the system
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Users">Users</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <label htmlFor="verification-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Verification
            </label>
            <select
              id="verification-filter"
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <XMarkIcon className="h-4 w-4 mr-1" /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['fullName', 'email', 'role', 'isVerified'].map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort(key)}
                  >
                    <div className="flex items-center">
                      {key === 'fullName' && 'Name'}
                      {key === 'email' && 'Email'}
                      {key === 'role' && 'Role'}
                      {key === 'isVerified' && 'Verified'}
                      <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {searchTerm || roleFilter !== 'All' || verificationFilter !== 'All'
                        ? 'No users match your filters'
                        : 'No users found'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || roleFilter !== 'All' || verificationFilter !== 'All'
                        ? 'Try adjusting your search or filter criteria'
                        : 'Get started by creating a new user'}
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Add User
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-medium">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.district || 'No district'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phoneNumber || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => setModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {isEdit ? 'Edit User' : 'Create New User'}
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {[
                        { label: 'Full Name', name: 'fullName', type: 'text', required: true },
                        { label: 'Email', name: 'email', type: 'email', required: true },
                        {
                          label: `Password${isEdit ? ' (leave blank to keep unchanged)' : ''}`,
                          name: 'password',
                          type: 'password',
                          required: !isEdit,
                        },
                        { label: 'District', name: 'district', type: 'text', required: false },
                        { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: false },
                      ].map((field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="mt-1">
                            <input
                              type={field.type}
                              name={field.name}
                              id={field.name}
                              value={form[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      ))}

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role<span className="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Users">Users</option>
                        </select>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="isVerified"
                            name="isVerified"
                            type="checkbox"
                            checked={form.isVerified}
                            onChange={handleChange}
                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="isVerified" className="font-medium text-gray-700">
                            Account Verified
                          </label>
                          <p className="text-gray-500">Check to verify this user's account</p>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                        >
                          {isEdit ? 'Update User' : 'Create User'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete user account
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the account for{' '}
                      <span className="font-medium">{deleteTarget.fullName}</span>? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={doDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
