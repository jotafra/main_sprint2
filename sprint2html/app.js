//Chamada da função createUser para a associação ao evento de envio a formulário
document.getElementById("formulariocadastro").addEventListener("submit", function (event) {
    //Previne o comportamento padrao do formulario, ou seja, impede que ele seja enviado e recarregue a pagona
    event.preventDefault();
    //Captura os valores dos campos do formularios
    const nome_completo = document.getElementById("nome_completo").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    console.log(nome_completo, email, cpf, senha)

    //Requisição HTTP para o endpoint de cadastro de usuario
    fetch("http://localhost:5000/agen/sala-de-aula/v1/user", {
      //Realiza uma chamada http para o servidor(a rota definida)
      method: "POST",
      headers: {
        //A requisição será em formato json
        "Content-Type": "application/json",
      },
      //Transforma os dados do formulario de uma string json para serem enviados no corpo da req
      body: JSON.stringify({ nome_completo, cpf, email, senha }),
    })
      .then((response) => {
        //Tratamento da resposta do servidor / API
        if (response.ok) {
          //verifica se a resposta foi bem sucedida (status 2xx(duzentos e alguma coisa))
          return response.json();
        }
        //Convertendo o erro em formato JSON
        return response.json().then((err) => {
          //Mensagem retornada do servidor acessada pela chave "error"
          throw new Error(err.error);
        });
      }) //Fechamento da then(response)
      .then((data) => {
        //executa a resposta de sucesso - retorna ao usuario final
        //Exibe um alerta para o usuario final (front) com o nome que acabou de ser cadastrado
        alert("Usuário cadastrado com sucesso");
      })
      .catch((error) => {
        //Captura qualquer erro que ocorra durante o processo de requisição / resposta
        //Exibe alerta (front) com o erro processado
        alert("Erro no cadastro " + error.message);
        console.error("Erro:", error.message);
      });
  }); //Fechamento createUser
;

  //====================================================================================================

document.getElementById("formulariologin").addEventListener("submit", function (event) {
    //Previne o comportamento padrao do formulario, ou seja, impede que ele seja enviado e recarregue a pagona
    event.preventDefault();
    //Captura os valores dos campos do formularios
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    //Requisição HTTP para o endpoint de cadastro de usuario
    fetch("http://localhost:5000/agen/sala-de-aula/v1/login", {
      //Realiza uma chamada http para o servidor(a rota definida)
      method: "POST",
      headers: {
        //A requisição será em formato json
        "Content-Type": "application/json",
      },
      //Transforma os dados do formulario de uma string json para serem enviados no corpo da req
      body: JSON.stringify({ cpf, senha }),
    })
      .then((response) => {
        //Tratamento da resposta do servidor / API
        if (response.ok) {
          //verifica se a resposta foi bem sucedida (status 2xx(duzentos e alguma coisa))
          return response.json();
        }
        //Convertendo o erro em formato JSON
        return response.json().then((err) => {
          //Mensagem retornada do servidor acessada pela chave "error"
          throw new Error(err.error);
        });
      }) //Fechamento da then(response)
      .then((data) => {
        //executa a resposta de sucesso - retorna ao usuario final
        //Exibe um alerta para o usuario final (front) com o nome que acabou de ser cadastrado
        alert("Login bem sucedido");
        window.location.href = "agendamento.html";
      })
      .catch((error) => {
        //Exibe alerta (front) com o erro processado
        alert("Erro no cadastro " + error.message);
        console.error("Erro:", error.message);
      });
  } //Fechamento createUser
)