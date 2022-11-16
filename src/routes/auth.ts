import { Router } from "express";
import { prisma } from "../db/client";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, password, email, store } = req.body;
  await prisma.user.create({
    data: { name, password, email, store },
  });
  return res.status(201).send({ message: "Usuario creado" });
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { name },
  });
  if (!user) {
    return res.status(404).send({ message: "Usuario no encontrado" });
  }
  if (user.password === password) {
    return res.status(200).send({ message: "Bienvenido" });
  } else {
    return res.status(404).send({ message: "Usuario no encontrado" });
  }
});

export default router;
