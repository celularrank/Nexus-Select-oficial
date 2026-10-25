/* NEXUS SELECT — EXIBIÇÃO DA LOJA */

(() => {
  const DISCORD_URL = "https://discord.gg/UbXGMjhYP";

  // Mantenha true enquanto as vendas de contas estiverem pausadas.
  const CONTAS_VENDAS_PAUSADAS = true;

  const nomesCategorias = {
    contas: "Contas",
    frutas: "Frutas",
    servicos: "Serviços de farm",
    itens: "Espadas e outros itens",
    up: "UP e materiais"
  };

  let categoriaAtual = "todos";

  function dinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function escapar(texto) {
    return String(texto ?? "").replace(
      /[&<>"']/g,
      caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[caractere]
    );
  }

  function criarCard(produto) {
    const contaPausada =
      produto.categoria === "contas" &&
      CONTAS_VENDAS_PAUSADAS;

    const semEstoque =
      Number.isFinite(produto.estoque) &&
      produto.estoque <= 0;

    const indisponivel = contaPausada || semEstoque;

    let textoBotao = "Consultar no Discord";

    if (contaPausada) {
      textoBotao = "Vendas pausadas";
    } else if (semEstoque) {
      textoBotao = "Sem estoque";
    }

    const estoqueTexto = contaPausada
      ? "Vendas temporariamente pausadas"
      : Number.isFinite(produto.estoque)
        ? semEstoque
          ? "Estoque: esgotado"
          : `Estoque: ${produto.estoque}`
        : "Estoque: consulte no Discord";

    const descricao = produto.descricao
      ? `<p class="product-description">${escapar(produto.descricao)}</p>`
      : "";

    const requisitos = produto.requisitos
      ? `<p class="product-requirements">⚠️ ${escapar(produto.requisitos)}</p>`
      : "";

    const unidade = produto.unidade
      ? `<p class="product-unit">${escapar(produto.unidade)}</p>`
      : "";

    const botao = indisponivel
      ? `<span class="product-button disabled">${textoBotao}</span>`
      : `<a class="product-button"
             href="${DISCORD_URL}"
             target="_blank"
             rel="noopener noreferrer">${textoBotao} ↗</a>`;

    return `
      <article
        class="product-card"
        data-produto
        data-id="${escapar(produto.id)}"
        data-categoria="${escapar(produto.categoria)}"
        data-preco="${Number(produto.preco)}"
      >
        <span class="product-category">
          ${escapar(nomesCategorias[produto.categoria] || produto.categoria)}
        </span>

        <h3>${escapar(produto.nome)}</h3>

        ${descricao}
        ${requisitos}

        <p class="product-price">${dinheiro(produto.preco)}</p>
        ${unidade}

        <p class="product-stock ${semEstoque || contaPausada ? "out-of-stock" : ""}">
          ${estoqueTexto}
        </p>

        ${botao}
      </article>
    `;
  }

  function renderizarProdutos() {
    const grade = document.querySelector("#lista-produtos");
    if (!grade) return;

    if (!Array.isArray(window.PRODUTOS)) {
      grade.innerHTML = `
        <p class="empty-message">
          Não foi possível carregar o catálogo.
          Confira se o arquivo produtos.js existe e está salvo corretamente.
        </p>`;
      return;
    }

    const busca = (
      document.querySelector("#busca-produtos")?.value || ""
    ).trim().toLocaleLowerCase("pt-BR");

    const filtroSelect =
      document.querySelector("#filtro-categoria")?.value || "todos";

    const categoria = categoriaAtual !== "todos"
      ? categoriaAtual
      : filtroSelect;

    let produtos = window.PRODUTOS.filter(produto => {
      const texto = [
        produto.nome,
        produto.descricao,
        produto.requisitos,
        nomesCategorias[produto.categoria]
      ].join(" ").toLocaleLowerCase("pt-BR");

      return (
        (categoria === "todos" || produto.categoria === categoria) &&
        texto.includes(busca)
      );
    });

    const ordenacao =
      document.querySelector("#ordenacao")?.value || "padrao";

    if (ordenacao === "menor-preco") {
      produtos.sort((a, b) => a.preco - b.preco);
    } else if (ordenacao === "maior-preco") {
      produtos.sort((a, b) => b.preco - a.preco);
    }

    grade.innerHTML = produtos.length
      ? produtos.map(criarCard).join("")
      : `<p class="empty-message">Nenhum produto encontrado. Tente outra busca.</p>`;

    const contador = document.querySelector("#quantidade-produtos");
    if (contador) {
      contador.textContent =
        `${produtos.length} ${produtos.length === 1 ? "produto" : "produtos"}`;
    }

    const mensagem = document.querySelector("#sem-resultados");
    if (mensagem) mensagem.hidden = produtos.length > 0;
  }

  function iniciar() {
    const grade = document.querySelector("#lista-produtos");
    if (!grade) return;

    const busca = document.querySelector("#busca-produtos");
    const filtro = document.querySelector("#filtro-categoria");
    const ordenacao = document.querySelector("#ordenacao");

    busca?.addEventListener("input", renderizarProdutos);
    filtro?.addEventListener("change", renderizarProdutos);
    ordenacao?.addEventListener("change", renderizarProdutos);

    window.renderizarProdutos = renderizarProdutos;

    window.definirCategoriaProdutos = categoria => {
      categoriaAtual = categoria || "todos";
      renderizarProdutos();
    };

    renderizarProdutos();
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();

