
/* NEXUS SELECT — PÁGINAS DE CATEGORIA */

document.addEventListener("DOMContentLoaded", () => {
  const categorias = {
    contas: {
      titulo: "Contas",
      etiqueta: "CONTAS",
      descricao: "Consulte os tipos de contas e a disponibilidade atual."
    },
    frutas: {
      titulo: "Frutas",
      etiqueta: "FRUTAS",
      descricao: "Confira as frutas místicas e lendárias cadastradas."
    },
    servicos: {
      titulo: "Estilos de luta",
      etiqueta: "SERVIÇOS",
      descricao: "Consulte os estilos de luta e os requisitos de cada serviço."
    },
    itens: {
      titulo: "Espadas e itens",
      etiqueta: "ITENS",
      descricao: "Confira espadas, Soul Guitar e outros itens."
    },
    up: {
      titulo: "UP e materiais",
      etiqueta: "UP",
      descricao: "Consulte Beli, maestria, fragmentos e serviços de Raça V4."
    }
  };

  const parametros = new URLSearchParams(window.location.search);
  const tipo = parametros.get("tipo") || "";
  const categoria = categorias[tipo];

  const titulo = document.querySelector("#categoria-titulo");
  const etiqueta = document.querySelector("#categoria-etiqueta");
  const descricao = document.querySelector("#categoria-descricao");
  const tituloLista = document.querySelector("#titulo-lista");

  if (!categoria) {
    if (titulo) {
      titulo.textContent = "Categoria não encontrada";
    }

    if (etiqueta) {
      etiqueta.textContent = "NEXUS SELECT";
    }

    if (descricao) {
      descricao.textContent =
        "Escolha uma categoria na loja para visualizar os produtos.";
    }

    if (tituloLista) {
      tituloLista.textContent = "Volte para a loja";
    }

    const grade = document.querySelector("#lista-produtos");

    if (grade) {
      grade.innerHTML = `
        <p class="empty-message">
          Essa categoria não existe.
          <a class="text-link" href="loja.html">Voltar para a loja</a>
        </p>`;
    }

    return;
  }

  document.title = `${categoria.titulo} | Nexus Select`;

  if (titulo) {
    titulo.innerHTML =
      `${categoria.titulo} <span class="gradient-text">Nexus.</span>`;
  }

  if (etiqueta) {
    etiqueta.textContent = categoria.etiqueta;
  }

  if (descricao) {
    descricao.textContent = categoria.descricao;
  }

  if (tituloLista) {
    tituloLista.textContent = categoria.titulo;
  }

  if (typeof window.definirCategoriaProdutos === "function") {
    window.definirCategoriaProdutos(tipo);
  } else {
    const grade = document.querySelector("#lista-produtos");

    if (grade) {
      grade.innerHTML = `
        <p class="empty-message">
          Não foi possível carregar os produtos.
          Confira se loja.js está carregando corretamente.
        </p>`;
    }
  }
});
