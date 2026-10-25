
/* ==========================================
   NEXUS SELECT — SISTEMA DE TICKETS
   Autenticação, chamados e mensagens
========================================== */

/*
  CONFIGURAÇÃO:
  Substitua os dois valores abaixo pelos dados
  do seu projeto Supabase.

  Use somente a chave publicável (publishable)
  ou a chave anon pública legada.
  NUNCA use a service_role ou uma chave secreta.
*/


const SUPABASE_URL = "https://gkerrxdxnncdslcsynvp.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_Nc5pHHpxnfsQ3dIthgX8WQ_73jrPkOl";

let supabaseClient = null;
let usuarioAtual = null;
let ticketAtual = null;
let carregando = false;

const $ = (seletor) => document.querySelector(seletor);

function mostrarMensagem(seletor, mensagem, tipo = "") {
  const elemento = $(seletor);
  if (!elemento) return;

  elemento.textContent = mensagem;
  elemento.className = tipo;
}

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

function formatarData(data) {
  if (!data) return "";

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) return "";

  return dataFormatada.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function definirVisibilidade(seletor, visivel) {
  const elemento = $(seletor);
  if (elemento) elemento.hidden = !visivel;
}

function definirBotao(seletor, desativado) {
  const botao = $(seletor);
  if (botao) botao.disabled = desativado;
}

function normalizarStatus(status) {
  const permitidos = ["aberto", "em andamento", "fechado"];
  return permitidos.includes(status) ? status : "aberto";
}

function classeStatus(status) {
  const normalizado = normalizarStatus(status);

  if (normalizado === "em andamento") return "em-andamento";
  if (normalizado === "fechado") return "fechado";

  return "aberto";
}

function nomeStatus(status) {
  const normalizado = normalizarStatus(status);

  if (normalizado === "em andamento") return "Em andamento";
  if (normalizado === "fechado") return "Fechado";

  return "Aberto";
}

function exibirErro(erro, contexto) {
  console.error(contexto, erro);
  const mensagem = `${contexto}: ${erro?.message || "Erro desconhecido"}`;
  const elemento = document.querySelector("#mensagem-login");

  if (elemento) {
    elemento.textContent = mensagem;
  } else {
    alert(mensagem);
  }
}

  // Não expõe detalhes técnicos ou dados internos ao usuário.
  return `${contexto}. Verifique a configuração e tente novamente.`;
}

/* CARREGA A BIBLIOTECA OFICIAL DO SUPABASE */

function carregarBibliotecaSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase?.createClient) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
    script.async = true;

    script.onload = () => {
      if (window.supabase?.createClient) {
        resolve();
      } else {
        reject(new Error("Biblioteca do Supabase indisponível."));
      }
    };

    script.onerror = () => {
      reject(new Error("Não foi possível carregar o Supabase."));
    };

    document.head.appendChild(script);
  });
}

/* INICIALIZAÇÃO */

async function iniciarSistema() {
  try {
    if (
      SUPABASE_URL.includes("COLOQUE_") ||
      SUPABASE_PUBLIC_KEY.includes("COLOQUE_")
    ) {
      mostrarMensagem(
        "#mensagem-login",
        "Configure a URL e a chave pública do Supabase no arquivo tickets.js.",
        "erro"
      );
      return;
    }

    await carregarBibliotecaSupabase();

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLIC_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    conectarEventos();

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) throw error;

    await atualizarSessao(data.session);

    supabaseClient.auth.onAuthStateChange((_evento, sessao) => {
      // Evita operações complexas dentro do callback de autenticação.
      setTimeout(() => {
        atualizarSessao(sessao).catch((erro) => {
          console.error("Erro ao atualizar sessão:", erro);
        });
      }, 0);
    });

    const ano = $("#ano-atual");
    if (ano) ano.textContent = new Date().getFullYear();

  } catch (erro) {
    mostrarMensagem(
      "#mensagem-login",
      exibirErro(erro, "Não foi possível iniciar o sistema"),
      "erro"
    );
  }
}

async function atualizarSessao(sessao) {
  usuarioAtual = sessao?.user ?? null;

  definirVisibilidade("#form-login", !usuarioAtual);
  definirVisibilidade("#area-tickets", Boolean(usuarioAtual));
  definirVisibilidade("#form-ticket", false);
  definirVisibilidade("#conversa-ticket", false);

  // O painel administrativo permanece oculto até implementar
  // autorização administrativa real no banco de dados.
  definirVisibilidade("#area-admin", false);

  ticketAtual = null;

  if (usuarioAtual) {
    mostrarMensagem(
      "#mensagem-login",
      `Conectado como ${usuarioAtual.email ?? "usuário"}.`,
      "sucesso"
    );

    await carregarTickets();
  } else {
    const lista = $("#lista-tickets");
    if (lista) lista.replaceChildren();
  }
}

/* EVENTOS DA PÁGINA */

function conectarEventos() {
  $("#form-login")?.addEventListener("submit", entrar);
  $("#botao-cadastro")?.addEventListener("click", cadastrar);
  $("#botao-recuperar")?.addEventListener("click", recuperarSenha);

  $("#botao-abrir-ticket")?.addEventListener("click", () => {
    definirVisibilidade("#form-ticket", true);
    definirVisibilidade("#conversa-ticket", false);
    mostrarMensagem("#mensagem-ticket", "");
    $("#form-ticket")?.scrollIntoView({ behavior: "smooth" });
  });

  $("#botao-cancelar-ticket")?.addEventListener("click", () => {
    definirVisibilidade("#form-ticket", false);
    mostrarMensagem("#mensagem-ticket", "");
  });

  $("#form-ticket")?.addEventListener("submit", criarTicket);
  $("#form-resposta")?.addEventListener("submit", enviarResposta);
}

/* CADASTRO */

async function cadastrar() {
  if (!supabaseClient || carregando) return;

  const email = $("#email")?.value.trim();
  const senha = $("#senha")?.value;

  if (!email || !senha) {
    mostrarMensagem(
      "#mensagem-login",
      "Informe seu e-mail e sua senha.",
      "erro"
    );
    return;
  }

  if (senha.length < 8) {
    mostrarMensagem(
      "#mensagem-login",
      "Use uma senha com pelo menos 8 caracteres.",
      "erro"
    );
    return;
  }

  carregando = true;
  definirBotao("#botao-cadastro", true);

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: senha
    });

    if (error) throw error;

    if (data.session) {
      await atualizarSessao(data.session);
      mostrarMensagem(
        "#mensagem-login",
        "Cadastro realizado com sucesso!",
        "sucesso"
      );
    } else {
      mostrarMensagem(
        "#mensagem-login",
        "Cadastro enviado! Confira seu e-mail para confirmar a conta, se solicitado.",
        "sucesso"
      );
    }
  } catch (erro) {
    mostrarMensagem(
      "#mensagem-login",
      exibirErro(erro, "Não foi possível realizar o cadastro"),
      "erro"
    );
  } finally {
    carregando = false;
    definirBotao("#botao-cadastro", false);
  }
}

/* ENTRAR */

async function entrar(evento) {
  evento.preventDefault();

  if (!supabaseClient || carregando) return;

  const email = $("#email")?.value.trim();
  const senha = $("#senha")?.value;

  if (!email || !senha) {
    mostrarMensagem(
      "#mensagem-login",
      "Informe seu e-mail e sua senha.",
      "erro"
    );
    return;
  }

  carregando = true;
  definirBotao("#botao-entrar", true);

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password: senha
      });

    if (error) throw error;

    await atualizarSessao(data.session);

  } catch (erro) {
    mostrarMensagem(
      "#mensagem-login",
      exibirErro(erro, "Não foi possível entrar"),
      "erro"
    );
  } finally {
    carregando = false;
    definirBotao("#botao-entrar", false);
  }
}

/* RECUPERAR SENHA */

async function recuperarSenha() {
  if (!supabaseClient || carregando) return;

  const email = $("#email")?.value.trim();

  if (!email) {
    mostrarMensagem(
      "#mensagem-login",
      "Digite seu e-mail no campo acima primeiro.",
      "erro"
    );
    return;
  }

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}${window.location.pathname}`
      }
    );

    if (error) throw error;

    mostrarMensagem(
      "#mensagem-login",
      "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação. Confira também o spam.",
      "sucesso"
    );
  } catch (erro) {
    mostrarMensagem(
      "#mensagem-login",
      exibirErro(erro, "Não foi possível solicitar a recuperação"),
      "erro"
    );
  }
}

/* SAIR DA CONTA */

async function sair() {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Erro ao sair:", error);
    alert("Não foi possível sair da conta.");
  }
}

/* CRIAR TICKET */

async function criarTicket(evento) {
  evento.preventDefault();

  if (!supabaseClient || !usuarioAtual || carregando) return;

  const categoria = $("#ticket-categoria")?.value;
  const assunto = $("#ticket-assunto")?.value.trim();
  const mensagem = $("#ticket-mensagem")?.value.trim();

  const categorias = [
    "compra",
    "pedido",
    "produto",
    "suporte",
    "outro"
  ];

  if (!categorias.includes(categoria)) {
    mostrarMensagem("#mensagem-ticket", "Selecione uma categoria válida.", "erro");
    return;
  }

  if (!assunto || assunto.length < 3 || assunto.length > 120) {
    mostrarMensagem(
      "#mensagem-ticket",
      "O assunto deve ter entre 3 e 120 caracteres.",
      "erro"
    );
    return;
  }

  if (!mensagem || mensagem.length < 5 || mensagem.length > 3000) {
    mostrarMensagem(
      "#mensagem-ticket",
      "A mensagem deve ter entre 5 e 3000 caracteres.",
      "erro"
    );
    return;
  }

  carregando = true;

  try {
    const { data: ticket, error } = await supabaseClient
      .from("tickets")
      .insert({
        user_id: usuarioAtual.id,
        categoria,
        assunto,
        mensagem,
        status: "aberto"
      })
      .select("id")
      .single();

    if (error) throw error;

    mostrarMensagem(
      "#mensagem-ticket",
      "Ticket criado com sucesso!",
      "sucesso"
    );

    $("#form-ticket")?.reset();
    definirVisibilidade("#form-ticket", false);

    await carregarTickets();

    if (ticket?.id) {
      await abrirTicket(ticket.id);
    }

  } catch (erro) {
    mostrarMensagem(
      "#mensagem-ticket",
      exibirErro(erro, "Não foi possível criar o ticket"),
      "erro"
    );
  } finally {
    carregando = false;
  }
}

/* LISTAR TICKETS DO USUÁRIO */

async function carregarTickets() {
  const lista = $("#lista-tickets");

  if (!lista || !supabaseClient || !usuarioAtual) return;

  lista.textContent = "Carregando tickets...";

  try {
    const { data, error } = await supabaseClient
      .from("tickets")
      .select("id, categoria, assunto, status, created_at")
      .eq("user_id", usuarioAtual.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    lista.replaceChildren();

    if (!data || data.length === 0) {
      lista.textContent = "Você ainda não abriu nenhum ticket.";
      return;
    }

    for (const ticket of data) {
      const cartao = document.createElement("article");
      cartao.className = "ticket";

      const titulo = document.createElement("h3");
      titulo.textContent = ticket.assunto;

      const categoria = document.createElement("p");
      categoria.textContent =
        `Categoria: ${nomeCategoria(ticket.categoria)}`;

      const status = document.createElement("span");
      status.className = `status ${classeStatus(ticket.status)}`;
      status.textContent = nomeStatus(ticket.status);

      const dataCriacao = document.createElement("p");
      dataCriacao.textContent = `Criado em: ${formatarData(ticket.created_at)}`;

      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = "Ver conversa";
      botao.addEventListener("click", () => abrirTicket(ticket.id));

      cartao.append(titulo, categoria, status, dataCriacao, botao);
      lista.appendChild(cartao);
    }
  } catch (erro) {
    lista.textContent = exibirErro(erro, "Erro ao carregar os tickets");
  }
}

function nomeCategoria(categoria) {
  const nomes = {
    compra: "Compra",
    pedido: "Pedido",
    produto: "Produto",
    suporte: "Suporte",
    outro: "Outro"
  };

  return nomes[categoria] ?? "Outro";
}

/* ABRIR CONVERSA */

async function abrirTicket(id) {
  if (!supabaseClient || !usuarioAtual) return;

  try {
    // A consulta também verifica o acesso permitido pelo RLS.
    const { data: ticket, error } = await supabaseClient
      .from("tickets")
      .select("id, user_id, assunto, status, created_at")
      .eq("id", id)
      .eq("user_id", usuarioAtual.id)
      .single();

    if (error) throw error;

    ticketAtual = ticket;

    const titulo = $("#conversa-titulo");
    if (titulo) {
      titulo.textContent =
        `${ticket.assunto} — ${nomeStatus(ticket.status)}`;
    }

    const formulario = $("#form-resposta");
    const campoResposta = $("#resposta-mensagem");
    const ticketFechado = normalizarStatus(ticket.status) === "fechado";

    if (campoResposta) campoResposta.disabled = ticketFechado;

    if (formulario) {
      const botaoEnviar = formulario.querySelector('button[type="submit"]');
      if (botaoEnviar) botaoEnviar.disabled = ticketFechado;
    }

    mostrarMensagem(
      "#mensagem-resposta",
      ticketFechado
        ? "Este ticket está fechado e não aceita novas respostas."
        : ""
    );

    definirVisibilidade("#conversa-ticket", true);
    definirVisibilidade("#form-ticket", false);

    await carregarMensagens(id);

    $("#conversa-ticket")?.scrollIntoView({ behavior: "smooth" });

  } catch (erro) {
    alert(exibirErro(erro, "Não foi possível abrir este ticket"));
  }
}

/* CARREGAR MENSAGENS */

async function carregarMensagens(ticketId) {
  const lista = $("#lista-mensagens");

  if (!lista) return;

  lista.textContent = "Carregando conversa...";

  try {
    const { data, error } = await supabaseClient
      .from("ticket_messages")
      .select("id, ticket_id, user_id, mensagem, created_at")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    lista.replaceChildren();

    if (!data || data.length === 0) {
      lista.textContent = "Nenhuma resposta nesta conversa ainda.";
      return;
    }

    for (const item of data) {
      const cartao = document.createElement("article");
      cartao.className = "mensagem";

      const autor = document.createElement("strong");
      autor.textContent =
        item.user_id === usuarioAtual.id ? "Você" : "Equipe Nexus Select";

      const texto = document.createElement("p");
      texto.textContent = item.mensagem;

      const dataMensagem = document.createElement("small");
      dataMensagem.textContent = formatarData(item.created_at);

      cartao.append(autor, texto, dataMensagem);
      lista.appendChild(cartao);
    }

    lista.scrollTop = lista.scrollHeight;

  } catch (erro) {
    lista.textContent = exibirErro(erro, "Erro ao carregar a conversa");
  }
}

/* ENVIAR RESPOSTA */

async function enviarResposta(evento) {
  evento.preventDefault();

  if (
    !supabaseClient ||
    !usuarioAtual ||
    !ticketAtual ||
    carregando
  ) return;

  if (normalizarStatus(ticketAtual.status) === "fechado") {
    mostrarMensagem(
      "#mensagem-resposta",
      "Este ticket está fechado.",
      "erro"
    );
    return;
  }

  const campo = $("#resposta-mensagem");
  const mensagem = campo?.value.trim();

  if (!mensagem || mensagem.length < 1 || mensagem.length > 3000) {
    mostrarMensagem(
      "#mensagem-resposta",
      "Escreva uma resposta de até 3000 caracteres.",
      "erro"
    );
    return;
  }

  carregando = true;

  try {
    const { error } = await supabaseClient
      .from("ticket_messages")
      .insert({
        ticket_id: ticketAtual.id,
        user_id: usuarioAtual.id,
        mensagem
      });

    if (error) throw error;

    if (campo) campo.value = "";

    mostrarMensagem(
      "#mensagem-resposta",
      "Resposta enviada!",
      "sucesso"
    );

    await carregarMensagens(ticketAtual.id);

  } catch (erro) {
    mostrarMensagem(
      "#mensagem-resposta",
      exibirErro(erro, "Não foi possível enviar a resposta"),
      "erro"
    );
  } finally {
    carregando = false;
  }
}

/* INICIAR QUANDO A PÁGINA ESTIVER PRONTA */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarSistema);
} else {
  iniciarSistema();
}
