import axios from "axios";

export const BASE =
  process.env.REACT_APP_API_URL ?? "http://localhost:5000/api";

/* -------------------------------------------------
 * Single axios instance for the whole admin portal
 * ------------------------------------------------- */
export const api = axios.create({ baseURL: BASE });

/*  Attach JWT from localStorage on every call       */
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

/*  Login helper (unchanged)                         */
export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");

  const body = await res.json();          // { token, user }
  return { token: body.token, user: body.user };
}
