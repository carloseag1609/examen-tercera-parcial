import express from "express";
import authRoutes from "./routes/auth";
import productsRoutes from "./routes/products";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
