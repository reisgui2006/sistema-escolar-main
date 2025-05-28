const API_URL = "https://school-system-spi.onrender.com/api/professores";

// Botões e containers
const fecharListaBtn = document.getElementById("fechar-lista");
const professorLista = document.getElementById("professor-lista");
const listarProfessorBtn = document.getElementById("listar-professor");

// Abrir popup de cadastro
document.getElementById("open-cadastro-btn").addEventListener("click", () => {
  document.getElementById("cadastro-popup").style.display = "block";
});

// Fechar popup de cadastro
document.getElementById("close-cadastro-btn").addEventListener("click", () => {
  document.getElementById("cadastro-popup").style.display = "none";
});

// Cadastrar professor
document.getElementById("professor-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nome: form.nome.value,
    materia: form.materia.value,
    idade: parseInt(form.idade.value),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar");

    const result = await response.json();
    alert("Professor cadastrado!");
    console.log(result);
    form.reset();
    document.getElementById("cadastro-popup").style.display = "none";
    listarProfessorBtn.click(); // Atualiza lista
  } catch (error) {
    alert("Erro ao cadastrar professor.");
    console.error(error);
  }
});

// Listar professores
listarProfessorBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL);
    const professores = await res.json();

    professorLista.innerHTML =
      "<h2>Lista de Professores</h2>" +
      professores
        .map(
          (p) => `
            <div>
              <strong>${p.nome}</strong> (ID: ${p.id})<br>
              Matéria: ${p.materia} | Idade: ${p.idade}<br>
              <button onclick="editarProfessor(${p.id})">Editar</button>
              <button onclick="excluirProfessor(${p.id})">Excluir</button>
              <hr>
            </div>
          `
        )
        .join("");

    professorLista.style.display = "block";
    fecharListaBtn.style.display = "inline-block"; // Mostrar botão fechar lista
    listarProfessorBtn.style.display = "none";

  } catch (error) {
    alert("Erro ao listar professores.");
    console.error(error);
  }
});

// Fechar lista
fecharListaBtn.addEventListener("click", () => {
  professorLista.style.display = "none";
  fecharListaBtn.style.display = "none";
  listarProfessorBtn.style.display = "inline-block";
  professorLista.innerHTML = "";
});

// Editar professor
async function editarProfessor(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const professor = await res.json();

    const form = document.getElementById("update-form");
    form.nome.value = professor.nome;
    form.materia.value = professor.materia;
    form.idade.value = professor.idade;

    document.getElementById("edit-popup").style.display = "block";
    form.dataset.id = id;
  } catch (error) {
    alert("Erro ao carregar professor.");
    console.error(error);
  }
}

// Atualizar professor
document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const professorId = form.dataset.id;
  const data = {
    nome: form.nome.value,
    materia: form.materia.value,
    idade: parseInt(form.idade.value),
  };

  try {
    const response = await fetch(`${API_URL}/${professorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao atualizar");

    const result = await response.json();
    alert("Professor atualizado com sucesso!");
    console.log(result);
    form.reset();
    document.getElementById("edit-popup").style.display = "none";
    listarProfessorBtn.click();
  } catch (error) {
    alert("Erro ao atualizar professor.");
    console.error(error);
  }
});

// Excluir professor
async function excluirProfessor(id) {
  if (!confirm("Tem certeza que deseja excluir este professor?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir");

    const result = await response.json();
    alert("Professor excluído com sucesso!");
    console.log(result);
    listarProfessorBtn.click();
  } catch (error) {
    alert("Erro ao excluir professor.");
    console.error(error);
  }
}

// Fechar popup de edição
document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("edit-popup").style.display = "none";
});
