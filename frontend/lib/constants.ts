/** 9 promotional products — `public/candy1.png` … `candy9.png` */
export const PROMO_PRODUCTS = [
  {
    id: "1",
    image: "/candy1.png",
    accent: "from-pink-400 to-rose-400",
    border: "border-rose-300",
    name: "Cream-O",
    category: "Жигнэмэг",
    variants: "4 төрлийн амт",
    desc: "Тансаг кремтэй жигнэмэг",
    featured: true,
  },
  {
    id: "2",
    image: "/candy2.png",
    accent: "from-amber-400 to-orange-400",
    border: "border-orange-300",
    name: "Cream-O",
    category: "Жигнэмэг",
    variants: "4 төрлийн амт",
    desc: "Тансаг кремтэй жигнэмэг",
    featured: false,
  },
  {
    id: "3",
    image: "/candy3.png",
    accent: "from-cyan-400 to-sky-500",
    border: "border-sky-300",
    name: "Potato Chips",
    category: "Чипс (Sour Cream & Onion)",
    variants: "",
    desc: "Сонгинотой цөцгийтэй амттай чипс",
    featured: true,
  },
  {
    id: "4",
    image: "/candy4.png",
    accent: "from-violet-400 to-purple-500",
    border: "border-violet-300",
    name: "Nips",
    category: "Шоколад (White)",
    variants: "White / Milk / Peanut / Raisin",
    desc: "Бүрсэн шоколадтай драже",
    featured: false,
  },
  {
    id: "5",
    image: "/candy5.png",
    accent: "from-emerald-400 to-teal-400",
    border: "border-emerald-300",
    name: "Nips",
    category: "Шоколад (Milk)",
    variants: "White / Milk / Peanut / Raisin",
    desc: "Бүрсэн шоколадтай драже",
    featured: true,
  },
  {
    id: "6",
    image: "/candy6.png",
    accent: "from-fuchsia-400 to-pink-500",
    border: "border-fuchsia-300",
    name: "Nips",
    category: "Шоколад (Peanut)",
    variants: "White / Milk / Peanut / Raisin",
    desc: "Бүрсэн шоколадтай драже",
    featured: false,
  },
  {
    id: "7",
    image: "/candy7.png",
    accent: "from-lime-400 to-green-400",
    border: "border-lime-300",
    name: "Nips",
    category: "Шоколад (Raisin)",
    variants: "White / Milk / Peanut / Raisin",
    desc: "Бүрсэн шоколадтай драже",
    featured: false,
  },
  {
    id: "8",
    image: "/candy8.png",
    accent: "from-red-400 to-orange-400",
    border: "border-red-300",
    name: "Potato Chips",
    category: "Чипс (Classic)",
    variants: "",
    desc: "Шаржигнуур амттай сонгодог чипс",
    featured: false,
  },
  {
    id: "9",
    image: "/candy9.png",
    accent: "from-indigo-400 to-blue-500",
    border: "border-indigo-300",
    name: "Potato Chips",
    category: "Чипс (Spicy)",
    variants: "",
    desc: "Бага зэрэг халуун ногоотой чипс",
    featured: false,
  },
] as const;

export const HOW_STEPS = [
  {
    title: "Бүтээгдэхүүнээ авна",
    emoji: "🛒",
    description: "Тэмцээнд оролцох бүтээгдэхүүн худалдан аваарай.",
    gradient: "from-pink-400 via-rose-400 to-orange-300",
  },
  {
    title: "Баримтаа бүртгэнэ",
    emoji: "🧾",
    description: "Баримтын мэдээллээ сайтад оруулж бүртгүүлээрэй.",
    gradient: "from-sky-400 via-cyan-400 to-teal-300",
  },
  {
    title: "Баталгаат шагнал",
    emoji: "🎁",
    description: "Бүртгүүлсэн даруйдаа баталгаат шагналын эзэн болоорой.",
    gradient: "from-violet-400 via-purple-400 to-fuchsia-400",
  },
  {
    title: "Супер шагнал",
    emoji: "⭐",
    description: "Супер шагналын тохиролд оролцож, азаа үзээрэй!",
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
