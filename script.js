const lista = document.getElementById("lista");
const resultado = document.getElementById("resultado");
const statusEl = document.getElementById("status");


function calcular() {
  const cliente = clienteInput.value;
  const plano = parseFloat(planoInput.value);
  const diasMes = parseInt(diasMesInput.value);
  const diasUsados = parseInt(diasUsadosInput.value);

  if (!cliente || !plano || !diasMes || !diasUsados) {
    alert("Preencha todos os campos.");
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

/* HISTÓRICO */
function carregarHistorico() {
  const dados = JSON.parse(localStorage.getItem("isp")) || [];
  lista.innerHTML = "";

  dados.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${d.cliente}</strong><br>
      Plano R$ ${d.plano} • ${d.diasUsados}/${d.diasMes} dias<br>
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

/* STATUS ONLINE REAL */
async function verificarConexao() {
  try {
    await fetch("https://www.google.com/favicon.ico", {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store"
    });
    statusEl.innerText = "ONLINE";
    statusEl.style.background =
      "linear-gradient(135deg, #00ff9d, #00c776)";
  } catch {
    statusEl.innerText = "OFFLINE";
    statusEl.style.background =
      "linear-gradient(135deg, #ff4b4b, #c90000)";
  }
}

verificarConexao();
setInterval(verificarConexao, 5000);
carregarHistorico();
