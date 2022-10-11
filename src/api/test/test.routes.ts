import { Router } from "express";
import { seedDb } from "../../db";

const router = Router();

router.post("/seed", async (req, res) => {
  await seedDb();
  res.status(200).json({ message: "works" });
});

export default router;
