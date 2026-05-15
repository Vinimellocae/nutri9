function abrirModal(titulo, mensagem) {
  document.getElementById('modalTitulo').innerText = titulo;
  document.getElementById('modalMensagem').innerText = mensagem;
  document.getElementById('modalAviso').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalAviso').style.display = 'none';
}

document.getElementById('cpf').addEventListener('input', function (e) {
  let v = e.target.value.replace(/\D/g, "");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = v;
});

function buscarHistorico() {
  const cpfBusca = document.getElementById('cpf').value;
  const lista = document.getElementById('listaResultados');

  lista.innerHTML = '';

  if (cpfBusca.length < 14) {
    abrirModal("CPF Incompleto", "Por favor, digite o CPF completo para realizar a busca.");
    return;
  }

  let historico = JSON.parse(localStorage.getItem('nutrinove_historico')) || [];
  let resultados = historico.filter(dieta => dieta.cpf === cpfBusca);

  if (resultados.length === 0) {
    abrirModal("Não encontrado", "Não encontramos registros para este CPF. Tente gerar uma dieta primeiro!");
    return;
  }

  resultados.reverse().forEach(dieta => {
    lista.innerHTML += `
                    <div class="diet-item">
                        <div class="diet-info">
                            <h4>Plano: ${dieta.objetivo}</h4>
                            <span>Data: ${dieta.data} | Peso: ${dieta.peso}kg</span>
                        </div>
                        <button class="btn-open">Visualizar</button>
                    </div>
                `;
  });
}