import dotenv from "dotenv";

import { createApi } from "./../api/api";
import { dbLojaSequelize } from "./../db/database";

const PORT = process.env.PORT || 3000;

dotenv.config();

async function startServer() {

  try {

    await dbLojaSequelize.authenticate();
    console.log('Banco de dados conectado com sucesso!');

    const app = createApi();
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
    process.exit(1);
  }
}

startServer();