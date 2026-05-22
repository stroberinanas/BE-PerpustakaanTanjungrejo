import express from "express";
import {
    getHistory,
    kembalikanBuku,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getHistory);
router.put("/:id", kembalikanBuku);

export default router;
