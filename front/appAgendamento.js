document.addEventListener("DOMContentLoaded", getAllSalas);

function getAllSalas() {
  // Faz a requisição GET para o endpoint
  fetch("http://10.89.240.74:5000/agensala/salas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.Error);
      });
    })
    .then((data) => {
      const selectSala = document.getElementById("sala");
      selectSala.innerHTML = ""; // Limpa o conteúdo existente no select

      // Adiciona a opção padrão
      const optionDefault = document.createElement("option");
      optionDefault.textContent = "Selecione uma sala";
      optionDefault.value = "";
      selectSala.appendChild(optionDefault);

      // Preenche o select com as salas disponíveis
      data.salas.forEach((sala) => {
        const option = document.createElement("option");
        option.value = sala.id; // Substitua pelo campo correto para o ID da sala
        option.textContent = `Nome : ${sala.nome_da_sala}, Descrição : ${sala.descricao}, Bloco: ${sala.bloco},
        Tipo: ${sala.tipo}, Capacidade: ${sala.capacidade}`; // Substitua pelo campo correto para o nome da sala
        selectSala.appendChild(option);
      });

    })
    .catch((error) => {
      alert("Erro ao obter salas: " + error.message);
      console.error("Erro:", error.message);
    });
}
