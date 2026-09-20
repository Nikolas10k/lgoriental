import { ScrollHero, type ScrollHeroSection } from "@/components/scroll-hero";

const sections: ScrollHeroSection[] = [
  {
    media: { type: "image", src: "/images/hero/prato-01.jpg" },
    eyebrow: "LG Oriental",
    title: "Sabores originais do oriente, direto na sua casa",
    body: "Produtos japoneses, coreanos, chineses e tailandeses selecionados, com procedência e validade rastreadas do estoque até a sua porta.",
  },
  {
    media: { type: "image", src: "/images/hero/prato-02.jpg" },
    eyebrow: "Catálogo",
    title: "Da culinária japonesa à tailandesa, em um só lugar",
    body: "Nori, gochujang, shoyu, dashi e muito mais — busque pelo nome original, em português ou pelo apelido que você já conhece.",
  },
  {
    media: {
      type: "video",
      sources: [
        { src: "/videos/pratos.webm", type: "video/webm" },
        { src: "/videos/pratos.mp4", type: "video/mp4" },
      ],
    },
    eyebrow: "Direto da cozinha",
    title: "Preparo com cuidado, do lote à sua mesa",
    body: "Acompanhe cada etapa: separação por FEFO, embalagem térmica para resfriados e congelados, e despacho dentro do prazo certo.",
  },
  {
    media: { type: "image", src: "/images/hero/prato-03.jpg" },
    eyebrow: "Frescor e procedência",
    title: "Lote, validade e conservação em cada produto",
    body: "Separação por FEFO, embalagem térmica para resfriados e congelados, e rótulo completo com ingredientes e alérgenos.",
  },
  {
    media: { type: "image", src: "/images/hero/prato-04.jpg" },
    eyebrow: "Comece agora",
    title: "Monte seu pedido e garanta o frete grátis",
    body: "Frete grátis acima do valor mínimo configurado e checkout em etapas, com cálculo de frete por CEP e tipo de conservação.",
  },
];

export default function Home() {
  return <ScrollHero sections={sections} />;
}
