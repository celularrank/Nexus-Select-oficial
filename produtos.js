
/* ======================================
   NEXUS SELECT — CATÁLOGO DE PRODUTOS
   ====================================== */

window.PRODUTOS = [
  // CONTAS
  {
    id: "conta-aleatoria",
    nome: "Conta aleatória",
    categoria: "contas",
    preco: 4.00,
    estoque: 6,
    unidade: "unidade",
    descricao: "Conta aleatória de acordo com a disponibilidade."
  },
  {
    id: "conta-lvl-max",
    nome: "Conta LVL MAX",
    categoria: "contas",
    preco: 7.20,
    estoque: 0,
    unidade: "unidade",
    descricao: "Conta de nível máximo.",
    requisitos: "Consulte a disponibilidade."
  },
  {
    id: "conta-sea-2",
    nome: "Conta Sea 2",
    categoria: "contas",
    preco: 3.40,
    estoque: 5,
    unidade: "unidade",
    descricao: "Conta com acesso ao Segundo Mar."
  },
  {
    id: "conta-sea-3",
    nome: "Conta Sea 3",
    categoria: "contas",
    preco: 6.00,
    estoque: 5,
    unidade: "unidade",
    descricao: "Conta com acesso ao Terceiro Mar."
  },

  // FRUTAS
  {
    id: "fruta-mistica-lendaria",
    nome: "Fruta Mística / Lendária",
    categoria: "frutas",
    preco: 6.30,
    estoque: 17,
    unidade: "unidade",
    descricao: "Consulte as frutas disponíveis no Discord."
  },

  // ESTILOS DE LUTA
  {
    id: "superhuman",
    nome: "SuperHuman",
    categoria: "servicos",
    preco: 8.00,
    descricao: "Consulte os requisitos antes de comprar."
  },
  {
    id: "death-step",
    nome: "Death Step",
    categoria: "servicos",
    preco: 5.00
  },
  {
    id: "sharkman-karate",
    nome: "Sharkman Karate",
    categoria: "servicos",
    preco: 5.00
  },
  {
    id: "electric-claw",
    nome: "Electric Claw",
    categoria: "servicos",
    preco: 5.00
  },
  {
    id: "dragon-talon",
    nome: "Dragon Talon",
    categoria: "servicos",
    preco: 10.00
  },
  {
    id: "god-human",
    nome: "God Human",
    categoria: "servicos",
    preco: 20.00
  },
  {
    id: "sanguine-art",
    nome: "Sanguine Art",
    categoria: "servicos",
    preco: 30.00,
    descricao: "Coração + material."
  },
  {
    id: "material-sanguine",
    nome: "Somente material Sanguine",
    categoria: "servicos",
    preco: 10.00
  },

  // ESPADAS
  {
    id: "cdk",
    nome: "CDK",
    categoria: "itens",
    preco: 25.00,
    requisitos: "Tenha Yama e Tushita."
  },
  {
    id: "tushita",
    nome: "Tushita",
    categoria: "itens",
    preco: 15.00
  },
  {
    id: "yama",
    nome: "Yama",
    categoria: "itens",
    preco: 10.00
  },
  {
    id: "ttk-completa",
    nome: "TTK",
    categoria: "itens",
    preco: 30.00
  },
  {
    id: "ttk-maestria",
    nome: "TTK com 2x Maestria",
    categoria: "itens",
    preco: 10.00
  },
  {
    id: "espada-ttk-individual",
    nome: "Cada espada TTK",
    categoria: "itens",
    preco: 9.00
  },
  {
    id: "mini-yoru",
    nome: "Mini Yoru",
    categoria: "itens",
    preco: 50.00,
    requisitos: "Obrigatório ter os Haki."
  },
  {
    id: "mini-yoru-drop",
    nome: "Mini Yoru com 2x Drop",
    categoria: "itens",
    preco: 40.00,
    requisitos: "Consulte os requisitos no Discord."
  },
  {
    id: "foice-sagrada",
    nome: "Foice Sagrada",
    categoria: "itens",
    preco: 10.00
  },
  {
    id: "spikey-trident",
    nome: "Spikey Trident",
    categoria: "itens",
    preco: 8.00
  },
  {
    id: "pole-v1-v2",
    nome: "Pole V1 e V2",
    categoria: "itens",
    preco: 10.00
  },
  {
    id: "shark-anchor",
    nome: "Shark Anchor",
    categoria: "itens",
    preco: 20.00
  },
  {
    id: "fox-lamp",
    nome: "Fox Lamp",
    categoria: "itens",
    preco: 30.00
  },
  {
    id: "dragon-heart",
    nome: "Dragon Heart",
    categoria: "itens",
    preco: 20.00,
    requisitos: "Obrigatório ter Draco."
  },
  {
    id: "yoru-v2",
    nome: "Yoru V2",
    categoria: "itens",
    preco: 15.00
  },
  {
    id: "yoru-v3",
    nome: "Yoru V3",
    categoria: "itens",
    preco: 50.00
  },

  // SOUL GUITAR
  {
    id: "soul-guitar",
    nome: "Soul Guitar",
    categoria: "itens",
    preco: 20.00
  },

  // RAÇAS V4
  {
    id: "engrenagem-v4",
    nome: "1 Engrenagem V4",
    categoria: "up",
    preco: 15.00
  },
  {
    id: "raca-v4-1",
    nome: "1 Raça V4 Full",
    categoria: "up",
    preco: 40.00,
    requisitos: "Não inclui a raça Draco."
  },
  {
    id: "raca-v4-2",
    nome: "2 Raças V4 Full",
    categoria: "up",
    preco: 75.00,
    requisitos: "Não inclui a raça Draco."
  },
  {
    id: "raca-v4-3",
    nome: "3 Raças V4 Full",
    categoria: "up",
    preco: 110.00,
    requisitos: "Não inclui a raça Draco."
  },

  // UP E MATERIAIS
  {
    id: "beli",
    nome: "Beli — 1M",
    categoria: "up",
    preco: 1.00,
    unidade: "por 1 milhão de Beli"
  },
  {
    id: "maestria",
    nome: "Maestria — 100",
    categoria: "up",
    preco: 5.00,
    unidade: "por 100 de maestria"
  },
  {
    id: "fragmentos",
    nome: "Fragmentos — 1K",
    categoria: "up",
    preco: 1.00,
    unidade: "por 1.000 fragmentos"
  }
];
