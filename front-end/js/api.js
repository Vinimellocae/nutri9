const formulario = document.getElementById("dietForm");
const formCard = document.querySelector(".form-card");


function mostrarLoading(nome) {
  formCard.innerHTML = `
    <div class="estado-loading">
      <div class="loading-spinner"></div>
      <h2>Gerando seu plano, ${nome.split(" ")[0]}!</h2>
      <p>Estamos analisando seus dados e montando<br>um cardápio exclusivo para você.</p>
      <div class="loading-steps">
        <span class="step ativo" id="step1">📊 Calculando necessidades calóricas</span>
        <span class="step" id="step2">🥦 Selecionando alimentos ideais</span>
        <span class="step" id="step3">📋 Montando seu plano semanal</span>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById("step1")?.classList.add("concluido");
    document.getElementById("step2")?.classList.add("ativo");
  }, 1200);
  setTimeout(() => {
    document.getElementById("step2")?.classList.add("concluido");
    document.getElementById("step3")?.classList.add("ativo");
  }, 2600);
}

function mostrarErro(mensagem) {
  formCard.innerHTML = `
    <div class="estado-feedback estado-erro">
      <div class="feedback-icon">❌</div>
      <h2>Algo deu errado</h2>
      <p>${mensagem}</p>
      <button class="btn-feedback" onclick="location.reload()">
        ↩ Tentar novamente
      </button>
    </div>
  `;
}

function mostrarSucesso(nome) {
  formCard.innerHTML = `
    <div class="estado-feedback estado-sucesso">
      <div class="feedback-icon">✅</div>
      <h2>Plano gerado com sucesso!</h2>
      <p>Seu plano alimentar personalizado está pronto, <strong>${nome.split(" ")[0]}</strong>. Acesse o histórico para consultá-lo a qualquer momento.</p>
      <div class="feedback-acoes">
        <button class="btn-feedback btn-secundario" onclick="location.reload()">
          ➕ Gerar novo plano
        </button>
        <a href="Historico.html" class="btn-feedback btn-primario">
          📋 Ver histórico
        </a>
      </div>
    </div>
  `;
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
  const idade = Number(document.getElementById("idade").value);
  const sexo = document.getElementById("sexo").value;
  const nivelAtividade = document.getElementById("nivel_atividade").value;

  const altura = Math.round(
    Number(document.getElementById("altura").value.replace(",", ".")) * 100
  );
  const peso = Number(
    document.getElementById("peso").value.replace(",", ".")
  );

  const objetivoRaw = document.querySelector('input[name="objetivo"]:checked')?.value;
  const objetivos = {
    massa_muscular: "hipertrofia",
    emagrecimento: "emagrecimento",
    manutencao: "manutencao",
    saude_geral: "manutencao",
  };
  const objetivo = objetivos[objetivoRaw];

  const restricao = document.getElementById("restricoes").value;
  const intoleranciaLactose = restricao === "lactose";
  const intoleranciaGluten = restricao === "gluten";

  const body = {
    nome, cpf, peso, altura, idade, sexo,
    objetivo, nivelAtividade,
    intoleranciaLactose, intoleranciaGluten,
  };

  /* Esconde o form e mostra loading */
  mostrarLoading(nome);

  try {
    const response = await fetch(
      "https://nutrinove-backend.onrender.com/menu",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const msg = response.status === 500
        ? "Erro interno no servidor. Tente novamente em alguns instantes."
        : response.status === 400
          ? "Dados inválidos. Verifique as informações e tente novamente."
          : `Erro inesperado (código ${response.status}).`;
      throw new Error(msg);
    }


    const pdfBlob =
      await response.blob();


    const url =
      URL.createObjectURL(pdfBlob);


    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "plano-alimentar.pdf";

    a.click();
    URL.revokeObjectURL(url);

    formulario.reset();
    await new Promise(r => setTimeout(r, 800));

    mostrarSucesso(nome);

  } catch (error) {
    console.error(error);
    mostrarErro(error.message || "Não foi possível conectar ao servidor.");
  }
});