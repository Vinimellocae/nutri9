function abrirModal(titulo, mensagem) {
  document.getElementById('modalTitulo').innerText = titulo;
  document.getElementById('modalMensagem').innerText = mensagem;
  document.getElementById('modalAviso').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalAviso').style.display = 'none';
}

document.getElementById("cpf").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9)
    v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  else if (v.length > 6)
    v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  this.value = v;
});

document.getElementById("cpf").addEventListener("keydown", function (e) {
  if (e.key === "Enter") buscarHistorico();
});

async function buscarHistorico() {
  const cpfInput = document.getElementById("cpf");
  const lista = document.getElementById("listaResultados");

  const cpfBusca = cpfInput.value.replace(/\D/g, "");

  lista.innerHTML = "";

  if (cpfBusca.length !== 11) {
    abrirModal("CPF inválido", "Digite um CPF válido.");
    return;
  }

  try {

    const response = await fetch(
      `https://nutrinove-backend.onrender.com/menu/cpf/${cpfBusca}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }

    const data = await response.json();

    const resultados = data.menus;

    if (!resultados || resultados.length === 0) {
      abrirModal("Não encontrado", "Não encontramos dietas para este CPF.");
      return;
    }

    resultados.reverse();

    resultados.forEach(menu => {
      const dataFormatada = new Date(menu.created_at).toLocaleDateString("pt-BR");

      const objetivo = menu.objetivo.replace(/_/g, " ");
      const objetivoFormatado = objetivo.charAt(0).toUpperCase() + objetivo.slice(1);

      const item = document.createElement("div");
      item.className = "diet-item";
      item.innerHTML = `
        <div class="diet-info">
          <h4>${objetivoFormatado}</h4>
          <div class="diet-tags">
            <span class="diet-tag">📅 ${dataFormatada}</span>
            <span class="diet-tag">⚖️ ${menu.peso} kg</span>
            <span class="diet-tag">🔥 ${menu.calorie_goal} kcal</span>
            <span class="diet-tag">⚡ ${menu.nivel_atividade}</span>
          </div>
        </div>
        <button class="btn-open" onclick="baixarPDF(${menu.id})">Baixar PDF</button>
      `;
      lista.appendChild(item);
    });

  } catch (error) {
    console.error(error);
    abrirModal("Erro", "Não foi possível carregar o histórico.");
  }
}

function baixarPDF(id) {
  window.open(`https://nutrinove-backend.onrender.com/menu/${id}/pdf`);
}