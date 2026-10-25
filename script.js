
/* ==================================
   NEXUS SELECT — SCRIPT PRINCIPAL
   ================================== */

document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarBusca();
  iniciarFiltros();
  iniciarCategorias();
  atualizarAno();
});

/* MENU E LINKS */

function iniciarMenu() {
  const links = document.querySelectorAll(".nav-link");
  const paginaAtual = window.location.pathname.split("/").pop();

  links.forEach((link) => {
    const destino = link.getAttribute("href");

    if (
      destino &&
      destino.split("?")[0] === paginaAtual
    ) {
      link.classList.add("active");
    }
  });
}

/* BUSCA DE PRODUTOS */

function iniciarBusca() {
  const campoBusca = document.querySelector(
    "#busca-produtos, #search-input, [data-search]"
  );

  if (!campoBusca) return;

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value
      .trim()
      .toLocaleLowerCase("pt-BR");

    const produtos = document.querySelectorAll(
      "[data-produto], .product-card"
    );

    produtos.forEach((produto) => {
      const texto = produto.textContent
        .toLocaleLowerCase("pt-BR");

      const corresponde = texto.includes(termo);

      produto.hidden = !corresponde;
    });

    const mensagem = document.querySelector(
      "#sem-resultados"
    );

    if (mensagem) {
      const encontrou = [...produtos].some(
        (produto) => !produto.hidden
      );

      mensagem.hidden = encontrou;
    }
  });
}

/* FILTROS E ORDENAÇÃO */

function iniciarFiltros() {
  const filtroCategoria = document.querySelector(
    "#filtro-categoria"
  );

  const ordenacao = document.querySelector(
    "#ordenacao"
  );

  const grade = document.querySelector(
    "#lista-produtos"
  );

  if (!grade) return;

  const aplicarFiltros = () => {
    const produtos = [
      ...grade.querySelectorAll(
        "[data-produto], .product-card"
      )
    ];

    const categoriaSelecionada =
      filtroCategoria?.value || "todos";

    produtos.forEach((produto) => {
      const categoria = (
        produto.dataset.categoria || ""
      ).toLowerCase();

      const corresponde =
        categoriaSelecionada === "todos" ||
        categoria === categoriaSelecionada;

      produto.hidden = !corresponde;
    });

    if (ordenacao) {
      const modo = ordenacao.value;

      produtos.sort((a, b) => {
        const precoA = Number(a.dataset.preco);
        const precoB = Number(b.dataset.preco);

        if (modo === "menor-preco") {
          return precoA - precoB;
        }

        if (modo === "maior-preco") {
          return precoB - precoA;
        }

        return 0;
      });

      produtos.forEach((produto) => {
        grade.appendChild(produto);
      });
    }
  };

  filtroCategoria?.addEventListener(
    "change",
    aplicarFiltros
  );

  ordenacao?.addEventListener(
    "change",
    aplicarFiltros
  );
}

/* LINKS DAS CATEGORIAS */

function iniciarCategorias() {
  const botoes = document.querySelectorAll(
    "[data-categoria-link]"
  );

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const tipo = botao.dataset.categoriaLink;

      if (!tipo) return;

      window.location.href =
        "categoria.html?tipo=" +
        encodeURIComponent(tipo);
    });
  });
}

/* ANO AUTOMÁTICO NO RODAPÉ */

function atualizarAno() {
  const elemento = document.querySelector("#ano-atual");

  if (elemento) {
    elemento.textContent = new Date().getFullYear();
  }
}
