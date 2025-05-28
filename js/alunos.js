const API_URL = "https://school-system-spi.onrender.com/api/alunos";

const listarBtn = document.getElementById("listar-alunos");
const fecharListaBtn = document.getElementById("fechar-lista");
const alunosLista = document.getElementById("alunos-lista");

// Abrir popup cadastro aluno
document.getElementById("open-cadastrar-popup").addEventListener("click", () => {
  document.getElementById("cadastrar-popup").style.display = "flex";
});

// Fechar popup cadastro aluno
document.getElementById("close-cadastrar-popup").addEventListener("click", () => {
  document.getElementById("cadastrar-popup").style.display = "none";
});

// Criar aluno
document.getElementById("aluno-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nome: form.nome.value,
    data_nascimento: form.data_nascimento.value,
    nota_primeiro_semestre: parseFloat(form.nota_primeiro_semestre.value),
    nota_segundo_semestre: parseFloat(form.nota_segundo_semestre.value),
    turma_id: parseInt(form.turma_id.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar aluno");

    const result = await response.json();
    alert("Aluno cadastrado!");
    console.log(result);
    form.reset();
    document.getElementById("cadastrar-popup").style.display = "none";

    // Atualizar lista se estiver aberta
    if (alunosLista.style.display === "block") {
      listarBtn.click();
    }
  } catch (error) {
    alert("Erro ao cadastrar aluno. Veja console.");
    console.error(error);
  }
});

// Listar alunos
listarBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Erro ao listar: ${res.statusText}`);
    }
    const alunos = await res.json();

    alunosLista.innerHTML =
      "<h2>Lista de Alunos</h2>" +
      alunos
        .map(
          (a) => `
      <div>
        <strong>${a.nome}</strong> (ID: ${a.id})<br>
        Idade: ${a.idade || "-"} | Média: ${a.media_final || "-"}<br>
        Nascimento: ${a.data_nascimento} | Turma: ${a.turma_id}<br>
        <button onclick="editarAluno(${a.id})">Editar</button>
        <button onclick="excluirAluno(${a.id})">Excluir</button>
        <hr>
      </div>
    `
        )
        .join("");

    alunosLista.style.display = "block";
    fecharListaBtn.style.display = "inline-block";
    listarBtn.style.display = "none";
  } catch (error) {
    alert("Erro ao listar alunos. Veja console.");
    console.error(error);
  }
});

// Fechar lista de alunos
fecharListaBtn.addEventListener("click", () => {
  alunosLista.style.display = "none";
  fecharListaBtn.style.display = "none";
  listarBtn.style.display = "inline-block";
  alunosLista.innerHTML = "";
});

// Editar aluno - carrega dados no popup
async function editarAluno(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Aluno não encontrado");
    const aluno = await res.json();

    // Preencher formulário edição
    document.getElementById("aluno-id").value = aluno.aluno.id;
    document.getElementById("update-nome").value = aluno.aluno.nome;
    document.getElementById("update-data_nascimento").value = aluno.aluno.data_nascimento;
    document.getElementById("update-nota_primeiro_semestre").value = aluno.aluno.nota_primeiro_semestre;
    document.getElementById("update-nota_segundo_semestre").value = aluno.aluno.nota_segundo_semestre;
    document.getElementById("update-turma_id").value = aluno.aluno.turma_id;

    // Mostrar popup
    document.getElementById("edit-popup").style.display = "flex";
  } catch (error) {
    alert("Erro ao carregar dados do aluno. Veja console.");
    console.error(error);
  }
}

// Atualizar aluno
document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const alunoId = document.getElementById("aluno-id").value;
  const data = {
    nome: form["update-nome"].value,
    data_nascimento: form["update-data_nascimento"].value,
    nota_primeiro_semestre: parseFloat(form["update-nota_primeiro_semestre"].value),
    nota_segundo_semestre: parseFloat(form["update-nota_segundo_semestre"].value),
    turma_id: parseInt(form["update-turma_id"].value),
  };

  try {
    const response = await fetch(`${API_URL}/${alunoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar aluno");

    const result = await response.json();
    alert("Aluno atualizado com sucesso!");
    console.log(result);
    form.reset();

    // Fechar popup
    document.getElementById("edit-popup").style.display = "none";

    // Atualizar lista se estiver aberta
    if (alunosLista.style.display === "block") {
      listarBtn.click();
    }
  } catch (error) {
    alert("Erro ao atualizar aluno. Veja console.");
    console.error(error);
  }
});

// Fechar popup editar
document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("edit-popup").style.display = "none";
});

// Excluir aluno
async function excluirAluno(id) {
  if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir aluno");

    const result = await response.json();
    alert("Aluno excluído com sucesso!");
    console.log(result);

    // Atualizar lista se estiver aberta
    if (alunosLista.style.display === "block") {
      listarBtn.click();
    }
  } catch (error) {
    alert("Erro ao excluir aluno. Veja console.");
    console.error(error);
  }
}
