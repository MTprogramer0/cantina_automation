require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos do frontend da pasta public
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// O Node vai buscar a URL de forma segura no ambiente onde estiver rodando
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/merenda_db?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definição do Schema para a Merenda
const merendaSchema = new mongoose.Schema({
  turma: { type: String, required: true },
  quantidade: { type: Number, required: true },
  data: { type: String, required: true },
});

// Garante que não haja registros duplicados da mesma turma no mesmo dia
merendaSchema.index({ turma: 1, data: 1 }, { unique: true });
const Merenda = mongoose.model("Merenda", merendaSchema);

function getDataHoje() {
  return new Date().toISOString().split("T")[0];
}

// Rotas da API
app.get("/api/merenda", async (req, res) => {
  try {
    const hoje = getDataHoje();
    const registros = await Merenda.find({ data: hoje });

    const dados = {};
    registros.forEach((r) => {
      dados[r.turma] = r.quantidade;
    });
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/merenda", async (req, res) => {
  try {
    const { turma, quantidade } = req.body;
    const hoje = getDataHoje();

    if (!turma || quantidade === undefined || quantidade < 0) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // Atualiza se já existir para hoje, ou cria um novo se não existir
    await Merenda.findOneAndUpdate(
      { turma, data: hoje },
      { quantidade },
      { upsert: true, new: true },
    );

    res.json({ success: true, turma, quantidade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/merenda", async (req, res) => {
  try {
    const hoje = getDataHoje();
    await Merenda.deleteMany({ data: hoje });
    res.json({ success: true, message: "Dados do dia resetados com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`),
);
