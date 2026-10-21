// ===== CONFIGURAÇÕES =====
const TURMAS = [
  { nome: "1º 1", user: "1°1", senha: "4821" },
  { nome: "1º 2", user: "1°2", senha: "7359" },
  { nome: "1º 3", user: "1°3", senha: "1946" },
  { nome: "1º 4", user: "1°4", senha: "6083" },
  { nome: "2º 1", user: "2°1", senha: "2574" },
  { nome: "2º 2", user: "2°2", senha: "9137" },
  { nome: "2º 3", user: "2°3", senha: "3608" },
  { nome: "2º 4", user: "2°4", senha: "8415" },
  { nome: "2º 5", user: "2°5", senha: "5290" },
  { nome: "2º 6", user: "2°6", senha: "1763" },
  { nome: "2º 7", user: "2°7", senha: "4982" },
  { nome: "3º 1", user: "3°1", senha: "6741" },
  { nome: "3º 2", user: "3°2", senha: "3125" },
  { nome: "3º 3", user: "3°3", senha: "8056" },
  { nome: "3º 4", user: "3°4", senha: "2907" },
  { nome: "3º 5", user: "3°5", senha: "7614" },
  { nome: "3º 6", user: "3°6", senha: "5338" },
];

const USUARIO = "cantina";
const SENHA = "1234";
const MARGEM = 0.1;

// Os números ficam somente na memória da página.
let dados = {};
let tela = "home";
let turma = null;
let msg = "";
let logado = false;
let confirmando = false;

const app = document.getElementById("app");

function dataExtenso() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function ir(t) {
  tela = t;
  msg = "";
  confirmando = false;
  render();
}

function aviso() {
  if (!msg) return "";

  return (
    '<p class="' +
    (msg.startsWith("ok") ? "msg" : "err") +
    '">' +
    msg.slice(3) +
    "</p>"
  );
}

function escolher(i) {
  turma = TURMAS[i].nome;
  ir("loginsala");
}

function loginSala() {
  const u = document.getElementById("u").value.trim().toLowerCase();

  const p = document.getElementById("p").value;

  const t = TURMAS.find(function (x) {
    return x.nome === turma;
  });

  if (t && u === t.user && p === t.senha) {
    ir("qtd");
  } else {
    msg = "err:Usuário ou senha incorretos para a turma " + turma + ".";
    render();
  }
}

function enviar() {
  const q = parseInt(document.getElementById("q").value, 10);

  if (isNaN(q) || q < 0 || q > 100) {
    msg = "err:Digite um número entre 0 e 100.";
    return render();
  }

  dados[turma] = q;

  msg = "ok:Enviado! A cantina recebeu o número da turma " + turma + ".";

  render();
}

function loginCantina() {
  const u = document.getElementById("u").value.trim();
  const p = document.getElementById("p").value;

  if (u === USUARIO && p === SENHA) {
    logado = true;
    ir("cantina");
  } else {
    msg = "err:Usuário ou senha incorretos.";
    render();
  }
}

function pedirReset() {
  confirmando = true;
  render();
}

function cancelarReset() {
  confirmando = false;
  render();
}

function resetarTudo() {
  dados = {};
  confirmando = false;
  msg = "ok:Todas as informações foram apagadas.";
  render();
}

const voltar =
  '<button class="sec" onclick="ir(\'home\')">' + "← Voltar</button>";

function render() {
  let h = "";

  if (tela === "home") {
    h =
      "<h1>🍲 Merenda Certa</h1>" +
      "<p>Menos desperdício, mais merenda para quem precisa. " +
      "Cada turma informa quantos alunos vão comer hoje.</p>" +
      '<div class="big">' +
      "<button onclick=\"ir('turmas')\">🎒<br>Sou aluno</button>" +
      "<button onclick=\"ir('login')\" " +
      'style="background:var(--ok)">' +
      "👩‍🍳<br>Sou cantineiro(a)</button></div>";
  } else if (tela === "turmas") {
    h =
      voltar +
      "<h1>Escolha sua turma</h1><p>" +
      dataExtenso() +
      '</p><div class="grid">' +
      TURMAS.map(function (t, i) {
        const ok = dados[t.nome] != null;

        return (
          '<button class="' +
          (ok ? "done" : "") +
          '" onclick="escolher(' +
          i +
          ')">' +
          t.nome +
          (ok ? " ✓" : "") +
          "</button>"
        );
      }).join("") +
      "</div>";
  } else if (tela === "loginsala") {
    h =
      '<button class="sec" onclick="ir(\'turmas\')">' +
      "← Turmas</button>" +
      "<h1>Login da turma " +
      turma +
      "</h1>" +
      "<p>Digite o usuário e a senha da sua sala.</p>" +
      '<div class="card"><label>Usuário</label>' +
      '<input id="u" autocapitalize="none" autocomplete="off">' +
      "<label>Senha</label>" +
      '<input id="p" type="password" inputmode="numeric" ' +
      "onkeydown=\"if(event.key==='Enter')loginSala()\">" +
      '<button onclick="loginSala()">Entrar</button>' +
      aviso() +
      "</div>";
  } else if (tela === "qtd") {
    h =
      '<button class="sec" onclick="turma=null;ir(\'home\')">' +
      "Sair</button>" +
      "<h1>Turma " +
      turma +
      "</h1><p>" +
      dataExtenso() +
      "</p>" +
      '<div class="card">' +
      "<label>Quantos alunos vão merendar hoje?</label>" +
      '<input id="q" type="number" inputmode="numeric" ' +
      'min="0" max="100" value="' +
      (dados[turma] != null ? dados[turma] : "") +
      '" placeholder="Ex.: 28">' +
      '<button onclick="enviar()">Enviar para a cantina</button>' +
      aviso() +
      '<p class="small">Você pode corrigir o número até a hora da merenda.</p>' +
      "</div>";
  } else if (tela === "login") {
    h =
      voltar +
      "<h1>Login da cantina</h1>" +
      '<div class="card"><label>Usuário</label>' +
      '<input id="u" autocomplete="username" autocapitalize="none">' +
      "<label>Senha</label>" +
      '<input id="p" type="password" autocomplete="current-password" ' +
      "onkeydown=\"if(event.key==='Enter')loginCantina()\">" +
      '<button onclick="loginCantina()">Entrar</button>' +
      aviso() +
      "</div>";
  } else if (tela === "cantina") {
    if (!logado) return ir("login");

    const soma = TURMAS.reduce(function (s, t) {
      return s + (dados[t.nome] || 0);
    }, 0);

    const total = Math.ceil(soma * (1 + MARGEM));

    const resp = TURMAS.filter(function (t) {
      return dados[t.nome] != null;
    }).length;

    const reset = confirmando
      ? '<div class="card">' +
        "<p><b>Apagar TODOS os números de todas as turmas?</b></p>" +
        '<div class="row">' +
        '<button class="red" onclick="resetarTudo()">' +
        "Sim, apagar tudo</button>" +
        '<button class="sec" onclick="cancelarReset()">' +
        "Cancelar</button></div></div>"
      : '<button class="red" onclick="pedirReset()">' +
        "🗑️ Resetar todas as informações</button>";

    h =
      '<button class="sec" onclick="logado=false;ir(\'home\')">' +
      "Sair</button>" +
      "<h1>Painel da cantina</h1><p>" +
      dataExtenso() +
      " · " +
      resp +
      " de " +
      TURMAS.length +
      " turmas responderam</p>" +
      aviso() +
      '<div class="card"><p>Preparar hoje (+10% de margem)</p>' +
      '<div class="num">' +
      total +
      " porções</div>" +
      '<p class="small">' +
      soma +
      " alunos confirmados + 10%, arredondado para cima</p></div>" +
      '<div class="card"><table><tr><th>Turma</th>' +
      "<th>Alunos</th></tr>" +
      TURMAS.map(function (t) {
        return (
          "<tr><td>" +
          t.nome +
          "</td><td>" +
          (dados[t.nome] != null
            ? dados[t.nome]
            : '<span style="color:var(--mut)">aguardando</span>') +
          "</td></tr>"
        );
      }).join("") +
      "</table></div>" +
      reset;
  }

  app.innerHTML = h;
}

render();
