// import React, { useState, useEffect } from "react";
// import axios from "axios";
// //import { useTheme } from "../../contexts/ThemeContext";

// const SettingsPage = () => {
//   const { theme } = useTheme();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [profile, setProfile] = useState({ fullName: "", email: "" });
//   const [system, setSystem] = useState({ systemName: "" });
//   const [security, setSecurity] = useState({ 
//     currentPassword: "", 
//     newPassword: "", 
//     confirmPassword: "" 
//   });
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Set base URL for API calls
//   axios.defaults.baseURL = 'http://localhost:5000'; // Update with your backend port

//   // Fetch initial settings
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("/api/setting");
//         const { profile, system } = response.data;
//         setProfile(profile);
//         setSystem(system);
//       } catch (error) {
//         setErrors({ 
//           fetchError: error.response?.data?.message || 
//           "Failed to load settings. Please check your connection." 
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   // Handle Profile Update
//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setErrors({});
//       const res = await axios.put("/api/setting/profile", profile);
//       setSuccess("Profile updated successfully!");
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setErrors({ 
//         message: err.response?.data?.message || 
//         "Failed to update profile. Please try again." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle System Update
//   const handleSystemSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setErrors({});
//       const res = await axios.put("/api/setting/system", system);
//       setSuccess("System settings saved!");
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setErrors({ 
//         message: err.response?.data?.message || 
//         "Failed to save system settings. Please try again." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Password Change
//   const handleSecuritySubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setErrors({});
      
//       if (security.newPassword !== security.confirmPassword) {
//         throw { response: { data: { message: "Passwords do not match!" } } };
//       }

//       const res = await axios.put("/api/setting/security", {
//         currentPassword: security.currentPassword,
//         newPassword: security.newPassword
//       });
      
//       setSuccess("Password changed successfully!");
//       setTimeout(() => setSuccess(""), 3000);
//       setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       setErrors({ 
//         message: err.response?.data?.message || 
//         "Failed to change password. Please try again." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`flex flex-col md:flex-row min-h-screen p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
//       {/* Sidebar */}
//       <div className="md:w-64 mb-4 md:mb-0 md:mr-4">
//         <div className={`p-4 rounded-lg shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
//           <h2 className="text-xl font-bold mb-4">Settings</h2>
//           <div className="space-y-2">
//             <button
//               onClick={() => setActiveTab("profile")}
//               className={`w-full text-left p-2 rounded transition-colors ${
//                 activeTab === "profile" 
//                   ? "bg-blue-600 text-white" 
//                   : theme === "dark" 
//                     ? "hover:bg-gray-700" 
//                     : "hover:bg-gray-100"
//               }`}
//             >
//               Profile
//             </button>
//             <button
//               onClick={() => setActiveTab("system")}
//               className={`w-full text-left p-2 rounded transition-colors ${
//                 activeTab === "system" 
//                   ? "bg-blue-600 text-white" 
//                   : theme === "dark" 
//                     ? "hover:bg-gray-700" 
//                     : "hover:bg-gray-100"
//               }`}
//             >
//               System
//             </button>
//             <button
//               onClick={() => setActiveTab("security")}
//               className={`w-full text-left p-2 rounded transition-colors ${
//                 activeTab === "security" 
//                   ? "bg-blue-600 text-white" 
//                   : theme === "dark" 
//                     ? "hover:bg-gray-700" 
//                     : "hover:bg-gray-100"
//               }`}
//             >
//               Security
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         {errors.fetchError && (
//           <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
//             {errors.fetchError}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
//             {success}
//           </div>
//         )}

//         {loading && (
//           <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
//             Processing...
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeTab === "profile" && (
//           <form 
//             onSubmit={handleProfileSubmit} 
//             className={`p-6 rounded-lg shadow mb-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
//           >
//             <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
//             <div className="mb-4">
//               <label className="block mb-2">Full Name</label>
//               <input
//                 type="text"
//                 value={profile.fullName}
//                 onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 onChange={(e) => setProfile({ ...profile, email: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <button 
//               type="submit" 
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Updating..." : "Update Profile"}
//             </button>
//             {errors.message && <p className="mt-2 text-red-500">{errors.message}</p>}
//           </form>
//         )}

//         {/* System Tab */}
//         {activeTab === "system" && (
//           <form 
//             onSubmit={handleSystemSubmit} 
//             className={`p-6 rounded-lg shadow mb-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
//           >
//             <h2 className="text-2xl font-bold mb-4">System Settings</h2>
//             <div className="mb-4">
//               <label className="block mb-2">System Name</label>
//               <input
//                 type="text"
//                 value={system.systemName}
//                 onChange={(e) => setSystem({ ...system, systemName: e.target.value })}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <button 
//               type="submit" 
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//             {errors.message && <p className="mt-2 text-red-500">{errors.message}</p>}
//           </form>
//         )}

//         {/* Security Tab */}
//         {activeTab === "security" && (
//           <form 
//             onSubmit={handleSecuritySubmit} 
//             className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
//           >
//             <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
//             <div className="mb-4">
//               <label className="block mb-2">Current Password</label>
//               <input
//                 type="password"
//                 value={security.currentPassword}
//                 onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2">New Password</label>
//               <input
//                 type="password"
//                 value={security.newPassword}
//                 onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//                 minLength="8"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2">Confirm Password</label>
//               <input
//                 type="password"
//                 value={security.confirmPassword}
//                 onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               {errors.confirmPassword && <p className="mt-1 text-red-500">{errors.confirmPassword}</p>}
//             </div>
//             <button 
//               type="submit" 
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Changing..." : "Change Password"}
//             </button>
//             {errors.message && <p className="mt-2 text-red-500">{errors.message}</p>}
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;












//last
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext"; // Adjust if your path differs

// const SettingsPage = () => {
//   const { user } = useAuth();

//   const [activeTab, setActiveTab] = useState("profile");
//   const [profile, setProfile] = useState({ fullName: "", email: "" });
//   const [system, setSystem] = useState({ systemName: "" });
//   const [security, setSecurity] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Clear errors when tab changes
//   useEffect(() => {
//     setErrors({});
//     setSuccess("");
//   }, [activeTab]);

//   // Fetch initial settings
//   useEffect(() => {
//     if (!user) return;

//     const fetchSettings = async () => {
//       setLoading(true);
//       setErrors({});
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           (process.env.REACT_APP_API_URL || "http://localhost:5000/api") + "/settings",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );

//         if (response.data) {
//           setProfile({
//             fullName: response.data.profile?.fullName || user?.name || "",
//             email: response.data.profile?.email || user?.email || "",
//           });
//           setSystem({
//             systemName: response.data.system?.systemName || "",
//           });
//         }
//       } catch (error) {
//         console.error("Fetch settings error:", error);
//         setErrors({
//           fetchError:
//             error.response?.data?.message ||
//             "Failed to load settings. Please check your connection.",
//         });
//       } finally {
//         setLoading(false);
//         setInitialLoad(false);
//       }
//     };

//     fetchSettings();
//   }, [user]);

//   // Helper: create axios instance with fresh token header
//   const getApiInstance = () =>
//     axios.create({
//       baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
//       withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//       },
//     });

//   // Profile Update Handler
//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});
//     setSuccess("");
//     try {
//       const api = getApiInstance();
//       await api.put("/settings/profile", profile);
//       setSuccess("Profile updated successfully!");
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Profile update error:", err);
//       setErrors({
//         message:
//           err.response?.data?.message ||
//           "Failed to update profile. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // System Update Handler
//   const handleSystemSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});
//     setSuccess("");
//     try {
//       const api = getApiInstance();
//       await api.put("/settings/system", system);
//       setSuccess("System settings saved!");
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("System update error:", err);
//       setErrors({
//         message:
//           err.response?.data?.message ||
//           "Failed to save system settings. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Security (Password) Update Handler
//   const handleSecuritySubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});
//     setSuccess("");
//     try {
//       if (security.newPassword !== security.confirmPassword) {
//         setErrors({ message: "Passwords do not match!" });
//         setLoading(false);
//         return;
//       }
//       const api = getApiInstance();
//       await api.put("/settings/security", {
//         currentPassword: security.currentPassword,
//         newPassword: security.newPassword,
//       });
//       setSuccess("Password changed successfully!");
//       setTimeout(() => setSuccess(""), 3000);
//       setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       console.error("Security update error:", err);
//       setErrors({
//         message:
//           err.response?.data?.message ||
//           "Failed to change password. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen p-4 bg-gray-50">
//       {/* Sidebar */}
//       <div className="md:w-64 mb-4 md:mb-0 md:mr-4">
//         <div className="p-4 rounded-lg shadow bg-white">
//           <h2 className="text-xl font-bold mb-4">Settings</h2>
//           <div className="space-y-2">
//             <button
//               onClick={() => setActiveTab("profile")}
//               className={`w-full text-left p-2 rounded transition-colors ${
//                 activeTab === "profile"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               Profile
//             </button>
//             <button
//               onClick={() => setActiveTab("system")}
//               className={`w-full text-left p-2 rounded transition-colors ${
//                 activeTab === "system"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               System
//             </button>
//             <button
//               onClick={() => setActiveTab("security")}
//               className={`w-full text-left p-2 rounded transition-colors ${
//                 activeTab === "security"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               Security
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         {!initialLoad && errors.fetchError && (
//           <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
//             {errors.fetchError}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
//             {success}
//           </div>
//         )}

//         {loading && (
//           <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
//             Processing...
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeTab === "profile" && (
//           <form
//             onSubmit={handleProfileSubmit}
//             className="p-6 rounded-lg shadow mb-4 bg-white"
//           >
//             <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
//             <div className="mb-4">
//               <label className="block mb-2 font-medium">Full Name</label>
//               <input
//                 type="text"
//                 value={profile.fullName}
//                 onChange={(e) =>
//                   setProfile({ ...profile, fullName: e.target.value })
//                 }
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-medium">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 onChange={(e) =>
//                   setProfile({ ...profile, email: e.target.value })
//                 }
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Updating..." : "Update Profile"}
//             </button>
//             {errors.message && (
//               <p className="mt-2 text-red-500">{errors.message}</p>
//             )}
//           </form>
//         )}

//         {/* System Tab */}
//         {activeTab === "system" && (
//           <form
//             onSubmit={handleSystemSubmit}
//             className="p-6 rounded-lg shadow mb-4 bg-white"
//           >
//             <h2 className="text-2xl font-bold mb-4">System Settings</h2>
//             <div className="mb-4">
//               <label className="block mb-2 font-medium">System Name</label>
//               <input
//                 type="text"
//                 value={system.systemName}
//                 onChange={(e) =>
//                   setSystem({ ...system, systemName: e.target.value })
//                 }
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//             {errors.message && (
//               <p className="mt-2 text-red-500">{errors.message}</p>
//             )}
//           </form>
//         )}

//         {/* Security Tab */}
//         {activeTab === "security" && (
//           <form
//             onSubmit={handleSecuritySubmit}
//             className="p-6 rounded-lg shadow bg-white"
//           >
//             <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
//             <div className="mb-4">
//               <label className="block mb-2 font-medium">Current Password</label>
//               <input
//                 type="password"
//                 value={security.currentPassword}
//                 onChange={(e) =>
//                   setSecurity({ ...security, currentPassword: e.target.value })
//                 }
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-medium">New Password</label>
//               <input
//                 type="password"
//                 value={security.newPassword}
//                 onChange={(e) =>
//                   setSecurity({ ...security, newPassword: e.target.value })
//                 }
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 minLength={8}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-medium">Confirm Password</label>
//               <input
//                 type="password"
//                 value={security.confirmPassword}
//                 onChange={(e) =>
//                   setSecurity({ ...security, confirmPassword: e.target.value })
//                 }
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 minLength={8}
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Changing..." : "Change Password"}
//             </button>
//             {errors.message && (
//               <p className="mt-2 text-red-500">{errors.message}</p>
//             )}
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;











//trying
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiUser,
  FiSettings,
  FiLock,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";

const SettingsPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile
  const [profile, setProfile] = useState({ fullName: "", email: "", password: "" });

  // System
  const [system, setSystem] = useState({ systemName: "" });

  // Admins
  const [admins, setAdmins] = useState([]);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ fullName: "", email: "", password: "" });

  // Edit admin (inline row editor)
  const [editingId, setEditingId] = useState(null);
  const [editAdmin, setEditAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    isActive: true,
  });

  // UX
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const getApi = () => {
    const token = localStorage.getItem("token");
    return axios.create({
      baseURL: apiBase,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  const pickServerMessage = (err) => {
    const d = err?.response?.data;
    return (
      d?.message ||
      d?.error ||
      (Array.isArray(d?.errors) && d.errors[0]?.msg) ||
      "Request failed"
    );
  };

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  // ----- FETCHERS -----
  const fetchAdmins = async () => {
    try {
      const api = getApi();
      const { data } = await api.get("/settings/admins");
      setAdmins(Array.isArray(data?.admins) ? data.admins : []);
    } catch (err) {
      console.error("Fetch admins error:", err?.response?.data || err);
      setErrors((e) => ({
        ...e,
        message: pickServerMessage(err) || "Failed to fetch admin users.",
      }));
    }
  };

  const fetchSettings = async () => {
    if (!user) return;
    setLoading(true);
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/settings`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setProfile({
        fullName: data.profile?.fullName || user?.name || user?.fullName || "",
        email: data.profile?.email || user?.email || "",
        password: "",
      });
      setSystem({ systemName: data.system?.systemName || "" });
      setAdmins(Array.isArray(data.admins) ? data.admins : []); // initial load
    } catch (error) {
      console.error("Fetch settings error:", error?.response?.data || error);
      setErrors({
        fetchError:
          error.response?.data?.message ||
          "Failed to load settings. Please check your connection.",
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSettings();
    // eslint note: user is sufficient; other deps are stable creators
  }, [user]); // no eslint-disable comment

  // Refresh banners on tab change
  useEffect(() => {
    setErrors({});
    setSuccess("");
  }, [activeTab]);

  // Auto-fetch admins whenever the Admins tab becomes active
  useEffect(() => {
    if (activeTab === "admins") fetchAdmins();
  }, [activeTab]);

  // ===== Profile =====
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const api = getApi();
      await api.put("/settings/profile", {
        fullName: profile.fullName,
        email: profile.email,
        password: profile.password || undefined,
      });
      setProfile((p) => ({ ...p, password: "" }));
      flash("Profile updated successfully!");
      // If profile update could affect admins list (e.g., you promoted someone elsewhere),
      // you can optionally refresh admins when on that tab:
      if (activeTab === "admins") fetchAdmins();
    } catch (err) {
      console.error("Profile update error:", err?.response?.data || err);
      setErrors({ message: pickServerMessage(err) || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  // ===== System =====
  const handleSystemSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const api = getApi();
      await api.put("/settings/system", system);
      flash("System settings saved!");
    } catch (err) {
      console.error("System update error:", err?.response?.data || err);
      setErrors({ message: pickServerMessage(err) || "Failed to save system settings." });
    } finally {
      setLoading(false);
    }
  };

  // ===== Admins: Add =====
  const handleAddAdmin = async () => {
    setErrors({});
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.password) {
      setErrors({ message: "All fields are required" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(newAdmin.email)) {
      setErrors({ message: "Please enter a valid email address" });
      return;
    }
    if (newAdmin.password.length < 8) {
      setErrors({ message: "Password must be at least 8 characters" });
      return;
    }

    setLoading(true);
    try {
      const api = getApi();
      await api.post("/settings/admins", newAdmin);
      setNewAdmin({ fullName: "", email: "", password: "" });
      setIsAddingAdmin(false);
      flash("Admin added successfully!");
      await fetchAdmins(); // ensure table shows the new admin
    } catch (err) {
      console.error("Add admin error:", err?.response?.data || err);
      setErrors({ message: pickServerMessage(err) || "Failed to add admin." });
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const isSelf = (admin) => {
    const myId = user?._id || user?.id;
    return myId && (admin._id === myId || admin.id === myId);
  };

  // ===== Admins: Edit =====
  const startEdit = (admin) => {
    setEditingId(admin._id);
    setEditAdmin({
      fullName: admin.fullName || admin.name || "",
      email: admin.email || "",
      password: "",
      isActive: admin.isActive ?? (admin.status ? admin.status === "active" : true),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAdmin({ fullName: "", email: "", password: "", isActive: true });
  };

  const handleSaveEdit = async (adminId) => {
    setErrors({});
    if (!editAdmin.fullName || !editAdmin.email) {
      setErrors({ message: "Name and email are required." });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(editAdmin.email)) {
      setErrors({ message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      const api = getApi();
      const payload = {
        fullName: editAdmin.fullName,
        name: editAdmin.fullName,
        email: editAdmin.email,
        isActive: editAdmin.isActive,
        status: editAdmin.isActive ? "active" : "inactive",
        ...(editAdmin.password ? { password: editAdmin.password } : {}),
      };
      await api.put(`/settings/admins/${adminId}`, payload);
      cancelEdit();
      flash("Admin updated successfully!");
      await fetchAdmins(); // reload to reflect backend truth
    } catch (err) {
      console.error("Edit admin error:", err?.response?.data || err);
      setErrors({ message: pickServerMessage(err) || "Failed to update admin." });
    } finally {
      setLoading(false);
    }
  };

  // ===== Admins: Toggle Active =====
  const handleToggleActive = async (admin) => {
    if (isSelf(admin)) return;
    setLoading(true);
    setErrors({});
    try {
      const api = getApi();
      const next =
        !(admin.isActive ?? (admin.status ? admin.status === "active" : true));
      const payload = { isActive: next, status: next ? "active" : "inactive" };
      await api.put(`/settings/admins/${admin._id}`, payload);
      flash(`Admin ${next ? "activated" : "deactivated"} successfully!`);
      await fetchAdmins(); // refresh list
    } catch (err) {
      console.error("Toggle active error:", err?.response?.data || err);
      setErrors({ message: pickServerMessage(err) || "Failed to toggle status." });
    } finally {
      setLoading(false);
    }
  };

  // ===== Admins: Delete =====
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setLoading(true);
    setErrors({});
    try {
      const api = getApi();
      await api.delete(`/settings/admins/${adminId}`);
      flash("Admin deleted successfully!");
      await fetchAdmins(); // refresh list
    } catch (err) {
      console.error("Delete admin error:", err?.response?.data || err);
      setErrors({ message: pickServerMessage(err) || "Failed to delete admin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Settings</h2>
        <div className="space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiUser className="mr-3" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "system"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiSettings className="mr-3" />
              System
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "admins"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiLock className="mr-3" />
              Admin Management
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {!initialLoad && errors.fetchError && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">{errors.fetchError}</div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">{success}</div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-3"></div>
            Processing...
          </div>
        )}

        {errors.message && <p className="mb-4 text-red-600">{errors.message}</p>}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <FiUser className="mr-2" /> Profile Settings
            </h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave blank to keep current password"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  disabled={loading}
                >
                  <FiSave className="mr-2" /> {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <FiSettings className="mr-2" /> System Settings
            </h2>
            <form onSubmit={handleSystemSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                <input
                  type="text"
                  value={system.systemName}
                  onChange={(e) => setSystem({ systemName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  disabled={loading}
                >
                  <FiSave className="mr-2" /> {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === "admins" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FiLock className="mr-2" /> Admin Management
              </h2>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Admin Users</h3>
                <button
                  onClick={() => {
                    setErrors({});
                    setIsAddingAdmin(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiPlus className="mr-2" /> Add Admin
                </button>
              </div>

              {isAddingAdmin && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={newAdmin.fullName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsAddingAdmin(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                    <button
                      onClick={handleAddAdmin}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                      disabled={loading}
                    >
                      <FiSave className="mr-2" /> {loading ? "Adding..." : "Add Admin"}
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => {
                      const inEdit = editingId === admin._id;
                      const currentActive =
                        admin.isActive ?? (admin.status ? admin.status === "active" : true);

                      return (
                        <tr key={admin._id}>
                          {/* Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!inEdit ? (
                              <div className="text-sm font-medium text-gray-900">
                                {admin.fullName || admin.name}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={editAdmin.fullName}
                                onChange={(e) =>
                                  setEditAdmin((s) => ({ ...s, fullName: e.target.value }))
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              />
                            )}
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!inEdit ? (
                              <div className="text-sm text-gray-500">{admin.email}</div>
                            ) : (
                              <input
                                type="email"
                                value={editAdmin.email}
                                onChange={(e) =>
                                  setEditAdmin((s) => ({ ...s, email: e.target.value }))
                                }
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              />
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!inEdit ? (
                              <button
                                onClick={() => handleToggleActive(admin)}
                                className={`inline-flex items-center px-3 py-1 rounded-full border ${
                                  currentActive
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : "bg-red-100 text-red-800 border-red-300"
                                } disabled:opacity-50`}
                                title={isSelf(admin) ? "You cannot toggle yourself" : "Toggle Active"}
                                disabled={isSelf(admin)}
                              >
                                {currentActive ? (
                                  <>
                                    <FiToggleRight className="mr-2" /> Active
                                  </>
                                ) : (
                                  <>
                                    <FiToggleLeft className="mr-2" /> Inactive
                                  </>
                                )}
                              </button>
                            ) : (
                              <label className="inline-flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editAdmin.isActive}
                                  onChange={(e) =>
                                    setEditAdmin((s) => ({ ...s, isActive: e.target.checked }))
                                  }
                                />
                                <span className="text-sm">
                                  {editAdmin.isActive ? "Active" : "Inactive"}
                                </span>
                              </label>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {!inEdit ? (
                              <>
                                <button
                                  onClick={() => startEdit(admin)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  <FiEdit className="inline" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(admin._id)}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  disabled={isSelf(admin)}
                                  title={isSelf(admin) ? "You cannot delete yourself" : "Delete"}
                                >
                                  <FiTrash2 className="inline" />
                                </button>
                              </>
                            ) : (
                              <div className="flex flex-col items-end space-y-2">
                                <div className="w-full md:w-80">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    New Password (optional)
                                  </label>
                                  <input
                                    type="password"
                                    value={editAdmin.password}
                                    onChange={(e) =>
                                      setEditAdmin((s) => ({ ...s, password: e.target.value }))
                                    }
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Leave blank to keep current password"
                                    minLength={8}
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={cancelEdit}
                                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center"
                                  >
                                    <FiX className="mr-1" /> Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveEdit(admin._id)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                                    disabled={loading}
                                  >
                                    <FiSave className="mr-1" /> {loading ? "Saving..." : "Save"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
