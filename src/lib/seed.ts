import { prisma } from "@/lib/prisma";
import type {
  Alergeno,
  Conservacao,
  Origem,
  UnidadeVenda,
} from "@/generated/prisma/enums";

type CategoriaSeed = {
  slug: string;
  nome: string;
  diasValidadeMinimos: number;
};

const categorias: CategoriaSeed[] = [
  { slug: "molhos-temperos", nome: "Molhos e Temperos", diasValidadeMinimos: 30 },
  { slug: "massas-arroz", nome: "Massas e Arroz", diasValidadeMinimos: 20 },
  { slug: "conservas-enlatados", nome: "Conservas e Enlatados", diasValidadeMinimos: 20 },
  { slug: "snacks-doces", nome: "Snacks e Doces", diasValidadeMinimos: 15 },
  { slug: "bebidas", nome: "Bebidas", diasValidadeMinimos: 15 },
  { slug: "frescos", nome: "Frescos e Refrigerados", diasValidadeMinimos: 3 },
  { slug: "congelados", nome: "Congelados", diasValidadeMinimos: 10 },
  { slug: "kits-combos", nome: "Kits e Combos", diasValidadeMinimos: 15 },
];

type VariacaoSeed = {
  tipo: UnidadeVenda;
  nome: string;
  skuVariacao: string;
  precoCentavos: number;
  unidadesConsumidas?: number;
};

type ProdutoSeed = {
  sku: string;
  nomeOriginal: string;
  nomePt: string;
  slug: string;
  descricao: string;
  categoriaSlug: string;
  origem: Origem;
  conservacao: Conservacao;
  ingredientes: string;
  tabelaNutricional: Record<string, string>;
  origemImportador: string;
  numeroRegistro?: string;
  pesoVariavel?: boolean;
  pesoNominalGramas?: number;
  alergenos?: Alergeno[];
  apelidos?: string[];
  variacoes: VariacaoSeed[];
  lote: { codigoLote: string; quantidade: number; validadeDias: number; custoCentavos: number };
};

const porcao100g = (
  porcao: string,
  extras: Record<string, string>,
): Record<string, string> => ({
  porcao,
  ...extras,
});

const produtos: ProdutoSeed[] = [
  // --- Japonesa -------------------------------------------------------
  {
    sku: "JP-MOL-001",
    nomeOriginal: "醤油",
    nomePt: "Molho de Soja Shoyu",
    slug: "molho-de-soja-shoyu-150ml",
    descricao: "Molho de soja tradicional japonês, fermentado naturalmente.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Água, soja, trigo, sal, açúcar.",
    tabelaNutricional: porcao100g("15ml", { calorias: "10kcal", sodio: "1000mg" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA", "GLUTEN"],
    apelidos: ["shoyu", "molho de soja", "soy sauce"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 150ml", skuVariacao: "JP-MOL-001-UN", precoCentavos: 1290 },
      { tipo: "CAIXA", nome: "Caixa fechada (12un)", skuVariacao: "JP-MOL-001-CX", precoCentavos: 13900, unidadesConsumidas: 12 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 240, validadeDias: 540, custoCentavos: 650 },
  },
  {
    sku: "JP-MOL-002",
    nomeOriginal: "白味噌",
    nomePt: "Missô Branco (Shiro Miso)",
    slug: "misso-branco-shiro-miso-300g",
    descricao: "Pasta fermentada de soja, base para missoshiru e marinadas.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "RESFRIADO",
    ingredientes: "Soja, arroz, sal, fermento koji.",
    tabelaNutricional: porcao100g("15g", { calorias: "35kcal", sodio: "700mg" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA"],
    apelidos: ["miso", "missô", "shiro miso"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 300g", skuVariacao: "JP-MOL-002-UN", precoCentavos: 2490 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 90, validadeDias: 120, custoCentavos: 1400 },
  },
  {
    sku: "JP-ALG-001",
    nomeOriginal: "海苔",
    nomePt: "Alga Nori para Sushi",
    slug: "alga-nori-para-sushi-10-folhas",
    descricao: "Folhas de alga tostada, ideais para sushi e temaki.",
    categoriaSlug: "conservas-enlatados",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Alga marinha (nori).",
    tabelaNutricional: porcao100g("3g (1 folha)", { calorias: "10kcal" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    apelidos: ["nori", "alga para sushi"],
    variacoes: [
      { tipo: "PACOTE", nome: "Pacote com 10 folhas", skuVariacao: "JP-ALG-001-PC", precoCentavos: 1890 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 150, validadeDias: 365, custoCentavos: 950 },
  },
  {
    sku: "JP-ARR-001",
    nomeOriginal: "寿司米",
    nomePt: "Arroz para Sushi",
    slug: "arroz-para-sushi-1kg",
    descricao: "Arroz japonês de grão curto, ideal para sushi e onigiri.",
    categoriaSlug: "massas-arroz",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Arroz japonês (Japonica).",
    tabelaNutricional: porcao100g("100g cru", { calorias: "358kcal", carboidratos: "80g" }),
    origemImportador: "Nacional — cultivado no Brasil, beneficiado por Distribuidora Oriental Ltda.",
    apelidos: ["gohan", "arroz japones", "arroz sushi"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 1kg", skuVariacao: "JP-ARR-001-UN", precoCentavos: 1690 },
      { tipo: "CAIXA", nome: "Caixa fechada (10un)", skuVariacao: "JP-ARR-001-CX", precoCentavos: 15900, unidadesConsumidas: 10 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 300, validadeDias: 365, custoCentavos: 900 },
  },
  {
    sku: "JP-VIN-001",
    nomeOriginal: "米酢",
    nomePt: "Vinagre de Arroz",
    slug: "vinagre-de-arroz-500ml",
    descricao: "Vinagre suave de arroz fermentado, usado no tempero do sushi.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Arroz fermentado, água.",
    tabelaNutricional: porcao100g("15ml", { calorias: "5kcal" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    apelidos: ["su", "vinagre de arroz"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 500ml", skuVariacao: "JP-VIN-001-UN", precoCentavos: 1990 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 120, validadeDias: 540, custoCentavos: 1100 },
  },
  {
    sku: "JP-WAS-001",
    nomeOriginal: "わさび",
    nomePt: "Wasabi em Pasta",
    slug: "wasabi-em-pasta-43g",
    descricao: "Pasta picante de wasabi pronta para consumo, em bisnaga.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Raiz-forte, wasabi em pó, corante natural, óleo vegetal.",
    tabelaNutricional: porcao100g("5g", { calorias: "15kcal" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    apelidos: ["wasabi"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Bisnaga 43g", skuVariacao: "JP-WAS-001-UN", precoCentavos: 1590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 100, validadeDias: 365, custoCentavos: 800 },
  },
  {
    sku: "JP-GAR-001",
    nomeOriginal: "ガリ",
    nomePt: "Gengibre em Conserva (Gari)",
    slug: "gengibre-em-conserva-gari-100g",
    descricao: "Fatias de gengibre em conserva agridoce, tradicional acompanhamento de sushi.",
    categoriaSlug: "frescos",
    origem: "JAPONESA",
    conservacao: "RESFRIADO",
    ingredientes: "Gengibre, vinagre, açúcar, sal.",
    tabelaNutricional: porcao100g("15g", { calorias: "20kcal" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    apelidos: ["gari", "gengibre sushi"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 100g", skuVariacao: "JP-GAR-001-UN", precoCentavos: 1290 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 60, validadeDias: 60, custoCentavos: 650 },
  },
  {
    sku: "JP-SOP-001",
    nomeOriginal: "味噌汁",
    nomePt: "Missoshiru Instantâneo",
    slug: "missoshiru-instantaneo-sachês",
    descricao: "Sopa de missô instantânea, caixa com 8 sachês individuais.",
    categoriaSlug: "conservas-enlatados",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Pasta de missô, tofu desidratado, alga wakame, cebolinha desidratada.",
    tabelaNutricional: porcao100g("1 sachê (10g)", { calorias: "30kcal", sodio: "850mg" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA"],
    apelidos: ["sopa de miso", "missoshiru"],
    variacoes: [
      { tipo: "PACOTE", nome: "Caixa com 8 sachês", skuVariacao: "JP-SOP-001-PC", precoCentavos: 1790 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 80, validadeDias: 270, custoCentavos: 950 },
  },
  {
    sku: "JP-MAC-001",
    nomeOriginal: "うどん",
    nomePt: "Macarrão Udon Fresco",
    slug: "macarrao-udon-fresco-200g",
    descricao: "Macarrão de trigo grosso e macio, tradicional da culinária japonesa.",
    categoriaSlug: "frescos",
    origem: "JAPONESA",
    conservacao: "RESFRIADO",
    ingredientes: "Farinha de trigo, água, sal.",
    tabelaNutricional: porcao100g("200g", { calorias: "270kcal", carboidratos: "55g" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN"],
    apelidos: ["udon"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 200g", skuVariacao: "JP-MAC-001-UN", precoCentavos: 1490 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 70, validadeDias: 20, custoCentavos: 800 },
  },
  {
    sku: "JP-MAC-002",
    nomeOriginal: "蕎麦",
    nomePt: "Macarrão Soba",
    slug: "macarrao-soba-250g",
    descricao: "Macarrão fino de trigo sarraceno, servido quente ou frio.",
    categoriaSlug: "massas-arroz",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Farinha de trigo sarraceno, farinha de trigo, sal.",
    tabelaNutricional: porcao100g("100g", { calorias: "340kcal", carboidratos: "70g" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN"],
    apelidos: ["soba"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 250g", skuVariacao: "JP-MAC-002-UN", precoCentavos: 1890 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 90, validadeDias: 300, custoCentavos: 1100 },
  },
  {
    sku: "JP-DAS-001",
    nomeOriginal: "だし",
    nomePt: "Dashi em Pó",
    slug: "dashi-em-po-8gx5",
    descricao: "Caldo base à base de peixe bonito seco, para sopas e molhos.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Extrato de bonito seco, sal, açúcar, glutamato monossódico.",
    tabelaNutricional: porcao100g("1 sachê (8g)", { calorias: "20kcal", sodio: "1900mg" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    alergenos: ["PEIXE"],
    apelidos: ["dashi", "hondashi", "caldo de peixe"],
    variacoes: [
      { tipo: "PACOTE", nome: "Caixa com 5 sachês", skuVariacao: "JP-DAS-001-PC", precoCentavos: 1590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 100, validadeDias: 400, custoCentavos: 850 },
  },
  {
    sku: "JP-PAN-001",
    nomeOriginal: "パン粉",
    nomePt: "Farinha Panko",
    slug: "farinha-panko-300g",
    descricao: "Farinha de rosca japonesa, leve e crocante, ideal para empanados.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Farinha de trigo, fermento, sal.",
    tabelaNutricional: porcao100g("30g", { calorias: "110kcal" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN"],
    apelidos: ["panko", "farinha de rosca japonesa"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 300g", skuVariacao: "JP-PAN-001-UN", precoCentavos: 1290 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 110, validadeDias: 300, custoCentavos: 650 },
  },
  {
    sku: "JP-PEI-001",
    nomeOriginal: "サーモン刺身",
    nomePt: "Salmão Fatiado para Sashimi",
    slug: "salmao-fatiado-sashimi",
    descricao: "Salmão fatiado grade sashimi, congelado para preservar frescor. Peso aproximado, ajustado na separação.",
    categoriaSlug: "congelados",
    origem: "JAPONESA",
    conservacao: "CONGELADO",
    ingredientes: "Salmão (Salmo salar).",
    tabelaNutricional: porcao100g("100g", { calorias: "208kcal", proteinas: "20g" }),
    origemImportador: "Importado do Chile — Distribuidora Oriental Ltda.",
    numeroRegistro: "SIF 4321",
    pesoVariavel: true,
    pesoNominalGramas: 300,
    alergenos: ["PEIXE"],
    apelidos: ["salmao sashimi", "sake"],
    variacoes: [
      { tipo: "PACOTE", nome: "Bandeja ~300g", skuVariacao: "JP-PEI-001-PC", precoCentavos: 4990 },
    ],
    lote: { codigoLote: "L2026F", quantidade: 40, validadeDias: 90, custoCentavos: 2800 },
  },
  {
    sku: "JP-PEI-002",
    nomeOriginal: "マグロ刺身",
    nomePt: "Atum Fatiado para Sashimi",
    slug: "atum-fatiado-sashimi",
    descricao: "Atum fatiado grade sashimi, congelado. Peso aproximado, ajustado na separação.",
    categoriaSlug: "congelados",
    origem: "JAPONESA",
    conservacao: "CONGELADO",
    ingredientes: "Atum (Thunnus).",
    tabelaNutricional: porcao100g("100g", { calorias: "144kcal", proteinas: "23g" }),
    origemImportador: "Importado do Sri Lanka — Distribuidora Oriental Ltda.",
    numeroRegistro: "SIF 4321",
    pesoVariavel: true,
    pesoNominalGramas: 250,
    alergenos: ["PEIXE"],
    apelidos: ["atum sashimi", "maguro"],
    variacoes: [
      { tipo: "PACOTE", nome: "Bandeja ~250g", skuVariacao: "JP-PEI-002-PC", precoCentavos: 5990 },
    ],
    lote: { codigoLote: "L2026F", quantidade: 35, validadeDias: 90, custoCentavos: 3400 },
  },
  {
    sku: "JP-CHA-001",
    nomeOriginal: "抹茶",
    nomePt: "Chá Verde Matcha em Pó",
    slug: "cha-verde-matcha-em-po-40g",
    descricao: "Chá verde japonês em pó fino, para bebidas e doces.",
    categoriaSlug: "bebidas",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Folhas de chá verde moídas (matcha).",
    tabelaNutricional: porcao100g("2g", { calorias: "5kcal" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    apelidos: ["matcha", "cha verde"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Lata 40g", skuVariacao: "JP-CHA-001-UN", precoCentavos: 3990 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 60, validadeDias: 365, custoCentavos: 2200 },
  },
  {
    sku: "JP-FUR-001",
    nomeOriginal: "ふりかけ",
    nomePt: "Furikake Sabor Salmão",
    slug: "furikake-sabor-salmao-50g",
    descricao: "Tempero seco para arrematar arroz, com gergelim, alga e salmão desidratado.",
    categoriaSlug: "molhos-temperos",
    origem: "JAPONESA",
    conservacao: "SECO",
    ingredientes: "Gergelim, alga nori, salmão desidratado, sal, açúcar.",
    tabelaNutricional: porcao100g("5g", { calorias: "20kcal" }),
    origemImportador: "Importado do Japão — Distribuidora Oriental Ltda.",
    alergenos: ["PEIXE", "GERGELIM"],
    apelidos: ["furikake"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 50g", skuVariacao: "JP-FUR-001-UN", precoCentavos: 1690 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 90, validadeDias: 300, custoCentavos: 900 },
  },
  {
    sku: "JP-TOF-001",
    nomeOriginal: "豆腐",
    nomePt: "Tofu Fresco",
    slug: "tofu-fresco-300g",
    descricao: "Tofu tradicional à base de soja, textura firme, ideal para missoshiru e saladas.",
    categoriaSlug: "frescos",
    origem: "JAPONESA",
    conservacao: "RESFRIADO",
    ingredientes: "Água, soja, coagulante natural (nigari).",
    tabelaNutricional: porcao100g("100g", { calorias: "76kcal", proteinas: "8g" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    alergenos: ["SOJA"],
    apelidos: ["tofu"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 300g", skuVariacao: "JP-TOF-001-UN", precoCentavos: 990 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 50, validadeDias: 15, custoCentavos: 500 },
  },
  {
    sku: "JP-GYO-001",
    nomeOriginal: "餃子",
    nomePt: "Gyoza de Frango Congelado",
    slug: "gyoza-de-frango-congelado-300g",
    descricao: "Guioza recheado de frango e legumes, pronto para fritar ou cozinhar no vapor.",
    categoriaSlug: "congelados",
    origem: "JAPONESA",
    conservacao: "CONGELADO",
    ingredientes: "Farinha de trigo, frango, repolho, cebolinha, molho de soja, alho, gengibre.",
    tabelaNutricional: porcao100g("100g (5un)", { calorias: "210kcal" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN", "SOJA"],
    apelidos: ["gyoza", "guioza"],
    variacoes: [
      { tipo: "PACOTE", nome: "Pacote 300g (20un)", skuVariacao: "JP-GYO-001-PC", precoCentavos: 2990 },
    ],
    lote: { codigoLote: "L2026F", quantidade: 60, validadeDias: 180, custoCentavos: 1600 },
  },

  // --- Coreana ----------------------------------------------------------
  {
    sku: "KR-MOL-001",
    nomeOriginal: "고추장",
    nomePt: "Pasta de Pimenta Gochujang",
    slug: "pasta-de-pimenta-gochujang-500g",
    descricao: "Pasta fermentada picante e levemente doce, base da culinária coreana.",
    categoriaSlug: "molhos-temperos",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Pimenta coreana, arroz glutinoso, soja fermentada, sal.",
    tabelaNutricional: porcao100g("15g", { calorias: "35kcal", sodio: "500mg" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA"],
    apelidos: ["gochujang", "pasta de pimenta coreana"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 500g", skuVariacao: "KR-MOL-001-UN", precoCentavos: 2990 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 100, validadeDias: 400, custoCentavos: 1600 },
  },
  {
    sku: "KR-KIM-001",
    nomeOriginal: "배추김치",
    nomePt: "Kimchi de Acelga Chinesa",
    slug: "kimchi-de-acelga-chinesa-400g",
    descricao: "Acelga fermentada com tempero picante tradicional coreano.",
    categoriaSlug: "frescos",
    origem: "COREANA",
    conservacao: "RESFRIADO",
    ingredientes: "Acelga chinesa, pimenta coreana, alho, gengibre, molho de peixe, sal.",
    tabelaNutricional: porcao100g("100g", { calorias: "30kcal", sodio: "700mg" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    alergenos: ["PEIXE"],
    apelidos: ["kimchi"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 400g", skuVariacao: "KR-KIM-001-UN", precoCentavos: 2490 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 45, validadeDias: 45, custoCentavos: 1300 },
  },
  {
    sku: "KR-MOL-002",
    nomeOriginal: "진간장",
    nomePt: "Molho de Soja Coreano (Jin Ganjang)",
    slug: "molho-de-soja-coreano-jin-ganjang-500ml",
    descricao: "Molho de soja coreano, mais encorpado que o shoyu japonês.",
    categoriaSlug: "molhos-temperos",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Água, soja, trigo, sal.",
    tabelaNutricional: porcao100g("15ml", { calorias: "10kcal", sodio: "1050mg" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA", "GLUTEN"],
    apelidos: ["ganjang", "molho de soja coreano"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 500ml", skuVariacao: "KR-MOL-002-UN", precoCentavos: 2290 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 80, validadeDias: 540, custoCentavos: 1200 },
  },
  {
    sku: "KR-OLE-001",
    nomeOriginal: "참기름",
    nomePt: "Óleo de Gergelim Coreano",
    slug: "oleo-de-gergelim-coreano-320ml",
    descricao: "Óleo de gergelim torrado, usado para finalizar pratos coreanos.",
    categoriaSlug: "molhos-temperos",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Óleo de gergelim torrado 100%.",
    tabelaNutricional: porcao100g("5ml", { calorias: "40kcal" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    alergenos: ["GERGELIM"],
    apelidos: ["chamgireum", "oleo de gergelim"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 320ml", skuVariacao: "KR-OLE-001-UN", precoCentavos: 3490 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 55, validadeDias: 400, custoCentavos: 1900 },
  },
  {
    sku: "KR-MAC-001",
    nomeOriginal: "당면",
    nomePt: "Macarrão de Batata-doce (Japchae)",
    slug: "macarrao-de-batata-doce-japchae-500g",
    descricao: "Macarrão transparente feito de batata-doce, base do prato Japchae.",
    categoriaSlug: "massas-arroz",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Amido de batata-doce, água.",
    tabelaNutricional: porcao100g("100g", { calorias: "340kcal", carboidratos: "84g" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    apelidos: ["japchae", "glass noodles", "macarrao coreano"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 500g", skuVariacao: "KR-MAC-001-UN", precoCentavos: 2790 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 70, validadeDias: 365, custoCentavos: 1500 },
  },
  {
    sku: "KR-LAM-001",
    nomeOriginal: "신라면",
    nomePt: "Lámen Coreano Picante",
    slug: "lamen-coreano-picante-shin-ramyun",
    descricao: "Macarrão instantâneo apimentado, o mais famoso lámen coreano.",
    categoriaSlug: "massas-arroz",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Farinha de trigo, óleo de palma, tempero picante, extrato de camarão.",
    tabelaNutricional: porcao100g("120g", { calorias: "500kcal", sodio: "1790mg" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN", "CRUSTACEOS"],
    apelidos: ["shin ramyun", "lamen coreano", "ramyun"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote unitário", skuVariacao: "KR-LAM-001-UN", precoCentavos: 990 },
      { tipo: "CAIXA", nome: "Caixa fechada (20un)", skuVariacao: "KR-LAM-001-CX", precoCentavos: 17900, unidadesConsumidas: 20 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 200, validadeDias: 300, custoCentavos: 550 },
  },
  {
    sku: "KR-MOL-003",
    nomeOriginal: "된장",
    nomePt: "Pasta de Soja Coreana (Doenjang)",
    slug: "pasta-de-soja-coreana-doenjang-500g",
    descricao: "Pasta de soja fermentada, sabor mais intenso que o missô japonês.",
    categoriaSlug: "molhos-temperos",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Soja fermentada, sal.",
    tabelaNutricional: porcao100g("15g", { calorias: "30kcal" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA"],
    apelidos: ["doenjang"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 500g", skuVariacao: "KR-MOL-003-UN", precoCentavos: 2690 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 65, validadeDias: 365, custoCentavos: 1450 },
  },
  {
    sku: "KR-TTE-001",
    nomeOriginal: "떡볶이 떡",
    nomePt: "Bolinho de Arroz para Tteokbokki",
    slug: "bolinho-de-arroz-tteokbokki-500g",
    descricao: "Bolinhos de arroz cilíndricos congelados, base do prato Tteokbokki.",
    categoriaSlug: "congelados",
    origem: "COREANA",
    conservacao: "CONGELADO",
    ingredientes: "Farinha de arroz, água, sal.",
    tabelaNutricional: porcao100g("100g", { calorias: "220kcal", carboidratos: "50g" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    apelidos: ["tteok", "tteokbokki", "bolinho de arroz coreano"],
    variacoes: [
      { tipo: "PACOTE", nome: "Pacote 500g", skuVariacao: "KR-TTE-001-PC", precoCentavos: 2390 },
    ],
    lote: { codigoLote: "L2026F", quantidade: 50, validadeDias: 180, custoCentavos: 1300 },
  },
  {
    sku: "KR-ALG-001",
    nomeOriginal: "김",
    nomePt: "Algas Marinhas Secas Coreanas (Gim)",
    slug: "algas-marinhas-secas-coreanas-gim-20g",
    descricao: "Algas temperadas com óleo de gergelim e sal, para petiscar ou acompanhar arroz.",
    categoriaSlug: "snacks-doces",
    origem: "COREANA",
    conservacao: "SECO",
    ingredientes: "Alga marinha, óleo de gergelim, sal.",
    tabelaNutricional: porcao100g("5g", { calorias: "15kcal" }),
    origemImportador: "Importado da Coreia do Sul — Distribuidora Oriental Ltda.",
    alergenos: ["GERGELIM"],
    apelidos: ["gim", "alga coreana"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 20g", skuVariacao: "KR-ALG-001-UN", precoCentavos: 1190 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 120, validadeDias: 240, custoCentavos: 600 },
  },

  // --- Chinesa ------------------------------------------------------------
  {
    sku: "CN-MOL-001",
    nomeOriginal: "蚝油",
    nomePt: "Molho de Ostra",
    slug: "molho-de-ostra-510g",
    descricao: "Molho encorpado à base de extrato de ostra, clássico da culinária chinesa.",
    categoriaSlug: "molhos-temperos",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Extrato de ostra, açúcar, sal, amido, molho de soja.",
    tabelaNutricional: porcao100g("15g", { calorias: "25kcal", sodio: "800mg" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA"],
    apelidos: ["oyster sauce", "molho de ostra"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 510g", skuVariacao: "CN-MOL-001-UN", precoCentavos: 2190 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 90, validadeDias: 450, custoCentavos: 1200 },
  },
  {
    sku: "CN-OLE-001",
    nomeOriginal: "芝麻油",
    nomePt: "Óleo de Gergelim Torrado",
    slug: "oleo-de-gergelim-torrado-210ml",
    descricao: "Óleo aromático usado para finalizar pratos e frituras rápidas (stir-fry).",
    categoriaSlug: "molhos-temperos",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Óleo de gergelim torrado.",
    tabelaNutricional: porcao100g("5ml", { calorias: "40kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    alergenos: ["GERGELIM"],
    apelidos: ["oleo de gergelim chines"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 210ml", skuVariacao: "CN-OLE-001-UN", precoCentavos: 2590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 70, validadeDias: 400, custoCentavos: 1400 },
  },
  {
    sku: "CN-MAC-001",
    nomeOriginal: "面条",
    nomePt: "Macarrão Lámen Chinês",
    slug: "macarrao-lamen-chines-400g",
    descricao: "Macarrão de trigo fresco, base de diversas sopas e pratos salteados chineses.",
    categoriaSlug: "massas-arroz",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Farinha de trigo, água, sal, corante natural (cúrcuma).",
    tabelaNutricional: porcao100g("100g", { calorias: "350kcal", carboidratos: "72g" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN"],
    apelidos: ["lamen chines", "mian"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 400g", skuVariacao: "CN-MAC-001-UN", precoCentavos: 1690 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 100, validadeDias: 300, custoCentavos: 900 },
  },
  {
    sku: "CN-COG-001",
    nomeOriginal: "香菇",
    nomePt: "Cogumelo Shiitake Desidratado",
    slug: "cogumelo-shiitake-desidratado-100g",
    descricao: "Cogumelos shiitake secos, para reidratar em sopas e refogados.",
    categoriaSlug: "conservas-enlatados",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Cogumelo shiitake desidratado.",
    tabelaNutricional: porcao100g("10g", { calorias: "30kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    apelidos: ["shiitake", "cogumelo chines"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 100g", skuVariacao: "CN-COG-001-UN", precoCentavos: 2990 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 60, validadeDias: 500, custoCentavos: 1700 },
  },
  {
    sku: "CN-MOL-002",
    nomeOriginal: "海鲜酱",
    nomePt: "Molho Hoisin",
    slug: "molho-hoisin-400g",
    descricao: "Molho agridoce encorpado, usado em pato à moda de Pequim e refogados.",
    categoriaSlug: "molhos-temperos",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Soja fermentada, açúcar, vinagre, alho, especiarias, trigo.",
    tabelaNutricional: porcao100g("15g", { calorias: "35kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    alergenos: ["SOJA", "GLUTEN"],
    apelidos: ["hoisin"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 400g", skuVariacao: "CN-MOL-002-UN", precoCentavos: 2390 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 75, validadeDias: 400, custoCentavos: 1300 },
  },
  {
    sku: "CN-VIN-001",
    nomeOriginal: "镇江香醋",
    nomePt: "Vinagre Preto Chinês (Chinkiang)",
    slug: "vinagre-preto-chines-chinkiang-500ml",
    descricao: "Vinagre escuro de arroz fermentado, sabor complexo e levemente adocicado.",
    categoriaSlug: "molhos-temperos",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Arroz glutinoso fermentado, água, sal.",
    tabelaNutricional: porcao100g("15ml", { calorias: "10kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    apelidos: ["chinkiang", "vinagre preto"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 500ml", skuVariacao: "CN-VIN-001-UN", precoCentavos: 2290 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 55, validadeDias: 500, custoCentavos: 1250 },
  },
  {
    sku: "CN-MAS-001",
    nomeOriginal: "馄饨皮",
    nomePt: "Massa para Wonton",
    slug: "massa-para-wonton-fresca-400g",
    descricao: "Discos de massa fina para recheio de wonton e guioza.",
    categoriaSlug: "frescos",
    origem: "CHINESA",
    conservacao: "RESFRIADO",
    ingredientes: "Farinha de trigo, ovos, água, sal.",
    tabelaNutricional: porcao100g("30g (5un)", { calorias: "80kcal" }),
    origemImportador: "Nacional — beneficiado por Distribuidora Oriental Ltda.",
    alergenos: ["GLUTEN"],
    apelidos: ["wonton", "massa de guioza"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 400g", skuVariacao: "CN-MAS-001-UN", precoCentavos: 1590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 40, validadeDias: 20, custoCentavos: 850 },
  },
  {
    sku: "CN-TEM-001",
    nomeOriginal: "五香粉",
    nomePt: "Cinco-Especiarias em Pó",
    slug: "cinco-especiarias-em-po-50g",
    descricao: "Mistura aromática de canela, anis-estrelado, erva-doce, pimenta-do-reino e cravo.",
    categoriaSlug: "molhos-temperos",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Canela, anis-estrelado, erva-doce, pimenta-do-reino, cravo.",
    tabelaNutricional: porcao100g("2g", { calorias: "8kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    apelidos: ["five spice", "cinco especiarias"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 50g", skuVariacao: "CN-TEM-001-UN", precoCentavos: 1490 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 70, validadeDias: 500, custoCentavos: 800 },
  },
  {
    sku: "CN-CON-001",
    nomeOriginal: "笋",
    nomePt: "Broto de Bambu em Conserva",
    slug: "broto-de-bambu-em-conserva-400g",
    descricao: "Fatias de broto de bambu em conserva, textura crocante para refogados.",
    categoriaSlug: "conservas-enlatados",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Broto de bambu, água, sal, ácido cítrico.",
    tabelaNutricional: porcao100g("100g", { calorias: "20kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    apelidos: ["bamboo shoot", "broto de bambu"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Lata 400g", skuVariacao: "CN-CON-001-UN", precoCentavos: 1590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 65, validadeDias: 600, custoCentavos: 800 },
  },
  {
    sku: "CN-CON-002",
    nomeOriginal: "荸荠",
    nomePt: "Castanha de Água em Conserva",
    slug: "castanha-de-agua-em-conserva-227g",
    descricao: "Castanhas de água fatiadas, crocantes, usadas em recheios e refogados.",
    categoriaSlug: "conservas-enlatados",
    origem: "CHINESA",
    conservacao: "SECO",
    ingredientes: "Castanha de água, água, ácido cítrico.",
    tabelaNutricional: porcao100g("100g", { calorias: "35kcal" }),
    origemImportador: "Importado da China — Distribuidora Oriental Ltda.",
    apelidos: ["water chestnut", "castanha de agua"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Lata 227g", skuVariacao: "CN-CON-002-UN", precoCentavos: 1390 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 60, validadeDias: 600, custoCentavos: 700 },
  },

  // --- Tailandesa -----------------------------------------------------
  {
    sku: "TH-MOL-001",
    nomeOriginal: "น้ำปลา",
    nomePt: "Molho de Peixe (Nam Pla)",
    slug: "molho-de-peixe-nam-pla-700ml",
    descricao: "Molho de peixe fermentado, essencial na culinária tailandesa.",
    categoriaSlug: "molhos-temperos",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Extrato de peixe fermentado, sal, açúcar.",
    tabelaNutricional: porcao100g("5ml", { calorias: "5kcal", sodio: "1400mg" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    alergenos: ["PEIXE"],
    apelidos: ["nam pla", "molho de peixe tailandes", "fish sauce"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 700ml", skuVariacao: "TH-MOL-001-UN", precoCentavos: 2290 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 85, validadeDias: 500, custoCentavos: 1250 },
  },
  {
    sku: "TH-LEI-001",
    nomeOriginal: "กะทิ",
    nomePt: "Leite de Coco",
    slug: "leite-de-coco-400ml",
    descricao: "Leite de coco encorpado, base de curries e sobremesas tailandesas.",
    categoriaSlug: "conservas-enlatados",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Extrato de coco, água.",
    tabelaNutricional: porcao100g("100ml", { calorias: "190kcal", gordurasTotais: "20g" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    apelidos: ["coconut milk", "leite de coco tailandes"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Lata 400ml", skuVariacao: "TH-LEI-001-UN", precoCentavos: 1290 },
      { tipo: "CAIXA", nome: "Caixa fechada (24un)", skuVariacao: "TH-LEI-001-CX", precoCentavos: 27900, unidadesConsumidas: 24 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 150, validadeDias: 500, custoCentavos: 700 },
  },
  {
    sku: "TH-CUR-001",
    nomeOriginal: "พริกแกงเผ็ด",
    nomePt: "Pasta de Curry Vermelho Tailandês",
    slug: "pasta-de-curry-vermelho-tailandes-400g",
    descricao: "Pasta aromática e picante, base do curry vermelho tailandês.",
    categoriaSlug: "molhos-temperos",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Pimenta vermelha, capim-limão, alho, galanga, pasta de camarão, sal.",
    tabelaNutricional: porcao100g("15g", { calorias: "30kcal" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    alergenos: ["CRUSTACEOS"],
    apelidos: ["red curry paste", "curry vermelho"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 400g", skuVariacao: "TH-CUR-001-UN", precoCentavos: 2590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 55, validadeDias: 365, custoCentavos: 1400 },
  },
  {
    sku: "TH-MAC-001",
    nomeOriginal: "เส้นก๋วยเตี๋ยว",
    nomePt: "Macarrão de Arroz para Pad Thai",
    slug: "macarrao-de-arroz-pad-thai-400g",
    descricao: "Macarrão de arroz plano, base do tradicional Pad Thai.",
    categoriaSlug: "massas-arroz",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Farinha de arroz, água.",
    tabelaNutricional: porcao100g("100g", { calorias: "360kcal", carboidratos: "80g" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    apelidos: ["pad thai noodles", "macarrao de arroz"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 400g", skuVariacao: "TH-MAC-001-UN", precoCentavos: 1590 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 90, validadeDias: 400, custoCentavos: 850 },
  },
  {
    sku: "TH-MOL-002",
    nomeOriginal: "ซอสพริกหวาน",
    nomePt: "Molho Doce de Pimenta (Sweet Chili)",
    slug: "molho-doce-de-pimenta-sweet-chili-435g",
    descricao: "Molho agridoce levemente picante, para petiscos e frituras.",
    categoriaSlug: "molhos-temperos",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Açúcar, pimenta vermelha, vinagre, alho, amido.",
    tabelaNutricional: porcao100g("15g", { calorias: "40kcal" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    apelidos: ["sweet chili sauce", "molho tailandes doce"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Garrafa 435g", skuVariacao: "TH-MOL-002-UN", precoCentavos: 1790 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 100, validadeDias: 450, custoCentavos: 950 },
  },
  {
    sku: "TH-TEM-001",
    nomeOriginal: "ตะไคร้แห้ง",
    nomePt: "Capim-Limão Desidratado",
    slug: "capim-limao-desidratado-50g",
    descricao: "Capim-limão (lemongrass) desidratado e picado, para chás e caldos.",
    categoriaSlug: "molhos-temperos",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Capim-limão desidratado.",
    tabelaNutricional: porcao100g("2g", { calorias: "5kcal" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    apelidos: ["lemongrass", "capim limao", "citronela culinaria"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pacote 50g", skuVariacao: "TH-TEM-001-UN", precoCentavos: 1390 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 70, validadeDias: 400, custoCentavos: 700 },
  },
  {
    sku: "TH-PAS-001",
    nomeOriginal: "กะปิ",
    nomePt: "Pasta de Camarão Tailandesa (Kapi)",
    slug: "pasta-de-camarao-tailandesa-kapi-114g",
    descricao: "Pasta fermentada de camarão, ingrediente base de curries e molhos tailandeses.",
    categoriaSlug: "molhos-temperos",
    origem: "TAILANDESA",
    conservacao: "SECO",
    ingredientes: "Camarão fermentado, sal.",
    tabelaNutricional: porcao100g("5g", { calorias: "10kcal" }),
    origemImportador: "Importado da Tailândia — Distribuidora Oriental Ltda.",
    alergenos: ["CRUSTACEOS"],
    apelidos: ["kapi", "shrimp paste", "pasta de camarao"],
    variacoes: [
      { tipo: "UNIDADE", nome: "Pote 114g", skuVariacao: "TH-PAS-001-UN", precoCentavos: 1990 },
    ],
    lote: { codigoLote: "L2026A", quantidade: 40, validadeDias: 500, custoCentavos: 1100 },
  },
];

type KitSeed = {
  produto: Omit<ProdutoSeed, "categoriaSlug"> & { categoriaSlug: "kits-combos" };
  componentes: { sku: string; quantidade: number }[];
};

const kits: KitSeed[] = [
  {
    produto: {
      sku: "KIT-TEMAKI-001",
      nomeOriginal: "手巻き寿司キット",
      nomePt: "Kit Temaki Completo",
      slug: "kit-temaki-completo",
      descricao: "Tudo para montar temaki em casa: nori, arroz, shoyu e wasabi.",
      categoriaSlug: "kits-combos",
      origem: "JAPONESA",
      conservacao: "SECO",
      ingredientes: "Ver produtos que compõem o kit.",
      tabelaNutricional: porcao100g("kit completo", { observacao: "somatório dos componentes" }),
      origemImportador: "Distribuidora Oriental Ltda.",
      alergenos: ["SOJA", "GLUTEN"],
      apelidos: ["kit temaki", "kit sushi caseiro"],
      variacoes: [
        { tipo: "UNIDADE", nome: "Kit completo", skuVariacao: "KIT-TEMAKI-001-UN", precoCentavos: 6990 },
      ],
      lote: { codigoLote: "L2026K", quantidade: 30, validadeDias: 180, custoCentavos: 4200 },
    },
    componentes: [
      { sku: "JP-ALG-001", quantidade: 1 },
      { sku: "JP-ARR-001", quantidade: 1 },
      { sku: "JP-MOL-001", quantidade: 1 },
      { sku: "JP-WAS-001", quantidade: 1 },
    ],
  },
  {
    produto: {
      sku: "KIT-BIBIMBAP-001",
      nomeOriginal: "비빔밥 키트",
      nomePt: "Kit Bibimbap",
      slug: "kit-bibimbap",
      descricao: "Kit com arroz, pasta de pimenta e óleo de gergelim para o clássico bibimbap.",
      categoriaSlug: "kits-combos",
      origem: "COREANA",
      conservacao: "SECO",
      ingredientes: "Ver produtos que compõem o kit.",
      tabelaNutricional: porcao100g("kit completo", { observacao: "somatório dos componentes" }),
      origemImportador: "Distribuidora Oriental Ltda.",
      alergenos: ["SOJA", "GERGELIM"],
      apelidos: ["kit bibimbap", "kit coreano"],
      variacoes: [
        { tipo: "UNIDADE", nome: "Kit completo", skuVariacao: "KIT-BIBIMBAP-001-UN", precoCentavos: 5990 },
      ],
      lote: { codigoLote: "L2026K", quantidade: 30, validadeDias: 180, custoCentavos: 3600 },
    },
    componentes: [
      { sku: "JP-ARR-001", quantidade: 1 },
      { sku: "KR-MOL-001", quantidade: 1 },
      { sku: "KR-OLE-001", quantidade: 1 },
    ],
  },
];

async function criarProduto(produto: ProdutoSeed) {
  const categoria = await prisma.categoria.findUniqueOrThrow({
    where: { slug: produto.categoriaSlug },
  });

  await prisma.$transaction(async (tx) => {
    const criado = await tx.produto.create({
      data: {
        sku: produto.sku,
        nomeOriginal: produto.nomeOriginal,
        nomePt: produto.nomePt,
        slug: produto.slug,
        descricao: produto.descricao,
        categoriaId: categoria.id,
        origem: produto.origem,
        conservacao: produto.conservacao,
        ingredientes: produto.ingredientes,
        tabelaNutricional: produto.tabelaNutricional,
        origemImportador: produto.origemImportador,
        numeroRegistro: produto.numeroRegistro,
        pesoVariavel: produto.pesoVariavel ?? false,
        pesoNominalGramas: produto.pesoNominalGramas,
        isKit: produto.categoriaSlug === "kits-combos",
        alergenos: produto.alergenos
          ? { create: produto.alergenos.map((alergeno) => ({ alergeno })) }
          : undefined,
        apelidos: produto.apelidos
          ? { create: produto.apelidos.map((termo) => ({ termo })) }
          : undefined,
        variacoes: { create: produto.variacoes },
      },
    });

    const validade = new Date();
    validade.setDate(validade.getDate() + produto.lote.validadeDias);

    const lote = await tx.loteEstoque.create({
      data: {
        produtoId: criado.id,
        codigoLote: produto.lote.codigoLote,
        quantidade: produto.lote.quantidade,
        validade,
        custoCentavos: produto.lote.custoCentavos,
      },
    });

    await tx.movimentacaoEstoque.create({
      data: {
        produtoId: criado.id,
        loteId: lote.id,
        tipo: "ENTRADA",
        quantidade: produto.lote.quantidade,
        motivo: "Carga inicial de estoque (seed)",
      },
    });

    return criado;
  });
}

export async function seedDatabase() {
  await prisma.movimentacaoEstoque.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.remessa.deleteMany();
  await prisma.pagamento.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.itemCarrinho.deleteMany();
  await prisma.carrinho.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.loteEstoque.deleteMany();
  await prisma.kitItem.deleteMany();
  await prisma.variacao.deleteMany();
  await prisma.produtoApelido.deleteMany();
  await prisma.produtoAlergeno.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.cupom.deleteMany();

  await prisma.configuracaoLoja.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      pedidoMinimoCentavos: 5000,
      freteGratisAcimaDeCentavos: 15000,
      prazoMaximoResfriadoDias: 3,
      prazoMaximoCongeladoDias: 5,
    },
  });

  for (const categoria of categorias) {
    await prisma.categoria.create({ data: categoria });
  }

  for (const produto of produtos) {
    await criarProduto(produto);
  }

  for (const kit of kits) {
    await criarProduto(kit.produto);
    const kitCriado = await prisma.produto.findUniqueOrThrow({
      where: { sku: kit.produto.sku },
    });
    for (const componente of kit.componentes) {
      const componenteProduto = await prisma.produto.findUniqueOrThrow({
        where: { sku: componente.sku },
      });
      await prisma.kitItem.create({
        data: {
          kitId: kitCriado.id,
          componenteProdutoId: componenteProduto.id,
          quantidade: componente.quantidade,
        },
      });
    }
  }

  await prisma.cupom.create({
    data: {
      codigo: "BEMVINDO10",
      tipoDesconto: "PERCENTUAL",
      valor: 10,
      usoMaximo: 100,
      ativo: true,
    },
  });

  const totalProdutos = await prisma.produto.count();
  return {
    categorias: categorias.length,
    produtos: produtos.length,
    kits: kits.length,
    totalProdutos,
  };
}
