import express from "express";
import db from "./db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();

import adminRoute from "./routes/adminRoute.js";
import bookRoute from "./routes/bookRoute.js";
import historyRoute from "./routes/historyRoute.js";
import publicBookRoute from "./routes/publicBookRoute.js";
import pinjamanRoute from "./routes/peminjamanRoute.js";
import { verifyAdminSession } from "./middlewares/authAdmin.js";

dotenv.config();
app.use(express.json());


app.use(cors());

// app.use(express.static(path.join(__dirname, "../fe-perpustanjungrejo")));
// app.get("/", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/home.html")
//     );
// });
// app.get("/login", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/login.html")
//     );
// });
// app.get("/dashboard", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/dashboard.html")
//     );
// });
// app.get("/tambah", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/tambah.html")
//     );
// });
// app.get("/history", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/history.html")
//     );
// });
// app.get("/edit", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/edit.html")
//     );
// });
// app.get("/pinjam", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../fe-perpustanjungrejo/pages/pinjam.html")
//     );
// });

app.get("/", (req, res) => {
    res.json({ message: "API Vercel aktif 🚀" });
});

// --- Routes ---
app.use("/admin", adminRoute);
app.use("/books", publicBookRoute);

// --- Protected (JWT) ---

app.use("/admin/history", verifyAdminSession, historyRoute);
app.use("/admin/pinjam", verifyAdminSession, pinjamanRoute);
app.use("/admin/books", verifyAdminSession, bookRoute);

export default function handler(req, res) {
    app(req, res);
}
