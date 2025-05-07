import dotenv from "dotenv";
dotenv.config();

import api from './../api/api';
import { dbLojaSequelize } from './../db/database';

const PORT = process.env.PORT || 3000;

async function startServer() {

  try {

    await dbLojaSequelize.authenticate();
    console.log('Banco de dados conectado com sucesso!');

    api.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
    process.exit(1);
  }
}

startServer();