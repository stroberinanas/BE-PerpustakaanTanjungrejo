import db from "../db.js";
import generateToken from "../utils/generateToken.js";

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username dan password wajib diisi" });
        }
        const result = await db.query(
            "SELECT * FROM admin WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Username atau password salah" });
        }

        const admin = result.rows[0];
        const token = generateToken(admin.id);

        return res.json({
            message: "Login berhasil",
            admin: { id: admin.id, username: admin.username },
            token: token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
};

export const logoutAdmin = (req, res) => {
    res.json({ message: "Logout berhasil" });
}

