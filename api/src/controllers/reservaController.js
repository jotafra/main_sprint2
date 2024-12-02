const connect_database = require("../db/connect");

module.exports = class agendamentoController {

// ------------------------ Criação de um agendamento

  static async createAgend(req, res) {
    const {fk_id_usuario, fk_id_sala, begin, end} = req.body;

    // Validação dos campos obrigatórios
    if (!fk_id_usuario || !fk_id_sala || !begin || !end) 
      { return res.status(400).json({ error: "Todos os campos devem ser preenchidos!" });
    }

    // Converte os horários de início e fim para objetos Date
    const inicio = new Date(begin);
    const fim = new Date(end);

    // Define os horários de limite (7h00 e 21h00)
    const limiteInicio = new Date(inicio);
    limiteInicio.setHours(7, 0, 0, 0); //limite do inicio
    const limiteFim = new Date(inicio);
    limiteFim.setHours(21, 0, 0, 0); //limite do fim

    // Verifica se o horário de início e fim estão dentro do intervalo permitido (7h - 21h)
    if (inicio < limiteInicio || inicio >= limiteFim) {
      return res.status(400).json({ error: "O horário de início deve ser entre 07:00 e 21:00!" });
    }

    if (fim <= inicio || fim > limiteFim) {
      return res.status(400).json({
        error:"O horário de término deve ser entre 07:00 e 21:00 e não pode ser antes do horário de início!",
      });
    }

    // Verifica se já existe agendamento para a sala no horário
    const checkQuery = `SELECT * FROM reserva WHERE fk_id_sala = ? 
      AND (
        (begin < ? AND end > ?) OR 
        (begin >= ? AND begin < ?) OR
        (end > ? AND end <= ?) 
      )`;

    const checkValues = [fk_id_sala, begin, end, begin, end, begin, end ];

    try {
      connect_database.query(checkQuery, checkValues, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao verificar disponibilidade da sala!" });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: "A sala já está reservada nesse horário!" });
        }
        if (begin > end) {
          return res.status(400).json({
            error: "O horário de inicio é maior que o horário de fim!",
          });
        }
        if (begin === end) {
          return res.status(400).json({ error: "Os horários estão iguais!" });
        }
        const limite_hora = 1000 * 60 * 60; //1 hora em milesegundos
        if (new Date(end) - new Date(begin) > limite_hora) {
          return res.status(400).json({
            error:"A sua reserva excede o tempo, se necessário faça uma segunda reserva!"
          });
        }

        // Inserir o novo agendamento
        const query = `INSERT INTO reserva (fk_id_usuario, fk_id_sala, begin, end) 
                       VALUES (?, ?, ?, ?)`;
        const values = [fk_id_usuario, fk_id_sala, begin, end];

        connect_database.query(query, values, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao criar reserva!" });
          }
          return res.status(201).json({ message: "Reserva realizada com sucesso!" });
        });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }

// ------------------------ Visualizar todos os agendamentos

  static async getAllAgend(req, res) {
    const query = `SELECT * FROM reserva`;

    try {
      connect_database.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar reserva" });
        }
        return res.status(200).json({
          message: "reserva realizada com sucesso!",
          reserva: results,
        });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }


// --------------------- Atualizar um agendamento

  static async updateAgend(req, res) {
    const {id_reserva, fk_id_usuario, fk_id_sala, begin, end} = req.body;

    // Validação dos campos obrigatórios
    if (!id_reserva || !fk_id_usuario || !fk_id_sala || !begin || !end ) 
      {return res.status(400).json({ error: "Todos os campos devem ser preenchidos!" });
    }

    // Converte os horários de início e fim para objetos Date
    const inicio = new Date(begin);
    const fim = new Date(end);

    // Define os horários de limite (7h00 e 21h00)
    const limiteInicio = new Date(inicio);
    limiteInicio.setHours(7, 0, 0, 0); //limite do inicio
    const limiteFim = new Date(inicio);
    limiteFim.setHours(21, 0, 0, 0); //limite do fim

    // Verifica se o horário de início e fim estão dentro do intervalo permitido (7h - 21h)
    if (inicio < limiteInicio || inicio >= limiteFim) {
      return res.status(400).json({ error: "O horário está fora do determinado" });
    }

    if (fim <= inicio || fim > limiteFim) {
      return res.status(400).json({
        error:
          "O horário de término deve ser entre 07:00 e 21:00 e não pode ser antes do horário de início!",
      });
    }

    // Verifica se já existe agendamento para a sala no horário
    const checkQuery = `SELECT * FROM reserva WHERE fk_id_sala = ? AND id_reserva != ? AND
                        ((begin BETWEEN ? AND ?) OR (end BETWEEN ? AND ?))`;
    const checkValues = [fk_id_sala, id_reserva, begin, end, begin, end];

    try {
      connect_database.query(checkQuery, checkValues, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao verificar disponibilidade da sala!" });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: "A sala já está reservada nesse horário!" });
        }

        // Atualizar o agendamento
        const query = `UPDATE reserva SET fk_id_usuario = ?, fk_id_sala = ?, begin = ?, end = ? 
                       WHERE id_reserva = ?`;
        const values = [fk_id_usuario, fk_id_sala, begin, end, id_reserva,];

        connect_database.query(query, values, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao atualizar a reserva!" });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Reserva não encontrada!" });
          }
          return res.status(200).json({ message: "Reserva atualizada com sucesso!" });
        });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }

// ----------------------------Excluir um agendamento

  static async deleteAgend(req, res) {
    const idAgendamento = req.params.id;

    const query = `DELETE FROM reserva WHERE id_reserva = ?`;

    try {
      connect_database.query(query, idAgendamento, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir reserva!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada!" });
        }
        return res.status(200).json({ message: "Reserva excluída com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta!", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }
};