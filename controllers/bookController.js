import db from "../db.js";

export const getAllBooks = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM books ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Gagal mengambil data buku." });
    }

};

export const addBook = async (req, res) => {
    try {
        const {
            judul,
            penulis,
            penerbit,
            tahun_terbit,
            jumlah_halaman,
            kategori,
            stok,
            link_gambar,
        } = req.body;

        const result = await db.query(
            `INSERT INTO books (
        judul, penulis, penerbit, tahun_terbit, jumlah_halaman, kategori, stok, link_gambar)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING * `,
            [
                judul,
                penulis,
                penerbit,
                tahun_terbit,
                jumlah_halaman,
                kategori,
                stok,
                link_gambar,

            ]
        );

        res.json({ message: "Buku berhasil ditambahkan.", buku: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Gagal menambah buku." });
    }
};


export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            "SELECT * FROM books WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Buku tidak ditemukan." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Gagal mengambil data buku." });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            judul,
            penulis,
            penerbit,
            tahun_terbit,
            jumlah_halaman,
            kategori,
            stok,
            link_gambar,
        } = req.body;

        const result = await db.query(
            `UPDATE books SET 
        judul = $1, penulis = $2, penerbit = $3, tahun_terbit = $4, jumlah_halaman = $5, kategori = $6, stok = $7, link_gambar = $8
        WHERE id = $9
        RETURNING *`,
            [
                judul,
                penulis,
                penerbit,
                tahun_terbit,
                jumlah_halaman,
                kategori,
                stok,
                link_gambar,
                id,
            ])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Buku tidak ditemukan." });
        }

        res.json({ message: "Buku berhasil diperbarui.", buku: result.rows[0] });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ error: "Gagal memperbarui buku." });
    }
}


export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Hapus peminjaman dulu
        await db.query(
            "DELETE FROM data_peminjaman WHERE id_buku = $1",
            [id]
        );

        const result = await db.query(
            "DELETE FROM books WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Buku tidak ditemukan." });
        }

        res.json({ message: "Buku berhasil dihapus." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Gagal menghapus data peminjaman buku." });
    }
}