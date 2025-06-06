const API_URL_TURMA = "https://school-system-spi.onrender.com/api/turmas";

const listarTurmasBtn = document.getElementById("listar-turmas");
const fecharListaTurmasBtn = document.getElementById("fechar-lista-turmas");  // corrigido
const turmasLista = document.getElementById("turmas-lista");

// Abrir popup cadastro turma
document.getElementById("open-turma-popup").addEventListener("click", () => {
  document.getElementById("turma-popup").style.display = "block";
});

// Fechar popup cadastro turma
document.getElementById("close-turma-popup").addEventListener("click", () => {
  document.getElementById("turma-popup").style.display = "none";
});

// Cadastro turma via popup
document.getElementById("turma-form-popup").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    materia: form.materia.value,
    descricao: form.descricao.value,
    ativo: form.ativo.value === "true",
    professor_id: parseInt(form.professor_id.value),
  };

  try {
    const response = await fetch(API_URL_TURMA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar turma");

    const result = await response.json();
    alert("Turma cadastrada!");
    console.log(result);
    form.reset();
    document.getElementById("turma-popup").style.display = "none";

    if (turmasLista.style.display === "block") {
      listarTurmasBtn.click();
    }
  } catch (error) {
    alert("Erro ao cadastrar turma. Veja console.");
    console.error(error);
  }
});

// Listar turmas
listarTurmasBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL_TURMA);
    if (!res.ok) throw new Error("Erro ao listar turmas");
    const turmas = await res.json();

    turmasLista.innerHTML =
      "<h2>Lista de Turmas</h2>" +
      turmas
        .map(
          (t) => `
      <div>
        <strong>Turma ID: ${t.id}</strong><br>
        Matéria: ${t.materia}<br>
        Descrição: ${t.descricao}<br>
        Ativo: ${t.ativo ? "Sim" : "Não"}<br>
        Professor ID: ${t.professor_id}<br>
        <button onclick="editarTurma(${t.id})">Editar</button>
        <button onclick="excluirTurma(${t.id})">Excluir</button>
        <hr>
      </div>
      `
        )
        .join("");
    
  try {
    const climaRes = await fetch("https://api.weatherapi.com/v1/current.json?key=f85f759535d648c38a720720250606&q=Sao Paulo&lang=pt")
    if (!climaRes.ok) throw new Error("Erro ao obter clima.");

    const clima = await climaRes.json();
    const temp = clima.current.temp_c;
    const vento = clima.current.wind_kph;
    const condicao = clima.current.condition.text;

    const climaHTML = `
      <div style="background:#eef; padding:10px; margin-top:20px;">
        <h3>🌦️ Clima Atual</h3>
        Temperatura: ${temp}°C<br>
        Vento: ${vento} km/h<br>
        Condição: ${condicao}
      </div>
    `;
    turmasLista.innerHTML += climaHTML;
  } catch (err) {
    console.error("Erro ao buscar clima:", err)
  }

    turmasLista.style.display = "block";
    fecharListaTurmasBtn.style.display = "inline-block";
    listarTurmasBtn.style.display = "none";
  } catch (error) {
    alert("Erro ao listar turmas. Veja console.");
    console.error(error);
  }
});

// Fechar lista turmas
fecharListaTurmasBtn.addEventListener("click", () => {
  turmasLista.style.display = "none";
  fecharListaTurmasBtn.style.display = "none";
  listarTurmasBtn.style.display = "inline-block";
  turmasLista.innerHTML = "";
});

// Editar turma
async function editarTurma(id) {
  try {
    const res = await fetch(`${API_URL_TURMA}/${id}`);

    if (!res.ok) throw new Error("Turma não encontrada");

    const data = await res.json();
    console.log("Objeto retornado da API:", data);

    const turma = data.turma;  // Aqui pegamos a turma correta dentro do objeto retornado

    if (!turma || typeof turma.id === "undefined") throw new Error("ID da turma indefinido");

    document.getElementById("turma-id").value = turma.id;
    document.getElementById("update-materia").value = turma.materia;
    document.getElementById("update-descricao").value = turma.descricao;
    document.getElementById("update-ativo").value = turma.ativo ? "true" : "false";
    document.getElementById("update-professor_id").value = turma.professor_id;

    document.getElementById("edit-turma-popup").style.display = "block";

  } catch (error) {
    alert("Erro ao carregar turma. Veja console.");
    console.error(error);
  }
}

// Atualizar turma
document.getElementById("update-turma-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const turmaId = document.getElementById("turma-id").value;

  const data = {
    materia: form["update-materia"].value,
    descricao: form["update-descricao"].value,
    ativo: form["update-ativo"].value === "true",
    professor_id: parseInt(form["update-professor_id"].value),
  };

  try {
    const response = await fetch(`${API_URL_TURMA}/${turmaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar turma");

    const result = await response.json();
    alert("Turma atualizada com sucesso!");
    console.log(result);
    form.reset();
    document.getElementById("edit-turma-popup").style.display = "none";

    if (turmasLista.style.display === "block") {
      listarTurmasBtn.click();
    }
  } catch (error) {
    alert("Erro ao atualizar turma. Veja console.");
    console.error(error);
  }
});

// Excluir turma
async function excluirTurma(id) {
  if (!confirm("Tem certeza que deseja excluir esta turma?")) return;

  try {
    const response = await fetch(`${API_URL_TURMA}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir turma");

    const result = await response.json();
    alert("Turma excluída com sucesso!");
    console.log(result);

    if (turmasLista.style.display === "block") {
      listarTurmasBtn.click();
    }
  } catch (error) {
    alert("Erro ao excluir turma. Veja console.");
    console.error(error);
  }
}

// Fechar popup edição turma
document.getElementById("close-edit-turma-popup").addEventListener("click", () => {
  document.getElementById("edit-turma-popup").style.display = "none";
});
