const formulario = document.getElementById("dietForm");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Valores dos inputs ---------------------------------------------------------
  const cpf = document.getElementById("cpf").value;

  const idade = document.getElementById("idade").value;
  const sexo = document.getElementById("sexo").value;

  const altura = document.getElementById("altura").value * 100; // em centimetros
  const peso = document.getElementById("peso").value;

  const atividade = document.getElementById("nivel_atividade").value;
  const objetivo = document.querySelector(
    'input[name="objetivo"]:checked',
  )?.value;

  const restricoes = document.getElementById("restricoes").value;
  const QTDErefeicoes = document.getElementById("refeicoes").value;

  // Inicio dos calculos ---------------------------------------------------------

  const TaxaMetabolica = CalcularTMB(sexo, peso, altura, idade).toFixed(0);

  const GastoEnergetico =
    TaxaMetabolica * fatoresDeAtividade[atividade].toFixed(0);

  const caloriasDiarias = CalcularCaloriasDiarias(
    objetivo,
    GastoEnergetico,
  ).toFixed(0);

  // Nutrientes em gramas ---------------------------------------------------------

  const Proteina = peso * 1.8;
  const Carboidrato = peso * 4;
  const Gordura = peso * 0.8;

  // Tratamento em quantidade de refeicoes -----------------------------------------

  const ListaDeRefeicoes = DistribuirRefeicoes(caloriasDiarias, QTDErefeicoes);
});

function CalcularTMB(sexo, peso, altura, idade) {
  switch (sexo.toLowerCase()) {
    case "masculino":
      return 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade;
    case "feminino":
      return 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * idade;
  }
}

function CalcularCaloriasDiarias(objetivo, GastoEnergetico) {
  switch (objetivo.toLowerCase()) {
    case "emagrecimento":
      return GastoEnergetico - 500;
    case "massa_muscular":
      return GastoEnergetico + 400;
    case "manutencao":
    case "saude_geral":
      return GastoEnergetico;
    default:
      return GastoEnergetico;
  }
}

function DistribuirRefeicoes(totalDeCalorias, quantidade) {
  const metas = [];

  switch (quantidade) {
    case 3:
      metas.push({ nome: "Café da Manhã", kcal: totalDeCalorias * 0.2 });
      metas.push({ nome: "Almoco", kcal: totalDeCalorias * 0.4 });
      metas.push({ nome: "Janta", kcal: totalDeCalorias * 0.4 });
      break;
    case 4:
      metas.push({ nome: "Café da Manhã", kcal: totalDeCalorias * 0.15 });
      metas.push({ nome: "Almoco", kcal: totalDeCalorias * 0.35 });
      metas.push({ nome: "Café da Tarde", kcal: totalDeCalorias * 0.15 });
      metas.push({ nome: "Janta", kcal: totalDeCalorias * 0.35 });
      break;
    case 5:
      metas.push({ nome: "Café da Manhã", kcal: totalDeCalorias * 0.1 });
      metas.push({ nome: "Almoco", kcal: totalDeCalorias * 0.3 });
      metas.push({ nome: "Café da Tarde", kcal: totalDeCalorias * 0.1 });
      metas.push({ nome: "Janta", kcal: totalDeCalorias * 0.3 });
      metas.push({ nome: "Ceia", kcal: totalDeCalorias * 0.1 });
      break;
  }

  return metas;
}

const fatoresDeAtividade = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  ativo: 1.725,
};
