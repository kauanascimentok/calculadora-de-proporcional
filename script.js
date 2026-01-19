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

  const valorDia = plano / diasMes;
  const valorTotal = (valorDia * diasUsados).toFixed(2);

  const diasExtras =
    diasUsados > diasMes ? diasUsados - diasMes : 0;

  const data = new Date().toLocaleString();

  resultado.innerHTML = `
    💰 <strong>R$ ${valorTotal}</strong><br>
    📅 ${diasUsados} dias utilizados<br>
    ${diasExtras > 0 ? `⚠️ ${diasExtras} dias excedentes` : ""}
  `;

  const dados = JSON.parse(localStorage.getItem("isp")) || [];
  dados.unshift({
    cliente,
    plano,
    diasMes,
    diasUsados,
    diasExtras,
    valor: valorTotal,
    data
  });

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
      Plano: R$ ${Number(d.plano).toFixed(2)}<br>
      Uso: ${d.diasUsados} dias
      ${d.diasExtras > 0 ? `( +${d.diasExtras} excedentes )` : ""}<br>
      <strong>Total: R$ ${d.valor}</strong><br>
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
   STATUS ONLINE
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

window.addEventListener("online", verificarConexao);
window.addEventListener("offline", verificarConexao);

verificarConexao();
carregarHistorico();
s
