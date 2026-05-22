import db from "../db.js";

export const getHistory = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT dp.*, db.judul, db.link_gambar
        FROM data_peminjaman dp
        JOIN books db ON dp.id_buku = db.id
        ORDER BY dp.id DESC`
        );

        res.json(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Riwayat peminjaman tidak ditemukan." });
        }
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Gagal mengambil riwayat peminjaman." });
    }
};

export const kembalikanBuku = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ambil id_buku
        const idBukuResult = await db.query(
            "SELECT id_buku FROM data_peminjaman WHERE id = $1",
            [id]
        );
        if (idBukuResult.rows.length === 0) {
            return res.status(404).json({ error: "Data peminjaman tidak ditemukan." });
        }

        const id_buku = idBukuResult.rows[0].id_buku;

        // update peminjaman
        await db.query(
            "UPDATE data_peminjaman SET status = 'Dikembalikan', tanggal_pengembalian = NOW() WHERE id = $1",
            [id]
        );

        // tambahkan stok buku
        const updateStok = await db.query(
            "UPDATE books SET stok = stok + 1 WHERE id = $1",
            [id_buku]
        );
        if (updateStok.rowCount === 0) {
            console.warn(`Buku dengan id ${id_buku} tidak ditemukan saat mengembalikan.`);
        }

        return res.json({ message: "Buku berhasil dikembalikan." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Gagal mengembalikan buku." });
    }
};

