// Várivel express importando modulo express
const express = require("express");
const cors = require("cors");
const testConnect = require('./db/testConnect');

//Define uma classe para organizar a lógica da aplicação
class AppController {
  constructor() {
    this.express = express(); //Cria uma nova instância do Express dentro da classe
    this.middlewares(); //Chama o método middlewares para configurar os middlewares
    this.routes(); //Chama o método routes para definir as rotas da API
    testConnect();
  }
  middlewares() {
    //Permite que a aplicação receba dados no formato JSON nas requisições
    this.express.use(express.json());
    this.express.use(cors());
  }
  routes() {
    // Define as rotas da API
    //URL base:
    const api_routes = require("./routes/api_routes");
    this.express.use("/agen/sala-de-aula/v1", api_routes); 
    
  }
}
//Exporta a instância do Express configurada, tornando-a acessível em outros arquivos
module.exports = new AppController().express;
