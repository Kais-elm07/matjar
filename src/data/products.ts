import {
  optionMatrix,
  productImages,
  singleVariant,
} from "@/lib/catalog/define"
import type { ProductInput } from "@/lib/catalog/types"

/**
 * منتجات المتجر.
 *
 * - الأسعار بالريال (مثل 129 أو 99.5).
 * - الصور: ضع الصور الأصلية في assets/images/products باسم slug-1 وslug-2 ...
 * - المتغيرات: optionMatrix تولّد كل تركيبات المقاس واللون تلقائياً.
 * - أي خطأ (رابط مكرر، فئة غير موجودة، سعر غير صحيح) يوقف البناء برسالة توضّح مكانه.
 *
 * البيانات الحالية تجريبية: استبدلها بمنتجات متجرك.
 */
export const products: ProductInput[] = [
  {
    slug: "classic-cotton-shirt",
    name: "قميص قطني كلاسيكي",
    category: "men",
    description:
      "قميص بقصّة مريحة من القطن الناعم، مناسب للعمل والطلعات اليومية.\n\nيحافظ على شكله ولونه بعد الغسيل، ويأتي بياقة كلاسيكية وأزرار متينة.\n\n- قطن 100% يسمح بمرور الهواء\n- قصّة مريحة غير ضيقة\n- قابل للغسيل في الغسالة",
    specs: [
      { label: "الخامة", value: "قطن 100%" },
      { label: "القصّة", value: "مريحة" },
      { label: "الياقة", value: "كلاسيكية" },
      { label: "العناية", value: "غسيل بماء بارد" },
    ],
    images: productImages("classic-cotton-shirt", ["أبيض", "أزرق", "أبيض"]),
    variants: optionMatrix(
      { المقاس: ["S", "M", "L", "XL"], اللون: ["أبيض", "أزرق"] },
      { sku: "SHIRT", price: 129, compareAtPrice: 159, stock: 12 },
      { "S/أبيض": { stock: 3 }, "XL/أزرق": { stock: 0 } }
    ),
    popularity: 180,
    createdAt: "2026-09-20",
  },
  {
    slug: "lightweight-sneakers",
    name: "حذاء رياضي خفيف",
    category: "men",
    description:
      "حذاء خفيف الوزن بنعل مرن يمتص الصدمات، مثالي للمشي اليومي والرياضة الخفيفة.\n\n- وزن خفيف وتهوية ممتازة\n- نعل مطاطي مانع للانزلاق\n- بطانة داخلية ناعمة",
    specs: [
      { label: "الخامة الخارجية", value: "شبك قماشي" },
      { label: "النعل", value: "مطاط" },
      { label: "الاستخدام", value: "مشي ورياضة خفيفة" },
    ],
    images: productImages("lightweight-sneakers", ["أسود", "رمادي"]),
    variants: optionMatrix(
      { المقاس: ["40", "41", "42", "43", "44"], اللون: ["أسود", "رمادي"] },
      { sku: "SNEAK", price: 219, compareAtPrice: 269, stock: 6 },
      { "40": { stock: 2 }, "44/رمادي": { stock: 0 } }
    ),
    popularity: 150,
    createdAt: "2026-10-18",
    saleEndsAt: "2026-12-31",
  },
  {
    slug: "floral-summer-dress",
    name: "فستان صيفي مزهر",
    category: "women",
    description:
      "فستان خفيف بنقشة زهور ناعمة، بقماش ينساب بأناقة ويمنحك راحة طوال اليوم.\n\n- قماش خفيف مناسب للصيف\n- طول متوسط وأكمام قصيرة\n- حزام قابل للتعديل",
    specs: [
      { label: "الخامة", value: "فسكوز" },
      { label: "الطول", value: "متوسط" },
      { label: "الأكمام", value: "قصيرة" },
    ],
    images: productImages("floral-summer-dress", ["وردي", "أزرق"]),
    variants: optionMatrix(
      { المقاس: ["S", "M", "L"], اللون: ["وردي", "أزرق"] },
      { sku: "DRESS", price: 249, compareAtPrice: 299, stock: 5 },
      { "L/وردي": { stock: 1 } }
    ),
    popularity: 95,
    createdAt: "2026-10-22",
  },
  {
    slug: "elegant-black-abaya",
    name: "عباية سوداء أنيقة",
    category: "women",
    description:
      "عباية بتصميم بسيط وأنيق من قماش الكريب عالي الجودة الذي لا يتجعّد بسهولة.\n\n- قماش كريب ناعم\n- تطريز خفيف على الأكمام\n- تأتي مع طرحة بنفس اللون",
    specs: [
      { label: "الخامة", value: "كريب" },
      { label: "اللون", value: "أسود" },
      { label: "يشمل", value: "طرحة" },
    ],
    images: productImages("elegant-black-abaya", 2),
    variants: optionMatrix(
      { المقاس: ["52", "54", "56", "58"] },
      { sku: "ABAYA", price: 349, stock: 4 },
      { "58": { stock: 0 } }
    ),
    popularity: 120,
    createdAt: "2026-08-15",
  },
  {
    slug: "noise-cancelling-earbuds",
    name: "سماعات لاسلكية بعزل الضوضاء",
    category: "audio",
    description:
      "سماعات أذن لاسلكية بعزل نشط للضوضاء وصوت نقي، مع علبة شحن صغيرة تكفي لساعات طويلة.\n\n- عزل نشط للضوضاء ووضع الشفافية\n- حتى 30 ساعة تشغيل مع علبة الشحن\n- مقاومة للعرق ورذاذ الماء",
    specs: [
      { label: "الاتصال", value: "بلوتوث 5.3" },
      { label: "مدة التشغيل", value: "حتى 30 ساعة مع العلبة" },
      { label: "الشحن", value: "USB-C" },
      { label: "مقاومة الماء", value: "IPX4" },
    ],
    images: productImages("noise-cancelling-earbuds", ["أسود", "أبيض", "أسود"]),
    variants: optionMatrix(
      { اللون: ["أسود", "أبيض"] },
      { sku: "BUDS", price: 399, compareAtPrice: 499, stock: 15 }
    ),
    popularity: 260,
    createdAt: "2026-09-05",
    saleEndsAt: "2026-12-15",
  },
  {
    slug: "gaming-headset",
    name: "سماعة رأس للألعاب",
    category: "audio",
    description:
      "سماعة رأس مريحة للجلسات الطويلة، بصوت محيطي وميكروفون واضح قابل للطي.\n\n- وسائد أذن ناعمة\n- ميكروفون بعزل للضوضاء\n- تعمل مع الحاسوب وأجهزة الألعاب",
    specs: [
      { label: "التوصيل", value: "سلك 3.5 ملم و USB" },
      { label: "الميكروفون", value: "قابل للطي" },
      { label: "الوزن", value: "280 غراماً" },
    ],
    images: productImages("gaming-headset", ["أسود", "أحمر"]),
    variants: optionMatrix(
      { اللون: ["أسود", "أحمر"] },
      { sku: "GAMEHS", price: 279, stock: 8 },
      { أحمر: { stock: 2 } }
    ),
    popularity: 140,
    createdAt: "2026-07-30",
  },
  {
    slug: "portable-speaker",
    name: "سماعة بلوتوث محمولة",
    category: "audio",
    description:
      "سماعة صغيرة بصوت قوي وجهير عميق، تتحمّل الماء وتناسب الرحلات والجلسات الخارجية.\n\n- مقاومة للماء والغبار\n- حتى 12 ساعة تشغيل\n- حزام للتعليق سهل الحمل",
    specs: [
      { label: "مدة التشغيل", value: "حتى 12 ساعة" },
      { label: "مقاومة الماء", value: "IP67" },
      { label: "الاتصال", value: "بلوتوث 5.3" },
    ],
    images: productImages("portable-speaker", ["أسود", "أزرق", "أخضر"]),
    variants: optionMatrix(
      { اللون: ["أسود", "أزرق", "أخضر"] },
      { sku: "SPEAKER", price: 189, compareAtPrice: 229, stock: 10 },
      { أخضر: { stock: 0 } }
    ),
    popularity: 170,
    createdAt: "2026-10-10",
  },
  {
    slug: "fast-charger-65w",
    name: "شاحن سريع 65 واط",
    category: "phone-accessories",
    description:
      "شاحن جداري سريع بمنفذين يشحن الجوال والجهاز اللوحي وحتى الحاسوب المحمول.\n\n- قوة 65 واط\n- منفذا USB-C و USB-A\n- حماية من الحرارة والجهد الزائد",
    specs: [
      { label: "القدرة", value: "65 واط" },
      { label: "المنافذ", value: "USB-C و USB-A" },
      { label: "التقنية", value: "GaN" },
    ],
    images: productImages("fast-charger-65w", 2),
    variants: singleVariant({ sku: "CHG65", price: 149, stock: 25 }),
    popularity: 210,
    createdAt: "2026-06-12",
  },
  {
    slug: "power-bank-20000",
    name: "باور بانك 20000 مللي أمبير",
    category: "phone-accessories",
    description:
      "بطارية متنقلة بسعة كبيرة تكفي لشحن الجوال عدة مرات، بشحن سريع وشاشة تعرض النسبة المتبقية.\n\n- سعة 20000 مللي أمبير\n- شحن سريع 22.5 واط\n- شاشة رقمية للنسبة",
    specs: [
      { label: "السعة", value: "20000 مللي أمبير" },
      { label: "القدرة", value: "22.5 واط" },
      { label: "المنافذ", value: "منفذا USB-A ومنفذ USB-C" },
    ],
    images: productImages("power-bank-20000", ["أسود", "أبيض"]),
    variants: optionMatrix(
      { اللون: ["أسود", "أبيض"] },
      { sku: "PB20K", price: 179, stock: 18 }
    ),
    popularity: 190,
    createdAt: "2026-09-28",
  },
  {
    slug: "classic-wrist-watch",
    name: "ساعة يد كلاسيكية",
    category: "bags-accessories",
    description:
      "ساعة بتصميم كلاسيكي هادئ وسوار معدني متين، تناسب المناسبات والاستخدام اليومي.\n\n- زجاج مقاوم للخدش\n- مقاومة للماء حتى 30 متراً\n- سوار قابل لتعديل المقاس",
    specs: [
      { label: "الحركة", value: "كوارتز" },
      { label: "قطر الإطار", value: "40 ملم" },
      { label: "مقاومة الماء", value: "30 متراً" },
    ],
    images: productImages("classic-wrist-watch", ["فضي", "ذهبي"]),
    variants: optionMatrix(
      { اللون: ["فضي", "ذهبي"] },
      { sku: "WATCH", price: 449, compareAtPrice: 549, stock: 5 },
      { ذهبي: { price: 479, compareAtPrice: 579 } }
    ),
    popularity: 125,
    createdAt: "2026-10-25",
  },
  {
    slug: "cookware-set-10",
    name: "طقم أواني طهي 10 قطع",
    category: "home-kitchen",
    description:
      "طقم متكامل من القدور والمقالي بطبقة مانعة للالتصاق، مناسب لكل أنواع المواقد.\n\n- 10 قطع بأحجام مختلفة مع أغطية زجاجية\n- طبقة مانعة للالتصاق سهلة التنظيف\n- يعمل على الغاز والكهرباء والحث",
    specs: [
      { label: "عدد القطع", value: "10" },
      { label: "الخامة", value: "ألمنيوم بطبقة مانعة للالتصاق" },
      { label: "المواقد", value: "غاز، كهرباء، حث" },
    ],
    images: productImages("cookware-set-10", 2),
    variants: singleVariant({
      sku: "COOK10",
      price: 599,
      compareAtPrice: 749,
      stock: 4,
    }),
    popularity: 85,
    createdAt: "2026-05-20",
    saleEndsAt: "2026-11-30",
  },
  {
    slug: "wooden-table-lamp",
    name: "مصباح طاولة خشبي",
    category: "home-kitchen",
    description:
      "مصباح بقاعدة خشبية طبيعية وإضاءة دافئة تضيف لمسة هادئة لغرفة النوم أو المكتب.\n\n- قاعدة من خشب طبيعي\n- مفتاح لتعديل شدة الإضاءة\n- يدعم مصابيح LED الموفّرة",
    specs: [
      { label: "الارتفاع", value: "45 سم" },
      { label: "المصباح", value: "E27، غير مرفق" },
      { label: "الخامة", value: "خشب وقماش" },
    ],
    images: productImages("wooden-table-lamp", ["بيج", "أبيض"]),
    variants: optionMatrix(
      { اللون: ["بيج", "أبيض"] },
      { sku: "LAMP", price: 159, stock: 7 }
    ),
    popularity: 60,
    createdAt: "2026-10-05",
  },
  {
    slug: "luxury-prayer-rug",
    name: "سجادة صلاة فاخرة",
    category: "home-kitchen",
    description:
      "سجادة صلاة سميكة وناعمة بنقوش هادئة، مبطّنة لراحة الركبتين وسهلة الطي والحمل.\n\n- حشوة إسفنجية مريحة\n- قاعدة مانعة للانزلاق\n- تأتي مع حقيبة حمل",
    specs: [
      { label: "المقاس", value: "70 × 115 سم" },
      { label: "الحشوة", value: "إسفنج بسماكة 1 سم" },
      { label: "يشمل", value: "حقيبة حمل" },
    ],
    images: productImages("luxury-prayer-rug", ["أخضر", "كحلي", "عنابي"]),
    variants: optionMatrix(
      { اللون: ["أخضر", "كحلي", "عنابي"] },
      { sku: "RUG", price: 89, stock: 20 }
    ),
    popularity: 230,
    createdAt: "2026-08-01",
  },
  {
    slug: "coffee-maker",
    name: "صانعة قهوة منزلية",
    category: "home-kitchen",
    description:
      "صانعة قهوة سهلة الاستخدام تحضّر حتى 10 أكواب، مع خاصية إبقاء القهوة دافئة.\n\n- خزان ماء بسعة 1.25 لتر\n- فلتر دائم قابل للغسيل\n- إيقاف تلقائي للأمان",
    specs: [
      { label: "السعة", value: "10 أكواب" },
      { label: "القدرة", value: "900 واط" },
      { label: "الخزان", value: "1.25 لتر" },
    ],
    images: productImages("coffee-maker", 2),
    variants: singleVariant({
      sku: "COFFEE",
      price: 329,
      compareAtPrice: 399,
      stock: 6,
    }),
    popularity: 110,
    createdAt: "2026-09-12",
  },
  {
    slug: "oud-perfume",
    name: "عطر عود فاخر",
    category: "beauty",
    description:
      "عطر شرقي بنفحات العود والعنبر والورد، ثابت لساعات طويلة ويناسب المساء والمناسبات.\n\n- المقدمة: زعفران وورد\n- القلب: عود وعنبر\n- القاعدة: مسك وخشب الصندل",
    specs: [
      { label: "النوع", value: "أو دو بارفان" },
      { label: "العائلة العطرية", value: "شرقية خشبية" },
      { label: "الثبات", value: "طويل" },
    ],
    images: productImages("oud-perfume", 2),
    variants: optionMatrix(
      { الحجم: ["50 مل", "100 مل"] },
      { sku: "OUD", price: 199, stock: 9 },
      { "100 مل": { price: 329, compareAtPrice: 379 } }
    ),
    popularity: 280,
    createdAt: "2026-07-10",
  },
  {
    slug: "hydrating-face-cream",
    name: "كريم مرطب للبشرة",
    category: "beauty",
    description:
      "كريم خفيف يرطّب البشرة بعمق دون ملمس دهني، مناسب للاستخدام اليومي صباحاً ومساءً.\n\n- بحمض الهيالورونيك\n- مناسب لكل أنواع البشرة\n- خالٍ من العطور",
    specs: [
      { label: "الحجم", value: "50 مل" },
      { label: "نوع البشرة", value: "جميع الأنواع" },
      { label: "المكوّن الرئيسي", value: "حمض الهيالورونيك" },
    ],
    images: productImages("hydrating-face-cream", 2),
    variants: singleVariant({ sku: "CREAM", price: 69, stock: 30 }),
    popularity: 160,
    createdAt: "2026-10-15",
  },
  {
    slug: "pro-hair-dryer",
    name: "مجفف شعر احترافي",
    category: "beauty",
    description:
      "مجفف شعر قوي وسريع بتقنية الأيونات لتقليل التجعّد، مع ثلاث درجات حرارة وسرعتين.\n\n- قدرة 2200 واط\n- تقنية الأيونات\n- فوهتان للتصفيف",
    specs: [
      { label: "القدرة", value: "2200 واط" },
      { label: "الإعدادات", value: "3 درجات حرارة وسرعتان" },
      { label: "طول السلك", value: "1.8 متر" },
    ],
    images: productImages("pro-hair-dryer", ["أسود", "وردي"]),
    variants: optionMatrix(
      { اللون: ["أسود", "وردي"] },
      { sku: "DRYER", price: 259, compareAtPrice: 299, stock: 3 }
    ),
    popularity: 75,
    createdAt: "2026-09-01",
    saleEndsAt: "2026-11-20",
  },
  {
    slug: "beard-care-kit",
    name: "مجموعة العناية باللحية",
    category: "beauty",
    description:
      "مجموعة متكاملة لتنظيف اللحية وترطيبها وتصفيفها، في علبة أنيقة مناسبة للهدايا.\n\n- زيت وبلسم للحية\n- مشط خشبي ومقص صغير\n- علبة هدية",
    specs: [
      { label: "يشمل", value: "زيت، بلسم، مشط، مقص" },
      { label: "مناسبة للهدايا", value: "نعم" },
    ],
    images: productImages("beard-care-kit", 1),
    variants: singleVariant({ sku: "BEARD", price: 119, stock: 0 }),
    popularity: 50,
    createdAt: "2026-06-30",
  },
  {
    slug: "travel-backpack",
    name: "حقيبة ظهر للسفر",
    category: "bags-accessories",
    description:
      "حقيبة ظهر واسعة بجيوب ذكية ومكان مخصص للحاسوب المحمول، مريحة للسفر والعمل.\n\n- جيب مبطّن للحاسوب حتى 15.6 بوصة\n- قماش مقاوم للماء\n- منفذ USB خارجي للشحن",
    specs: [
      { label: "السعة", value: "30 لتراً" },
      { label: "الخامة", value: "بوليستر مقاوم للماء" },
      { label: "الحاسوب", value: "حتى 15.6 بوصة" },
    ],
    images: productImages("travel-backpack", ["أسود", "رمادي", "كحلي"]),
    variants: optionMatrix(
      { اللون: ["أسود", "رمادي", "كحلي"] },
      { sku: "BACKPACK", price: 219, stock: 11 },
      { كحلي: { stock: 2 } }
    ),
    popularity: 145,
    createdAt: "2026-10-20",
  },
  {
    slug: "leather-wallet",
    name: "محفظة جلد طبيعي",
    category: "bags-accessories",
    description:
      "محفظة رفيعة من الجلد الطبيعي بخياطة متقنة، تتسع للبطاقات والنقود دون انتفاخ.\n\n- جلد طبيعي 100%\n- 8 جيوب للبطاقات\n- حماية البطاقات من القراءة اللاسلكية",
    specs: [
      { label: "الخامة", value: "جلد طبيعي" },
      { label: "الجيوب", value: "8 بطاقات وجيب للنقود" },
      { label: "المقاس", value: "11 × 9 سم" },
    ],
    images: productImages("leather-wallet", ["بني", "أسود"]),
    variants: optionMatrix(
      { اللون: ["بني", "أسود"] },
      { sku: "WALLET", price: 129, compareAtPrice: 149, stock: 14 }
    ),
    popularity: 200,
    createdAt: "2026-08-20",
  },
]
