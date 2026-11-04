---
version: alpha
name: متجري
description: >-
  الهوية البصرية لمتجر إلكتروني عربي للعرض بطابع "ليل دافئ": خلفية داكنة
  ولون برتقالي واحد للأفعال والأسعار، وصور منتجات حقيقية على بطاقات داكنة
  بزوايا دائرية وزر سلة دائري في ركنها، ورأس داكن بحقل بحث عريض وصف روابط،
  وتذييل ينتهي بشريط برتقالي. اسم المتجر مؤقت حتى اعتماد الاسم النهائي.
colors:
  primary: "#ffa629"
  on-primary: "#111111"
  primary-soft: "color-mix(in srgb, #ffa629 10%, #121214)"
  ring: "#ffa629"
  background: "#121214"
  foreground: "#ffffff"
  surface: "#1c1c1f"
  surface-muted: "#2a2a2e"
  muted-foreground: "#a1a1a6"
  border: "#333338"
  error: "#f87171"
  warning: "#fbbf24"
  success: "#4ade80"
  whatsapp: "#15803d"
typography:
  headline-display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.2
  headline-display-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.3
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.3
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.375
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.35
  headline-md-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  body-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
  label-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
  price-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
  price-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  gutter-mobile: 16px
  gutter-desktop: 24px
  container-max: 1280px
  touch-target: 44px
  header-height: 64px
  header-nav-height: 40px
  tab-bar-height: 64px
components:
  button-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 24px
  button-cta-hover:
    backgroundColor: "color-mix(in srgb, #ffa629 88%, #ffffff)"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 24px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 24px
  site-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    height: 64px
  header-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    height: 40px
  header-link-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
  search-input:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 44px
  counter-badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 18px
  announcement-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    height: 32px
  whatsapp-button:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    size: 56px
  hero-banner:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.headline-display}"
    padding: 24px
  trust-strip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    padding: 20px
  feature-circle:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 88px
  promo-tag:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px
  category-tile:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
  section-tab:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 16px
  section-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 16px
  carousel-arrow:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    size: 40px
  filter-chip:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 14px
  filter-chip-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 12px
  product-card-image:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.lg}"
  product-card-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  card-cart-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 48px
  wishlist-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 36px
  price-current:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.price-md}"
  price-old:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  badge-discount:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  stock-in:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
    typography: "{typography.label-md}"
  stock-low:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warning}"
    typography: "{typography.label-md}"
  stock-out:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.label-md}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 44px
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
  site-footer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
  footer-statement:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-lg}"
  footer-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  footer-bar:
    backgroundColor: "{colors.primary}"
    height: 12px
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
    height: 64px
  tab-bar-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  focus-ring:
    backgroundColor: "{colors.ring}"
    size: 3px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  share-image:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.headline-display}"
    padding: 48px
  share-image-meta:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-lg}"
  share-image-price:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-display}"
---

# الهوية البصرية لمتجري

هذا الملف هو المرجع الوحيد لشكل المتجر. أي صفحة أو مكوّن جديد يتبع القيم والقواعد هنا.
الألوان مطبّقة في الكود داخل `src/app/globals.css` بنفس قيم hex المكتوبة هنا، والزوايا عبر المتغير `--radius`.
عند تغيير الهوية: عدّل هذا الملف أولاً، ثم افحصه بالأمر `pnpm design:lint`، ثم انقل القيم إلى `globals.css`.

## Overview

متجر عربي بطابع **ليل دافئ**: صفحات داكنة تُبرز صور المنتجات الحقيقية، ولون برتقالي واحد يقود العين إلى السعر وزر الشراء، فيجد الزائر المنتج ويفهم سعره ويضيفه للسلة دون تشتيت.

- **مصدر الإلهام:** تصميم مفهومي لمتجر أثاث ("Luxe Living") وجده صاحب المشروع وأعجبته ألوانه: أسطح سوداء ورمادية داكنة، وبرتقالي للأزرار والأسعار، وبطاقات منتجات بزر سلة دائري في ركنها، ومربعات فئات مصوّرة، وتذييل ينتهي بشريط برتقالي. أُعيد بناء الأفكار بالعربية ومن اليمين لليسار بصور مجانية من Pexels، ولم يُنسخ من التصميم الأصلي كود ولا صورة.
- **الشخصية:** دافئة وواثقة وعصرية، تشبه متاجر الأجهزة والأثاث الحديثة لا الأسواق المزدحمة.
- **الجمهور:** متسوقون عرب يتصفحون غالباً من الجوال، بعضهم قليل الخبرة بالتسوق الإلكتروني.
- **الإحساس المطلوب:** صورة كبيرة معتمة الأطراف تستقبل الزائر بعنوان في منتصفها، ورأس داكن ثابت بحقل بحث عريض، وبطاقات داكنة ترفع الصور عن الخلفية، والبرتقالي وحده يعني "اضغط هنا" أو "هذا هو السعر".
- **الاتجاه:** الواجهة كلها من اليمين لليسار. المحاذاة والأسهم والقوائم المنزلقة تبدأ من اليمين.
- **الجوال أولاً:** كل تصميم يبدأ من عرض 375 بكسل، مع شريط تنقل ثابت أسفل الشاشة.

## Colors

خلفية داكنة بثلاث درجات، ونص أبيض، ولون واحد للهوية هو البرتقالي. لا كحلي ولا أزرق ولا أي لون آخر للتزيين.

- **البرتقالي (primary, #ffa629):** الأزرار الرئيسية، والأسعار، والروابط عند المرور، والتبويب النشط، والعدّادات، وشارات الخصم، وشريط الإعلان، وشريط التذييل السفلي. النص فوقه داكن دائماً (on-primary, #111111) بتباين 9.6:1، ولا يوضع نص أبيض فوقه أبداً.
- **البرتقالي الخافت (primary-soft):** خلفية الخيار المختار في الفلاتر، ونصه برتقالي.
- **الخلفية (background, #121214):** أرضية كل الصفحات، وهي أغمق درجة. النص الأبيض فوقها بتباين 18:1.
- **السطح (surface, #1c1c1f):** الرأس، والتذييل، وبطاقات المنتجات، والنوافذ المنزلقة، والرسائل. درجة واحدة أفتح من الخلفية حتى ترتفع البطاقات عنها دون ظل.
- **السطح الفاتح (surface-muted, #2a2a2e):** حقل البحث، ومربع الصورة داخل البطاقة قبل تحميلها، ودوائر الأيقونات، وأزرار التمرير، والهياكل أثناء التحميل.
- **النص الأساسي (foreground, #ffffff):** العناوين وأسماء المنتجات وروابط الرأس.
- **النص الثانوي (muted-foreground, #a1a1a6):** الأوصاف وأسماء الفئات في البطاقات والسعر قبل الخصم وروابط التذييل، بتباين 6.4:1 على السطح و7.3:1 على الخلفية.
- **الحدود (border, #333338):** حدود الحقول والبطاقات المصوّرة والخطوط الفاصلة. رفيعة وخافتة، لأن اختلاف درجات الخلفية يفصل الأجزاء غالباً.
- **حلقة التركيز (ring, #ffa629):** برتقالية على الأسطح الداكنة. فوق زر برتقالي تصبح بيضاء حتى تبقى ظاهرة.
- **الأحمر (error, #f87171):** رسائل الخطأ و"نفد من المخزون" فقط، وهو أحمر فاتح يُقرأ على الداكن بتباين 6:1.
- **الأصفر (warning, #fbbf24):** تنبيه "بقي عدد قليل".
- **الأخضر (success, #4ade80):** حالة "متوفر"، وزر واتساب العائم يأخذ أخضر واتساب الأغمق (whatsapp, #15803d) لأن الأيقونة البيضاء فوقه تحتاج تبايناً 5:1.
- **النص فوق الصور:** أبيض دائماً فوق طبقة تعتيم بلون الخلفية (45%) وتدرج أغمق من الأسفل، حتى يبقى مقروءاً مهما كانت الصورة.

## Typography

خط واحد فقط في كل الموقع: **IBM Plex Sans Arabic**، مستضاف داخل المشروع في `src/fonts`، بملفات للحروف العربية وملفات للأرقام والحروف اللاتينية.
الملفات نسخ مصغّرة تحوي حروف المتجر فقط، يولّدها الأمر `pnpm fonts` من الأصول في `assets/fonts`، فيبقى حجم الخط كله 66 كيلوبايت.
التصميم المرجعي يستخدم خط Segoe UI، وهو خط نظام Windows لا يمكن تضمينه في موقع، فبقي IBM Plex Sans Arabic وهو قريب منه في الوضوح.
الخط ثابت الأوزان، والمتوفر منه ثلاثة فقط: 400 للنصوص، و500 للأسماء والأزرار، و700 للعناوين والأسعار.

- **عنوان الواجهة (headline-display):** 60 بكسل على الحاسوب و36 على الجوال، أبيض في منتصف الصورة، في سطرين على الأكثر.
- **العناوين (headline):** عريضة (700) مع تباعد أسطر مريح للحروف العربية. لكل عنوان قيمة للجوال وأخرى للحاسوب، وعناوين الأقسام الوسطية ("لماذا تختارنا؟" و"تواصل معنا") في المنتصف.
- **النصوص (body):** 16 بكسل كحد أدنى للنص الأساسي، بتباعد أسطر 1.75 لأن الحروف العربية تحتاج مساحة رأسية أكبر من اللاتينية.
- **الأسماء والأزرار (label):** وزن متوسط 500، والشارات الصغيرة 12 بكسل بوزن 700.
- **الأسعار (price):** عريضة بالبرتقالي دائماً، وبأرقام 0-9 لتجنب الالتباس، والعملة بعد الرقم: "129 ر.س".
- **الحقول:** 16 بكسل على الجوال حتى لا يكبّر المتصفح الصفحة تلقائياً عند الكتابة.
- **لا تباعد بين الحروف:** الحروف العربية متصلة، وأي تباعد يقطعها. العناوين الكبيرة تكبر بالحجم لا بالتباعد.

## Layout

- **الشبكة:** حاوية بعرض أقصى 1280 بكسل في المنتصف، وهامش جانبي 16 بكسل على الجوال و24 على الحاسوب (`page-container`). الواجهة وشريط الثقة تحتها والتذييل وحدها بعرض الشاشة كاملاً.
- **الرأس على الحاسوب:** صفان ثابتان أعلى الشاشة: الأول بارتفاع 64 بكسل فيه الشعار في البداية، وحقل بحث عريض في المنتصف، والمفضلة والسلة وزر "تسوّق الآن" البرتقالي في النهاية. والثاني بارتفاع 40 بكسل فيه روابط التسوق والمساعدة في المنتصف، و"الفئات" يفتح لوحة كبيرة بأعمدة.
- **الرأس على الجوال:** صف واحد بارتفاع 64 بكسل: زر القائمة في البداية، والشعار، وزر البحث والسلة في النهاية. زر البحث يفتح حقل البحث في سطر تحت الرأس.
- **شريط التنقل السفلي على الجوال:** ثابت بارتفاع 64 بكسل: الرئيسية، الفئات، البحث، المفضلة، السلة. وتُترك له مساحة أسفل كل صفحة.
- **ترتيب الصفحة الرئيسية:** الواجهة بعرض الشاشة، ثم شريط الثقة الداكن تحتها مباشرة، ثم "لماذا تختارنا؟" بثلاث دوائر، ثم شبكة العروض (مربعا صورة ومربع طويل وبطاقة الخصم)، ثم الأكثر مبيعاً، ثم بطاقتا الأقسام المميزة، ثم وصل حديثاً بلافتة كبيرة وصف منتجات وزر في المنتصف، ثم الرائج بتبويبات الفئات، ثم عروض بعدّاد تنازلي، ثم اللافتة العريضة، ثم مربعات الفئات، ثم آراء العملاء إن وُجدت، ثم تواصل معنا، ثم التذييل.
- **صفوف المنتجات:** تُسحب أفقياً على كل الشاشات بفجوة 12 إلى 16 بكسل، مع زرّي تمرير دائريين في رأس القسم على الحاسوب.
- **شبكة المنتجات في القوائم:** عمودان على الجوال، 3 على اللوحي، 4 على الحاسوب (3 عند وجود شريط الفلاتر الجانبي)، والبطاقات مستقلة بفجوات بينها.
- **مقياس المسافات:** مضاعفات 4 بكسل. المسافة بين أقسام الصفحة 56 إلى 80 بكسل، وداخل البطاقات 10 إلى 16 بكسل.
- **اللمس:** كل عنصر قابل للنقر بارتفاع 44 بكسل على الأقل، والشرائح الصغيرة 36 بكسل مع مسافات بينها.
- **الاتجاه:** استخدم الخصائص المنطقية دائماً (`ms` و`me` و`ps` و`pe` و`start` و`end`) بدل اليسار واليمين.

## Elevation & Depth

العمق يأتي من **درجات الخلفية** لا من الظلال: الخلفية أغمق، والبطاقات والرأس والتذييل درجة أفتح، ومربعات الصور والحقول درجة أفتح منها.

- لا ظلال على البطاقات ولا على الأزرار. الظل مسموح فقط للعناصر العائمة: لوحة الفئات، واقتراحات البحث، ونافذة السلة، والرسائل، وتكون خلفيتها بلون السطح مع طبقة تعتيم سوداء (60%) خلف النوافذ.
- زر السلة الدائري في ركن البطاقة محاط بحلقة بلون الخلفية (6 بكسل)، فيبدو كأن البطاقة مقطوعة حوله.
- الصور تكبر قليلاً (3%) عند مرور الفأرة فوق البطاقة والمربعات المصوّرة، وهذه الحركة الوحيدة فيها.
- الحقول والبطاقات المصوّرة لها حد رفيع بلون الحدود حتى تُرى حوافها فوق الخلفية الداكنة.

## Shapes

- **الأزرار:** زوايا 8 بكسل (`lg`)، وكذلك الحقول ومربعات الصور داخل البطاقات.
- **البطاقات والمربعات المصوّرة والنوافذ:** 12 بكسل (`xl`).
- **الحبوب (full):** حقل البحث، والتبويبات، وشرائح الفلاتر، وشارات الأقسام، وعدّاد العروض.
- **الدوائر تبقى دوائر:** زر السلة في البطاقة، وزر المفضلة فوق الصورة، وأزرار التمرير، والعدّادات، ودوائر "لماذا تختارنا؟" والتواصل، ودوائر الألوان في الفلاتر والمتغيرات.
- **الشارات الصغيرة، مثل الخصم:** 4 بكسل (`sm`).
- **الواجهة وشريط الثقة والتذييل:** بلا زوايا، لأنها بعرض الشاشة.

## Components

- **الزر الرئيسي (button-cta):** برتقالي بنص داكن، زوايا 8 بكسل، بارتفاع 44 بكسل، للفعل الأهم في المنطقة: "أضف للسلة"، "إتمام الطلب"، "تسوّق الآن"، "عرض النتائج". فوق الصور أيضاً، فهو يُقرأ على أي صورة.
- **الزر الثانوي (button-secondary):** شفاف بحد أبيض ونص أبيض، للفعل الثاني: "اشترِ الآن"، "عرض السلة".
- **الزر الخفيف (button-outline):** شفاف بحد رمادي، للأفعال البديلة مثل "مسح الفلاتر" و"متابعة التسوق" و"مشاركة".
- **الرأس:** داكن (surface) ثابت أعلى الشاشة بحد سفلي رفيع. الشعار مربع برتقالي بأيقونة حقيبة داكنة واسم المتجر بالأبيض. حقل البحث حبة بلون السطح الفاتح بعرض 36 ريم. عدّادا المفضلة والسلة دائرتان برتقاليتان صغيرتان لا تظهران عند الصفر. روابط الصف الثاني بيضاء وتصبح برتقالية عند المرور.
- **شريط الإعلان:** سطر برتقالي رفيع أعلى كل الصفحات فوق الرأس، يختفي عند التمرير، بنص داكن قصير ورابط اختياري.
- **الواجهة الرئيسية:** صورة بعرض الشاشة بارتفاع 72% من الشاشة على الحاسوب و32 ريم على الجوال، فوقها تعتيم بلون الخلفية وتدرج أغمق من الأسفل، وفي منتصفها: شارة برتقالية صغيرة، وعنوان كبير، وسطر وصف، والسعر، وزر برتقالي واحد. أكثر من شريحة تُسحب باللمس بنقاط (النشطة برتقالية) وأسهم، دون تشغيل تلقائي.
- **شريط الثقة (trust-strip):** شريط بلون السطح تحت الواجهة مباشرة بعرض الشاشة: أربع ميزات بأيقونة برتقالية وعنوان قصير ووصف رمادي، في عمودين على الجوال وأربعة على الحاسوب.
- **لماذا تختارنا؟ (feature-circle):** عنوان في المنتصف وثلاث دوائر بلون السطح الفاتح وحد رفيع، فيها أيقونة برتقالية، وتحتها عنوان عريض ووصف رمادي.
- **شبكة العروض:** مربعا صورة فوق بعضهما ومربع طويل بجانبهما، كل مربع صورة منتج بزوايا 12 بكسل وحد رفيع، وفي أسفله شارة برتقالية وعنوان وسعر فوق تدرج داكن. وبجانبها بطاقة بلون السطح فيها "خصومات تصل إلى N%" بالبرتقالي وزر "تسوّق العروض". نسبة الخصم تُحسب من المنتجات ذات العروض الحقيقية.
- **مربعات الفئات (category-tile):** صورة الفئة بنسبة 4:5 بزوايا 12 بكسل وحد رفيع، وفي أسفلها اسم الفئة وعدد المنتجات بالأبيض فوق تدرج داكن.
- **بطاقة المنتج (product-card):** بلون السطح بزوايا 12 بكسل بلا ظل، وداخلها مربع الصورة بزوايا 8 بكسل، وفي ركنه شارة الخصم البرتقالية (البداية) وزر القلب البرتقالي الدائري (النهاية). تحت الصورة: اسم الفئة بالرمادي، ثم الاسم عريضاً، ثم السعر بالبرتقالي. وفي ركن البطاقة السفلي من جهة النهاية زر سلة دائري برتقالي (48 بكسل) محاط بحلقة بلون الخلفية: يضيف مباشرة للمنتج ذي الخيار الواحد، ويفتح صفحة المنتج لاختيار المقاس أو اللون للمنتج متعدد الخيارات. المنتج النافد بلا زر وعليه شارة "نفد من المخزون".
- **التبويبات والشرائح:** حبوب بحد رمادي ونص أبيض، والنشطة برتقالية بنص داكن.
- **العدّاد التنازلي:** حبة برتقالية فوق البطاقة، يظهر فقط لمنتج له تاريخ انتهاء عرض حقيقي في البيانات، ويختفي المنتج من القسم عند انتهائه.
- **صفحة المنتج:** المعرض في مربع بلون السطح الفاتح بزوايا 12 بكسل وحد رفيع، والصور المصغرة بحد برتقالي للنشطة. الاسم بالأبيض والسعر الكبير بالبرتقالي. خيارات المقاس واللون حبوب بحد رمادي والمختارة برتقالية. زر "أضف للسلة" برتقالي بجانب محدد الكمية، وتحته "اشترِ الآن" بحد أبيض. مزايا الشراء في بطاقة بلون السطح، ثم التبويبات، ثم منتجات مشابهة.
- **نافذة السلة:** تنزلق من جهة النهاية بلون السطح، فيها المنتجات بصورها وخياراتها، ومحدد الكمية، والحذف، والمجموع، وزرّا "إتمام الطلب" البرتقالي و"عرض السلة".
- **إتمام الطلب:** صفحة واحدة بخطوات مرقمة في دوائر برتقالية، كل خطوة في بطاقة بحد رفيع. الحقول بارتفاع 44 بكسل بحد رمادي وخلفية الصفحة، والتسمية فوق الحقل، ورسالة الخطأ تحته بالأحمر الفاتح. الملخص في بطاقة بلون السطح، مثبت على الحاسوب ويُطوى على الجوال، وزر التأكيد البرتقالي يحمل الإجمالي. تنبيه "متجر تجريبي" ظاهر قبل التأكيد وبعده.
- **تواصل معنا:** عنوان في المنتصف، ثم بطاقات بلون السطح لكل وسيلة: دائرة بلون السطح الفاتح بأيقونة برتقالية، والاسم بالرمادي والقيمة بالأبيض. تظهر في الصفحة الرئيسية وفي صفحة "تواصل معنا".
- **زر واتساب:** دائرة خضراء بأيقونة بيضاء في زاوية الشاشة من جهة النهاية، فوق شريط الجوال السفلي. يظهر فقط عند ضبط رقم واتساب.
- **الصفحات الثابتة:** عمود نص بعرض أقصى 768 بكسل وعناوين عريضة، وقائمة جانبية بالصفحات في بطاقة بلون السطح على الحاسوب. الأسئلة الشائعة تُفتح وتُطوى، وجدول الشحن يُبنى من ملف الشحن.
- **التذييل:** بلون السطح بعرض الشاشة: الشعار وجملة المتجر بالرمادي وزر "تواصل معنا" البرتقالي في جهة البداية، وأعمدة الروابط بالرمادي (برتقالية عند المرور) في جهة النهاية، ثم سطر الحقوق بحد علوي رفيع، وفي النهاية شريط برتقالي بارتفاع 12 بكسل (footer-bar).
- **صور المشاركة (share-image):** تظهر عند مشاركة رابط في واتساب ومواقع التواصل، وتُولَّد وقت البناء بمقاس 1200×630: صورة لكل منتج، وصورة لكل فئة، وصورة عامة للمتجر. خلفية داكنة، والصورة مربعة على اليسار بزوايا دائرية، وعمود النص على اليمين: الشعار واسم المتجر، ثم اسم الفئة بالرمادي، ثم الاسم بالأبيض العريض، والسعر بالبرتقالي في الأسفل وبجانبه السعر قبل الخصم مشطوباً. شارة الخصم برتقالية فوق الصورة. صورة الفئة والصورة العامة تعرضان حقيقتين فقط من بيانات المتجر: الدفع عند الاستلام وحد الشحن المجاني.
- **الحالات الفارغة:** إطار متقطع وأيقونة في دائرة بلون السطح الفاتح وجملة توضح ما حدث وزر لما يمكن فعله.
- **التحميل:** هياكل بلون السطح الفاتح نابضة بنفس شكل المحتوى، بدل مؤشرات الدوران.
- **الأيقونات:** مكتبة Lucide بخط رفيع، والأسهم تنعكس تلقائياً في الاتجاه العربي.

## Do's and Don'ts

- افعل: ابدأ أي تصميم من شاشة الجوال ثم وسّعه.
- افعل: استخدم البرتقالي لفعل واحد بارز في كل منطقة، والزر ذا الحد الأبيض للفعل الثاني.
- افعل: حافظ على تباين 4.5:1 على الأقل لكل نص، وافحصه بالأمر `pnpm design:lint`.
- افعل: اكتب الأعداد بصيغ الجمع العربية الصحيحة: "منتج واحد"، "منتجان"، "5 منتجات"، "20 منتجاً".
- افعل: أظهر الشحن والإجمالي قبل أي تأكيد، ولا تفاجئ الزائر بأي مبلغ.
- افعل: اجعل الحركة قصيرة (300 ملّي ثانية أو أقل) ولغرض واضح، مثل انزلاق النوافذ، ونبضة القلب عند الحفظ، وانفتاح الأسئلة الشائعة. ومن طلب تقليل الحركة من إعدادات جهازه لا يرى أي حركة.
- افعل: استخدم صور منتجات حقيقية بخلفيات هادئة، فالتصميم الداكن يُبرزها. الصور التجريبية الحالية من Pexels مرخصة للاستخدام الحر، وتُستبدل بصور المتجر الفعلية.
- لا تفعل: لا تضع نصاً أبيض فوق البرتقالي، ولا نصاً برتقالياً فوق البرتقالي. النص فوقه داكن دائماً.
- لا تفعل: لا تستخدم البرتقالي لخلفيات كبيرة غير شريط الإعلان وشريط التذييل، ولا تضع بطاقتين برتقاليتين متجاورتين.
- لا تفعل: لا تضع ظلاً حول بطاقة المنتج، فدرجة لونها تفصلها عن الخلفية.
- لا تفعل: لا تعرض أرقاماً وهمية مثل "25 شخصاً يشاهدون الآن" أو "شخص اشترى للتو"، ولا عدّاداً تنازلياً دون تاريخ حقيقي، ولا تقييمات ونجوماً دون آراء حقيقية.
- لا تفعل: لا تخفِ زر الإضافة للسلة أو أي معلومة مهمة خلف تمرير الفأرة، لأن الجوال لا يملك ذلك.
- لا تفعل: لا تشغّل الشرائح المتحركة تلقائياً، فالزائر يقرر متى ينتقل.
- لا تفعل: لا تُظهر المحتوى بحركة عند التمرير إليه، فهذا يؤخر القراءة ويثقل الصفحة على الجوال.
- لا تفعل: لا تستخدم أكثر من خط واحد، ولا أوزاناً غير 400 و500 و700، ولا تباعداً بين الحروف العربية.
- لا تفعل: لا تستخدم الأحمر إلا للأخطاء والنفاد.
- لا تفعل: لا تستخدم left وright في التنسيق، بل start وend.
- لا تفعل: لا تضع نصاً مهماً فوق صورة دون طبقة تعتيم وتدرج داكن يضمنان قراءته.
