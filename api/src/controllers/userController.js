const connect = require("../db/connect");

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, senha, nome_completo } = req.body;

    if (!cpf || !email || !senha || !nome_completo) {
      //Verifica se todos os campos estão preenchidos
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      //Verifica se tem só números e se tem 11 dígitos
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      //Verifica se o email tem o @
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else if (!email.includes("@portaledusenaisp.org.br")) {
      //Verifica se o email possui o portaledusenai.org.br
      return res.status(400).json({ error: "Email inválido, não docente" });
    } else {
      // Construção da query INSERT-cadastro
      const query = `INSERT INTO usuario (cpf, senha, email, nome_completo) VALUES(
    '${cpf}',
    '${senha}',
    '${email}',
    '${nome_completo}')`;
      // Executando a query criada
      try { //respostas
        connect.query(query, function (err) {
          if (err) {
            console.log(err); //imprime o erro
            console.log(err.code); //imprime o erro do código
            if (err.code === "ER_DUP_ENTRY") { //erro de duplicidade
              return res
                .status(400)
                .json({ error: "O Email ja está vinculado a outro usuário" });
            } else {
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário cadastrado com sucesso" });
          }
        });
      } catch (error) { //trata e captura o erro
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  static async loginUser(req, res) {
    const { senha, email } = req.body;

    //verifica se os campos estão preenchidos
    if (!senha || !email) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else { //seleciona a tabela de usuário (email)
      const query = `SELECT * FROM usuario WHERE email = '${email}'`;
      try {
        connect.query(query, function (err, results) { //imprime o erro
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro interno no Servidor" });
          }

          if (results.length === 0) { //determina se não retornou nenhum resultado
            return res.status(404).json({ error: "Usuário não entrado" });
          }

          //consta que já existe algum usuário
          const usuario = results[0];

          if (usuario.senha === senha) { //verifica se a senha está correta
            return res.status(200).json({ message: "Login bem sucedido" });
          } else {
            return res.status(401).json({ error: "Senha incorreta" });
          }
        });
      } catch (error) { //captura e trata os erros
        console.error("Erro ao executar consulta:", error);
        return res.status(500).json({ error: "Erro interno do Servidor" });
      }
    }
  }
  //Vai listar todos os usuários cadastrados
  static async getAllUsers(req, res) {
    //seleciona todos os usuários da tabela usuario
    const query = `SELECT * FROM usuario`;
    try {
      connect.query(query, function (err, results) {
        if (err) { //imprime o erro
          console.error(err);
          return req.status(500).json({ error: "Erro interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Usuários", users: results });
      });
    } catch (error) { //captura e trata os erros
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  }

  //Vai atualizar os dados
  static async updateUser(req, res) {
    // Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, cpf, email, senha, nome_completo } = req.body;

    // Validar se todos os campos foram preenchidos
    if (!id || !cpf || !email || !senha || !nome_completo) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET cpf=?, email=?, senha=?, nome=? WHERE id_usuario = ?`;
    const values = [cpf, email, senha, nome_completo, id];

    try { //respostas
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") { //erro duplicado
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuário" });
          } else {
            console.error(err);
            res.status(500).json({ error: "Erro interno do Servidor" });
          }
        }
        if (results.affectedRows === 0) { //resposta do banco de dados
          return res.status(404).json({ message: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  }

  //Vai deletar os usuários
  static async deleteUser(req, res) {
    // Obtem o parametro 'id' da requisição, que é o cpf do user a ser deletado
    const userId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario=?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno no servidor" });
        }
        if (results.affectedRows === 0) { //resposta do banco de dados
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário excluido com sucesso" });
      });
    } catch (error) { //captura e trata os erros
      console.error(err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
