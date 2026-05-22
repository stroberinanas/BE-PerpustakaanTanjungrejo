import express from "express";
import { pinjamBuku } from "../controllers/peminjamanController.js";

const router = express.Router();
router.post("/", pinjamBuku);

export default router;
