import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Router } from "express";
import { prisma } from "../db/client";

const router = Router();

router.get("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({ message: "Usuario requerido" });
  }
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
  });
  return res.status(200).send(products);
});

router.get("/:id", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  if (!userId || !id) {
    return res.status(400).send({ message: "Usuario o ID requerido" });
  }
  const product = await prisma.product.findMany({
    where: {
      userId,
      id: id as string,
    },
  });
  return res.status(200).send(product);
});

router.post("/", async (req, res) => {
  const { name, description, sellPrice, buyPrice, stock, userId } = req.body;
  const product = await prisma.product.create({
    data: {
      name,
      description,
      sellPrice: Number(sellPrice),
      buyPrice: Number(buyPrice),
      stock: Number(stock),
      userId,
    },
  });
  return res.status(201).send(product);
});

router.put("/:id", async (req, res) => {
  const { name, description, sellPrice, buyPrice, stock, userId } = req.body;
  const { id } = req.params;
  console.log({ userId, id });
  if (!userId || !id) {
    return res.status(400).send({ message: "Usuario o ID requerido" });
  }
  if (!name || !description || !sellPrice || !buyPrice || !stock) {
    return res.status(400).send({ message: "Todos los campos son requeridos" });
  }
  const product = await prisma.product.update({
    where: {
      id_userId: {
        userId: userId as string,
        id: id as string,
      },
    },
    data: {
      name,
      description,
      sellPrice: Number(sellPrice),
      buyPrice: Number(buyPrice),
      stock: Number(stock),
      userId,
    },
  });
  return res.status(201).send(product);
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body.userId) {
      return res.status(400).send({ message: "Usuario requerido" });
    }
    await prisma.product.delete({
      where: {
        id_userId: {
          id: id as string,
          userId: req.body.userId as string,
        },
      },
    });
    return res.status(200).send({ message: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).send({ message: "Producto no encontrado" });
      }
    }
    return res.status(500).send({ message: "Error interno" });
  }
});

export default router;
