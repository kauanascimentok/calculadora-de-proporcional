const lista = document.getElementById("lista");
const resultado = document.getElementById("resultado");
const statusEl = document.getElementById("status");

/* =====================
   CÁLCULO PRINCIPAL
===================== */
function calcular() {
  const cliente = document.getElementById("cliente").value.trim();
  const plano = Number(document.getElementById("plano").value);
  const diasMes = Number(document.getElementById("diasMes").value);
  const diasUsados = Number(document.getElementById("diasUsados").value);

  if (
    !cliente ||
    isNaN(plano) || plano <= 0 ||
    isNaN(diasMes) || diasMes <= 0 ||
    isNaN(diasUsados) || diasUsados <= 0
  ) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  if (diasUsados > diasMes) {
    alert("Dias usados não pode ser maior que os dias do mês.");
    return;
  }

  const valor = ((plano / diasMes) * diasUsados).toFixed(2);
  const data = new Date().toLocaleString();

  resultado.innerText = `Cliente ${cliente} • R$ ${valor}`;

  const dados = JSON.parse(localStorage.getItem("isp")) || [];
  dados.unshift({ cliente, plano, diasMes, diasUsados, valor, data });
  localStorage.setItem("isp", JSON.stringify(dados));

  carregarHistorico();
}

/* =====================
   HISTÓRICO
===================== */
function carregarHistorico() {
  const dados = JSON.parse(localStorage.getItem("isp")) || [];
  lista.innerHTML = "";

  dados.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${d.cliente}</strong><br>
      Plano R$ ${Number(d.plano).toFixed(2)} • ${d.diasUsados}/${d.diasMes} dias<br>
      <strong>R$ ${d.valor}</strong><br>
      <small>${d.data}</small>
    `;
    lista.appendChild(li);
  });
}

function apagarHistorico() {
  if (confirm("Deseja apagar todo o histórico?")) {
    localStorage.removeItem("isp");
    carregarHistorico();
    resultado.innerText = "Histórico apagado.";
  }
}

/* =====================
   STATUS ONLINE (SEGURO)
===================== */
function verificarConexao() {
  if (navigator.onLine) {
    statusEl.innerText = "ONLINE";
    statusEl.style.background =
      "linear-gradient(135deg, #00ff9d, #00c776)";
  } else {
    statusEl.innerText = "OFFLINE";
    statusEl.style.background =
      "linear-gradient(135deg, #ff4b4b, #c90000)";
  }
}

/* =====================
   INIT
===================== */
window.addEventListener("online", verificarConexao);
window.addEventListener("offline", verificarConexao);

verificarConexao();
carregarHistorico();
