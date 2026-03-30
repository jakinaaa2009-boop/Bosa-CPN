/** 9 promotional products — `public/candy1.png` … `candy9.png` */
export const PROMO_PRODUCTS = [
  {
    id: "1",
    name: "Урамшууллын бүтээгдэхүүн А",
    image: "/candy1.png",
    accent: "from-pink-400 to-rose-400",
  },
  {
    id: "2",
    name: "Урамшууллын бүтээгдэхүүн Б",
    image: "/candy2.png",
    accent: "from-amber-400 to-orange-400",
  },
  {
    id: "3",
    name: "Урамшууллын бүтээгдэхүүн В",
    image: "/candy3.png",
    accent: "from-cyan-400 to-sky-500",
  },
  {
    id: "4",
    name: "Урамшууллын бүтээгдэхүүн Г",
    image: "/candy4.png",
    accent: "from-violet-400 to-purple-500",
  },
  {
    id: "5",
    name: "Урамшууллын бүтээгдэхүүн Д",
    image: "/candy5.png",
    accent: "from-emerald-400 to-teal-400",
  },
  {
    id: "6",
    name: "Урамшууллын бүтээгдэхүүн Е",
    image: "/candy6.png",
    accent: "from-fuchsia-400 to-pink-500",
  },
  {
    id: "7",
    name: "Урамшууллын бүтээгдэхүүн Ж",
    image: "/candy7.png",
    accent: "from-lime-400 to-green-400",
  },
  {
    id: "8",
    name: "Урамшууллын бүтээгдэхүүн З",
    image: "/candy8.png",
    accent: "from-red-400 to-orange-400",
  },
  {
    id: "9",
    name: "Урамшууллын бүтээгдэхүүн И",
    image: "/candy9.png",
    accent: "from-indigo-400 to-blue-500",
  },
] as const;

export const HOW_STEPS = [
  {
    title: "Бүтээгдэхүүнээ авна",
    emoji: "🛒",
    gradient: "from-pink-400 via-rose-400 to-orange-300",
  },
  {
    title: "Баримтаа бүртгэнэ",
    emoji: "🧾",
    gradient: "from-sky-400 via-cyan-400 to-teal-300",
  },
  {
    title: "Баталгаат шагнал",
    emoji: "🎁",
    gradient: "from-violet-400 via-purple-400 to-fuchsia-400",
  },
  {
    title: "Супер шагнал",
    emoji: "⭐",
    gradient: "from-amber-400 via-yellow-400 to-lime-400",
  },
] as const;

export const PRIZE_POOL_LINES = [
  "PlayStation – 2,500,000₮ (1 азтан)",
  "Gremix тоглоомын дэлгүүрийн эрх – 250,000₮ (1 азтан)",
  "Нэрийн барааны багц бэлэг – 500,000₮ (5 азтан)",
  "STEAM платформын эрх – $150 (10 азтан, хэтэвч цэнэглэнэ)",
  "Honor Choice брэндийн чихэвч – 400,000₮ (2 азтан)",
] as const;

export const CAMPAIGN_FINE_PRINT = [
  "2026 оны 4 дүгээр сарын 20-наас 6 дугаар сарын 20-ныг дуустал үргэлжилнэ.",
  "Оролцогч нь дээрх хугацаанд худалдан авалт хийж, НӨАТ-ын баримтаа вэб сайтад бүртгүүлсэн байх шаардлагатай.",
] as const;

/** Names used in admin draw dropdown — align with PRIZE_POOL_LINES */
export const DRAW_PRIZE_OPTIONS = [
  "PlayStation – 2,500,000₮",
  "Gremix тоглоомын дэлгүүрийн эрх – 250,000₮",
  "Нэрийн барааны багц бэлэг – 500,000₮",
  "STEAM платформын эрх – $150",
  "Honor Choice брэндийн чихэвч – 400,000₮",
] as const;

/** Dedicated page for receipt upload + user auth */
export const SUBMIT_PAGE_HREF = "/barimt";

/** Hash links use `/#...` so they work from the /barimt page too */
export const NAV_LINKS = [
  { href: "/#home", label: "Үндсэн нүүр" },
  { href: "/#how", label: "Хэрхэн оролцох вэ?" },
  { href: "/#prizes", label: "Шагналууд" },
  { href: "/#winners", label: "Ялагчид" },
  { href: "/#products", label: "Урамшууллын бүтээгдэхүүнүүд" },
  { href: SUBMIT_PAGE_HREF, label: "Баримт оруулах" },
] as const;
