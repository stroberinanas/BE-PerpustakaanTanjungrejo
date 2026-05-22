import db from "../db.js";

export const pinjamBuku = async (req, res) => {
    try {
        const {
            id_buku,
            nama_peminjam,
            alamat_peminjam,
            tanggal_peminjaman
        } = req.body || {};
        const idBuku = parseInt(id_buku);
        console.log("ID Buku:", idBuku);


        // Cek stok buku
        const bukuResult = await db.query(
            "SELECT stok FROM books WHERE id = $1",
            [idBuku]
        );

        if (bukuResult.rows.length === 0) {
            return res.status(404).json({
                error: "Buku tidak ditemukan"
            });
        }

        const stok = bukuResult.rows[0].stok;

        if (stok <= 0) {
            return res.status(400).json({
                error: "Stok buku habis"
            });
        }

        // Simpan data peminjaman
        const peminjamanResult = await db.query(
            `INSERT INTO data_peminjaman
            (
                id_buku,
                nama_peminjam,
                alamat_peminjam,
                tanggal_peminjaman,
                status
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                idBuku,
                nama_peminjam,
                alamat_peminjam,
                tanggal_peminjaman,
                "Dipinjam"
            ]
        );

        // Kurangi stok
        await db.query(
            "UPDATE books SET stok = stok - 1 WHERE id = $1",
            [idBuku]
        );

        res.json({
            message: "Peminjaman berhasil dicatat",
            peminjaman: peminjamanResult.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Terjadi kesalahan server"
        });
    }
};