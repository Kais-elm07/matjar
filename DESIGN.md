---
version: alpha
name: متجري
description: >-
  الهوية البصرية لمتجر إلكتروني عربي للعرض بطابع "متجر عصري": رأس وتذييل
  بالكحلي، وأزرار وشارات بالكهرماني، وخلفية بيضاء وبطاقات بحدود رمادية خفيفة.
  التخطيط مستوحى من قالب Webishop لمتاجر Shopify، وأُعيد بناؤه بالعربية من
  اليمين لليسار دون نسخ كوده أو صوره. اسم المتجر مؤقت حتى اعتماد الاسم النهائي.
colors:
  primary: "#1d2733"
  on-primary: "#ffffff"
  on-primary-muted: "#bbbec2"
  primary-soft: "color-mix(in srgb, #1d2733 10%, #ffffff)"
  highlight: "#febd69"
  on-highlight: "#111111"
  ring: "#d97706"
  background: "#ffffff"
  foreground: "#111111"
  surface: "#ffffff"
  surface-muted: "#f5f5f5"
  muted-foreground: "#666666"
  border: "#e5e5e5"
  error: "#dc2626"
  warning: "#b45309"
  success: "#15803d"
  tile-yellow: "#fff3c4"
  tile-green: "#e2f5d3"
  tile-pink: "#ffe0e0"
  tile-blue: "#dcefff"
  tile-purple: "#ece3ff"
  tile-orange: "#ffe6cc"
typography:
  headline-display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.25
  headline-display-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.375
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
  sm: 3px
  md: 4px
  lg: 5px
  xl: 7px
  2xl: 9px
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
  tab-bar-height: 64px
components:
  button-cta:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-cta-hover:
    backgroundColor: "color-mix(in srgb, #febd69 85%, #ffffff)"
    textColor: "{colors.on-highlight}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, #1d2733 90%, #ffffff)"
    textColor: "{colors.on-primary}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  site-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    height: 64px
  header-nav:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    height: 48px
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 44px
  search-button:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    rounded: "{rounded.full}"
    size: 36px
  counter-badge:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 18px
  hero-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-display}"
    rounded: "{rounded.lg}"
    padding: 40px
  hero-banner-highlight:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.headline-display}"
    rounded: "{rounded.lg}"
    padding: 40px
  promo-tag:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  category-tile:
    backgroundColor: "{colors.tile-yellow}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
  category-tile-green:
    backgroundColor: "{colors.tile-green}"
    textColor: "{colors.foreground}"
  category-tile-pink:
    backgroundColor: "{colors.tile-pink}"
    textColor: "{colors.foreground}"
  category-tile-blue:
    backgroundColor: "{colors.tile-blue}"
    textColor: "{colors.foreground}"
  category-tile-purple:
    backgroundColor: "{colors.tile-purple}"
    textColor: "{colors.foreground}"
  category-tile-orange:
    backgroundColor: "{colors.tile-orange}"
    textColor: "{colors.foreground}"
  section-tab-active:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 20px
  carousel-arrow:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    size: 36px
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
    rounded: "{rounded.lg}"
    padding: 12px
  product-card-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  price-current:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.price-md}"
  price-old:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  badge-discount:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  stock-in:
    backgroundColor: "{colors.background}"
    textColor: "{colors.success}"
    typography: "{typography.label-md}"
  stock-low:
    backgroundColor: "{colors.background}"
    textColor: "{colors.warning}"
    typography: "{typography.label-md}"
  stock-out:
    backgroundColor: "{colors.background}"
    textColor: "{colors.error}"
    typography: "{typography.label-md}"
  help-strip:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.headline-md}"
    padding: 20px
  site-footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
  footer-link:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary-muted}"
    typography: "{typography.body-sm}"
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
---

# الهوية البصرية لمتجري

هذا الملف هو المرجع الوحيد لشكل المتجر. أي صفحة أو مكوّن جديد يتبع القيم والقواعد هنا.
الألوان مطبّقة في الكود داخل `src/app/globals.css` بنفس قيم hex المكتوبة هنا، والزوايا عبر المتغير `--radius`.
عند تغيير الهوية: عدّل هذا الملف أولاً، ثم افحصه بالأمر `pnpm design:lint`، ثم انقل القيم إلى `globals.css`.

## Overview

متجر عربي بطابع **متجر عصري**: واجهة تسوّق مزدحمة بالعروض لكنها مرتبة، يجد فيها الزائر المنتج ويفهم سعره ويضيفه للسلة بسرعة.

- **مصدر الإلهام:** تخطيط قالب Webishop لمتاجر Shopify وألوانه، أُعيد بناؤهما بالعربية ومن اليمين لليسار. لم يُنسخ كود القالب ولا صوره.
- **الشخصية:** عملية وحيوية وواثقة، تشبه المتاجر الكبيرة متعددة الأقسام.
- **الجمهور:** متسوقون عرب يتصفحون غالباً من الجوال، بعضهم قليل الخبرة بالتسوق الإلكتروني.
- **الإحساس المطلوب:** رأس كحلي ثابت يحمل البحث والسلة، وخلفية بيضاء، وأقسام عروض متتالية، والكهرماني يشير دائماً إلى الفعل التالي.
- **الاتجاه:** الواجهة كلها من اليمين لليسار. المحاذاة والأسهم والقوائم المنزلقة تبدأ من اليمين.
- **الجوال أولاً:** كل تصميم يبدأ من عرض 375 بكسل، مع شريط تنقل ثابت أسفل الشاشة.

## Colors

لونان للهوية فقط: الكحلي للهيكل والنصوص المهمة، والكهرماني للأفعال والشارات. البقية رماديات محايدة.

- **الكحلي (primary, #1d2733):** خلفية الرأس والتذييل، والأسعار، والروابط، والعناصر المختارة، وزر "اشترِ الآن". النص فوقه أبيض بتباين 15:1.
- **الرمادي الفاتح على الكحلي (on-primary-muted, #bbbec2):** روابط التذييل والنصوص الثانوية فوق الكحلي، بتباين 8:1.
- **الكحلي الفاتح (primary-soft):** خلفية الخيار المختار في الفلاتر.
- **الكهرماني (highlight, #febd69):** الأزرار الرئيسية مثل "أضف للسلة" و"تسوّق الآن"، وزر البحث، وشارات الخصم، وعدّادات الرأس، والتبويب النشط، وشريط المساعدة. النص فوقه داكن (on-highlight, #111111) بتباين 11.4:1.
- **حلقة التركيز (ring, #d97706):** كهرماني داكن يظهر بوضوح على الأبيض (3.2:1) وعلى الكحلي (4.7:1).
- **الخلفية والسطوح (background و surface, #ffffff):** أبيض لكل الصفحات والبطاقات.
- **السطح الرمادي (surface-muted, #f5f5f5):** أزرار التمرير الدائرية، وبطاقات الآراء، والأقسام الثانوية.
- **النص الأساسي (foreground, #111111):** العناوين وأسماء المنتجات.
- **النص الثانوي (muted-foreground, #666666):** الأوصاف وأسماء الفئات في البطاقات والسعر قبل الخصم، بتباين 5.7:1.
- **الحدود (border, #e5e5e5):** حدود البطاقات والحقول والفواصل.
- **الأحمر (error, #dc2626):** رسائل الخطأ و"نفد من المخزون" فقط.
- **الكهرماني الداكن (warning, #b45309):** تنبيه "بقي عدد قليل".
- **الأخضر (success, #15803d):** حالة "متوفر".
- **ألوان مربعات الفئات (tile-yellow إلى tile-orange):** ستة ألوان باستيل تتناوب على مربعات الفئات في الصفحة الرئيسية، والنص فوقها داكن.

## Typography

خط واحد فقط في كل الموقع: **IBM Plex Sans Arabic**، مستضاف داخل المشروع في `src/fonts`، بملفات للحروف العربية وملفات للأرقام والحروف اللاتينية.
الملفات نسخ مصغّرة تحوي حروف المتجر فقط، يولّدها الأمر `pnpm fonts` من الأصول في `assets/fonts`، فيبقى حجم الخط كله 66 كيلوبايت.
خط القالب الأصلي (Jost) لا يحوي حروفاً عربية، لذلك بقي IBM Plex Sans Arabic.
الخط ثابت الأوزان، والمتوفر منه ثلاثة فقط: 400 للنصوص، و500 للأسماء والأزرار، و700 للعناوين والأسعار.

- **العناوين (headline):** عريضة (700) مع تباعد أسطر مريح للحروف العربية. لكل عنوان قيمة للجوال وأخرى للحاسوب.
- **النصوص (body):** 16 بكسل كحد أدنى للنص الأساسي، بتباعد أسطر 1.75 لأن الحروف العربية تحتاج مساحة رأسية أكبر من اللاتينية.
- **الأسماء والأزرار (label):** وزن متوسط 500، والشارات الصغيرة 12 بكسل بوزن 700.
- **الأسعار (price):** عريضة بالكحلي دائماً، وبأرقام 0-9 لتجنب الالتباس، والعملة بعد الرقم: "129 ر.س".
- **الحقول:** 16 بكسل على الجوال حتى لا يكبّر المتصفح الصفحة تلقائياً عند الكتابة.

## Layout

- **الشبكة:** حاوية بعرض أقصى 1280 بكسل في المنتصف، وهامش جانبي 16 بكسل على الجوال و24 على الحاسوب (`page-container`).
- **الرأس على الحاسوب:** صف كحلي فيه الشعار والبحث العريض وأيقونتا المفضلة والسلة بعدّاداتهما، وتحته صف أبيض فيه زر "كل الفئات" بقائمة كبيرة وروابط التسوق.
- **الرأس على الجوال:** صف كحلي فيه زر القائمة والشعار والأيقونات، وتحته البحث بعرض كامل داخل الكحلي.
- **شريط التنقل السفلي على الجوال:** ثابت بارتفاع 64 بكسل: الرئيسية، الفئات، البحث، المفضلة، السلة. وتُترك له مساحة أسفل كل صفحة.
- **ترتيب الصفحة الرئيسية:** شرائح العرض الرئيسي، شريط الثقة، ثلاث بطاقات عروض، الفئات، الأكثر مبيعاً، بطاقتا عرض، الرائج بتبويبات الفئات، وصل حديثاً مع بطاقة عرض، عروض بعدّاد تنازلي، آراء العملاء، ثم التذييل.
- **صفوف المنتجات:** تُسحب أفقياً على كل الشاشات، مع زرّي تمرير دائريين في رأس القسم على الحاسوب.
- **شبكة المنتجات في القوائم:** عمودان على الجوال، 3 على اللوحي، 4 على الحاسوب (3 عند وجود شريط الفلاتر الجانبي).
- **مقياس المسافات:** مضاعفات 4 بكسل. المسافة بين أقسام الصفحة 48 إلى 64 بكسل، وداخل البطاقات 12 إلى 16 بكسل.
- **اللمس:** كل عنصر قابل للنقر بارتفاع 44 بكسل على الأقل، والشرائح الصغيرة 36 بكسل مع مسافات بينها.
- **الاتجاه:** استخدم الخصائص المنطقية دائماً (`ms` و`me` و`ps` و`pe` و`start` و`end`) بدل اليسار واليمين.

## Elevation & Depth

التصميم **مسطح بحدود خفيفة** وليس بظلال ثقيلة.

- البطاقات بيضاء بحد رمادي خفيف (#e5e5e5)، وعند المرور يظهر ظل خفيف ويكبر الحد قليلاً.
- الظل مسموح فقط للعناصر العائمة: قائمة الفئات الكبيرة، واقتراحات البحث، ونافذة السلة، والإشعارات.
- الرأس الكحلي ثابت أعلى الصفحة، وشريط الجوال السفلي ثابت أسفلها بحد علوي خفيف.

## Shapes

- **الأزرار:** حبوب بزوايا دائرية بالكامل (`full`)، وكذلك حقل البحث والتبويبات والشرائح.
- **البطاقات وبطاقات العروض والصور:** 5 بكسل (`lg`).
- **الحقول العادية (الكمية والفلاتر):** 5 بكسل (`lg`).
- **الشارات الصغيرة، مثل الخصم:** 3 بكسل (`sm`).
- **الدوائر تبقى دوائر:** أزرار التمرير، وعدّادات الرأس، ودوائر الألوان في الفلاتر والمتغيرات.

## Components

- **الزر الرئيسي (button-cta):** كهرماني بنص داكن، حبة بارتفاع 44 بكسل، للفعل الأهم في المنطقة: "أضف للسلة"، "تسوّق الآن"، "إتمام الطلب".
- **الزر الكحلي (button-primary):** للفعل الثاني القوي: "اشترِ الآن"، "عرض السلة".
- **الزر الثانوي (button-outline):** أبيض بحد رمادي، للأفعال البديلة مثل "مسح الفلاتر" و"متابعة التسوق".
- **حقل البحث:** حبة بيضاء داخل الرأس الكحلي، وزر بحث كهرماني دائري في نهايتها. الاقتراحات تعرض صورة المنتج وسعره.
- **عدّادات الرأس:** دائرة كهرمانية صغيرة فوق أيقونتي المفضلة والسلة، ولا تظهر عند الصفر.
- **القائمة الكبيرة:** زر "كل الفئات" يفتح لوحة بيضاء بأعمدة، لكل فئة رئيسية عمود بفئاتها الفرعية.
- **شرائح العرض الرئيسي:** تُسحب باللمس، مع نقاط وأسهم، دون تشغيل تلقائي. كل شريحة: شارة خصم، عنوان، "يبدأ من" والسعر، وزر.
- **بطاقات العروض:** خلفية ملونة وشارة داكنة صغيرة ("خصم حتى 20%")، والعنوان والسعر ورابط "تسوّق الآن"، وصورة المنتج.
- **مربعات الفئات:** صورة الفئة على لون باستيل، والاسم تحتها.
- **بطاقة المنتج:** بطاقة بيضاء بحد خفيف: الصورة، ثم اسم الفئة بالرمادي، ثم الاسم في سطرين كحد أقصى، ثم السعر بالكحلي. شارة الخصم كهرمانية في الزاوية العليا من جهة البداية، وزر القلب في الزاوية الأخرى. زر "أضف للسلة" (أو "اختر الخيارات" للمنتجات متعددة الخيارات) ظاهر دائماً أسفل البطاقة.
- **التبويبات:** حبة كهرمانية للتبويب النشط، ونص داكن للبقية.
- **العدّاد التنازلي:** يظهر فقط لمنتج له تاريخ انتهاء عرض حقيقي في البيانات، ويختفي المنتج من القسم عند انتهائه.
- **نافذة السلة:** تنزلق من جهة النهاية، فيها المنتجات بصورها وخياراتها، ومحدد الكمية، والحذف، والمجموع، وزرّا "عرض السلة" و"متابعة التسوق".
- **شريط المساعدة:** شريط كهرماني فوق التذييل يدعو للتواصل.
- **التذييل:** كحلي بأعمدة روابط بالرمادي الفاتح، وسطر الحقوق في الأسفل.
- **الحالات الفارغة:** إطار متقطع وأيقونة في دائرة رمادية وجملة توضح ما حدث وزر لما يمكن فعله.
- **التحميل:** هياكل رمادية نابضة بنفس شكل المحتوى، بدل مؤشرات الدوران.
- **الأيقونات:** مكتبة Lucide بخط رفيع، والأسهم تنعكس تلقائياً في الاتجاه العربي.

## Do's and Don'ts

- افعل: ابدأ أي تصميم من شاشة الجوال ثم وسّعه.
- افعل: استخدم الكهرماني لفعل واحد بارز في كل منطقة، والكحلي للفعل الثاني.
- افعل: حافظ على تباين 4.5:1 على الأقل لكل نص، وافحصه بالأمر `pnpm design:lint`.
- افعل: اكتب الأعداد بصيغ الجمع العربية الصحيحة: "منتج واحد"، "منتجان"، "5 منتجات"، "20 منتجاً".
- افعل: أظهر الشحن والإجمالي قبل أي تأكيد، ولا تفاجئ الزائر بأي مبلغ.
- لا تفعل: لا تكتب نصاً كهرمانياً على خلفية بيضاء، فتباينه 1.7:1 فقط. الكهرماني خلفية لنص داكن.
- لا تفعل: لا تعرض أرقاماً وهمية مثل "25 شخصاً يشاهدون الآن" أو "شخص اشترى للتو"، ولا عدّاداً تنازلياً دون تاريخ حقيقي.
- لا تفعل: لا تخفِ زر الإضافة للسلة أو أي معلومة مهمة خلف تمرير الفأرة، لأن الجوال لا يملك ذلك.
- لا تفعل: لا تشغّل الشرائح المتحركة تلقائياً، فالزائر يقرر متى ينتقل.
- لا تفعل: لا تستخدم أكثر من خط واحد، ولا أوزاناً غير 400 و500 و700.
- لا تفعل: لا تستخدم الأحمر إلا للأخطاء والنفاد.
- لا تفعل: لا تستخدم left وright في التنسيق، بل start وend.
- لا تفعل: لا تضع نصاً مهماً فوق صورة دون طبقة تضمن قراءته.
