---
version: alpha
name: متجري
description: >-
  الهوية البصرية لمتجر إلكتروني عربي للعرض بطابع "أناقة دافئة": واجهة من
  اليمين لليسار، مصممة للجوال أولاً، بلون طيني على خلفية كريمية ولمسة ذهبية
  توحي بالجودة والدفء. اسم المتجر مؤقت حتى اعتماد الاسم النهائي.
colors:
  primary: "#a4471f"
  on-primary: "#ffffff"
  primary-soft: "color-mix(in srgb, #a4471f 10%, #fbf8f3)"
  ring: "#da7b55"
  background: "#fbf8f3"
  foreground: "#2a211c"
  surface: "#ffffff"
  surface-muted: "#f3ede4"
  muted-foreground: "#6e6259"
  border: "#e8dfd3"
  highlight: "#c99a3d"
  on-highlight: "#2a211c"
  sale: "#b91c1c"
  on-sale: "#ffffff"
  warning: "#a16207"
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
  sm: 3.6px
  md: 4.8px
  lg: 6px
  xl: 8.4px
  2xl: 10.8px
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
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 20px
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, #a4471f 90%, #fbf8f3)"
    textColor: "{colors.on-primary}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 20px
  hero-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-display}"
    rounded: "{rounded.2xl}"
    padding: 40px
  hero-badge:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.on-highlight}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
  search-input:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 44px
  filter-chip:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 36px
    padding: 12px
  filter-chip-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  product-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
  product-card-image:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.xl}"
  category-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
  price-current:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.price-md}"
  price-old:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  badge-discount:
    backgroundColor: "{colors.sale}"
    textColor: "{colors.on-sale}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    padding: 6px
  stock-low:
    backgroundColor: "{colors.background}"
    textColor: "{colors.warning}"
    typography: "{typography.label-md}"
  focus-ring:
    backgroundColor: "{colors.ring}"
    size: 3px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  site-header:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    height: 64px
---

# الهوية البصرية لمتجري

هذا الملف هو المرجع الوحيد لشكل المتجر. أي صفحة أو مكوّن جديد يتبع القيم والقواعد هنا.
الألوان مطبّقة في الكود داخل `src/app/globals.css` بنفس قيم hex المكتوبة هنا، والزوايا عبر المتغير `--radius`.
عند تغيير الهوية: عدّل هذا الملف أولاً، ثم افحصه بالأمر `pnpm design:lint`، ثم انقل القيم إلى `globals.css`.

## Overview

متجر عربي بطابع **أناقة دافئة**: راقٍ وهادئ دون تكلّف، وواضح لدرجة أن الزائر يجد المنتج ويفهم سعره ويضيفه للسلة دون تفكير.

- **الشخصية:** دافئة وواثقة وحِرَفية، أقرب إلى متجر مختار بعناية منها إلى منصة تخفيضات صاخبة.
- **الجمهور:** متسوقون عرب يتصفحون غالباً من الجوال، بعضهم قليل الخبرة بالتسوق الإلكتروني.
- **الإحساس المطلوب:** خلفية كريمية هادئة، ولون طيني واحد يقود كل فعل مهم، ولمسة ذهبية نادرة، ونصوص كبيرة سهلة القراءة.
- **الاتجاه:** الواجهة كلها من اليمين لليسار. المحاذاة والأسهم والقوائم المنزلقة تبدأ من اليمين.
- **الجوال أولاً:** كل تصميم يبدأ من عرض 375 بكسل ثم يتوسع للحاسوب.

## Colors

لوحة دافئة مستوحاة من الطين والرمل: درجات كريمية وبنية للمساحات والنصوص، ولون طيني للفعل، وذهبي للمسات قليلة، وأحمر للخصومات فقط.

- **الطيني (primary, #a4471f):** لون الأفعال الأساسية والروابط والعناصر المختارة والقسم الترحيبي. لا يُستخدم للنصوص الطويلة.
- **النص على الطيني (on-primary, #ffffff):** أبيض للنص فوق اللون الأساسي، بتباين 6:1.
- **الطيني الفاتح (primary-soft):** خلفية الخيار المختار في الفلاتر والأزرار الشبيهة بالشرائح، بتباين 4.9:1 مع النص الطيني.
- **حلقة التركيز (ring, #da7b55):** طيني فاتح حول العنصر عند التنقل بلوحة المفاتيح.
- **الخلفية الكريمية (background, #fbf8f3):** خلفية كل الصفحات والرأس وبطاقات المنتجات.
- **السطح الأبيض (surface, #ffffff):** للعناصر التي تحتاج أن تبرز فوق الكريمي: القوائم العائمة والنوافذ وبطاقات الفئات.
- **السطح الرملي (surface-muted, #f3ede4):** خلفية الصور والحقول وأقسام المعلومات الثانوية.
- **النص البني الداكن (foreground, #2a211c):** للعناوين والأسعار والنصوص، بتباين 14.9:1 على الكريمي.
- **النص الثانوي (muted-foreground, #6e6259):** للأوصاف القصيرة والأعداد والسعر قبل الخصم، بتباين 5.6:1 على الكريمي.
- **الحدود (border, #e8dfd3):** فواصل وحدود البطاقات والحقول.
- **الذهبي (highlight, #c99a3d):** لمسة مميزة نادرة، مثل شارة القسم الترحيبي، والنص فوقه بني داكن (on-highlight) بتباين 6.1:1.
- **أحمر الخصم (sale, #b91c1c):** شارة نسبة الخصم ورابط "العروض" ورسائل الخطأ فقط.
- **الكهرماني (warning, #a16207):** تنبيه "بقي عدد قليل" في صفحة المنتج.

## Typography

خط واحد فقط في كل الموقع: **IBM Plex Sans Arabic**، مستضاف داخل المشروع في `src/fonts`، بملفات للحروف العربية وملفات للأرقام والحروف اللاتينية.
الملفات نسخ مصغّرة تحوي حروف المتجر فقط، يولّدها الأمر `pnpm fonts` من الأصول في `assets/fonts`، فيبقى حجم الخط كله 66 كيلوبايت.
الخط ثابت الأوزان، والمتوفر منه ثلاثة فقط: 400 للنصوص، و500 للأسماء والأزرار، و700 للعناوين والأسعار.

- **العناوين (headline):** عريضة (700) مع تباعد أسطر مريح للحروف العربية. لكل عنوان قيمة للجوال وأخرى للحاسوب.
- **النصوص (body):** 16 بكسل كحد أدنى للنص الأساسي، بتباعد أسطر 1.75 لأن الحروف العربية تحتاج مساحة رأسية أكبر من اللاتينية.
- **الأسماء والأزرار (label):** وزن متوسط 500، والشارات الصغيرة 12 بكسل بوزن 700.
- **الأسعار (price):** عريضة دائماً، وبأرقام 0-9 لتجنب الالتباس، والعملة بعد الرقم: "129 ر.س".
- **الحقول:** 16 بكسل على الجوال حتى لا يكبّر المتصفح الصفحة تلقائياً عند الكتابة.

## Layout

- **الشبكة:** حاوية بعرض أقصى 1280 بكسل في المنتصف، وهامش جانبي 16 بكسل على الجوال و24 على الحاسوب (`page-container`).
- **مقياس المسافات:** مضاعفات 4 بكسل. المسافة بين أقسام الصفحة 48 إلى 64 بكسل، وداخل البطاقات 16 بكسل.
- **شبكة المنتجات:** عمودان على الجوال، 3 على اللوحي، 4 على الحاسوب (3 عند وجود شريط الفلاتر الجانبي).
- **صفوف الرئيسية:** تُسحب أفقياً على الجوال، وتصبح شبكة على الشاشات الأكبر.
- **الرأس:** ثابت أعلى الصفحة بارتفاع 64 بكسل، والبحث في سطر مستقل تحته على الجوال.
- **الفلاتر:** شريط جانبي على الحاسوب، ونافذة منزلقة من الأسفل على الجوال.
- **اللمس:** كل عنصر قابل للنقر بارتفاع 44 بكسل على الأقل، والشرائح الصغيرة 36 بكسل مع مسافات بينها.
- **الاتجاه:** استخدم الخصائص المنطقية دائماً (`ms` و`me` و`ps` و`pe` و`start` و`end`) بدل اليسار واليمين.

## Elevation & Depth

التصميم **مسطح بطبقات لونية** وليس بظلال ثقيلة.

- الصفحة كريمية، والسطوح البيضاء تبرز فوقها بلونها وبحد رملي خفيف، دون ظل.
- بطاقة المنتج بلا خلفية، وتتميز بصورتها على السطح الرملي.
- الظل الخفيف مسموح فقط للعناصر العائمة: قائمة اقتراحات البحث، والإشعارات، والنوافذ المنبثقة.
- الرأس شبه شفاف مع تمويه خفيف للخلفية عند التمرير.
- التفاعل يظهر بتكبير خفيف للصورة (5%) عند المرور فوق البطاقة، لا برفعها.

## Shapes

زوايا **صغيرة ومرتبة** تعطي إحساساً بالدقة والأناقة، مع دائرية خفيفة تمنع الحدة.

- الأزرار والحقول وحقل البحث والشرائح: 6 بكسل (`lg`).
- البطاقات وصور المنتجات: 8.4 بكسل (`xl`).
- القسم الترحيبي ومعرض المنتج: 10.8 بكسل (`2xl`).
- الشارات الصغيرة، مثل الخصم وشارة القسم الترحيبي: 4.8 بكسل (`md`).
- الدوائر تبقى دوائر: الأيقونات داخل دائرة، وعدّاد السلة، ودوائر الألوان في الفلاتر والمتغيرات بحد رفيع يُظهر اللون الأبيض.

## Components

- **الزر الأساسي:** طيني بنص أبيض، بارتفاع 44 بكسل. عند المرور يفتح لونه 10% فقط ليبقى التباين فوق 4.5:1. زر واحد أساسي فقط في كل منطقة من الصفحة.
- **الزر الثانوي:** بلون الخلفية بحد رملي ونص داكن، للأفعال البديلة مثل "العروض" و"مسح الفلاتر".
- **القسم الترحيبي:** طيني بنص أبيض، وفوق العنوان شارة ذهبية صغيرة، وزر بلون الخلفية الكريمية ونص طيني.
- **حقل البحث:** مستطيل بزوايا 6 بكسل وخلفية رملية وأيقونة البحث في بدايته، وتظهر الاقتراحات في قائمة بيضاء عائمة تحته.
- **بطاقة المنتج:** صورة مربعة على سطح رملي، ثم الاسم في سطرين كحد أقصى، ثم السعر. شارة الخصم في الزاوية العليا من جهة البداية، و"نفد من المخزون" شريط أسفل الصورة. البطاقة كلها قابلة للنقر.
- **بطاقات الفئات والمزايا:** سطح أبيض بحد رملي على الخلفية الكريمية.
- **السعر:** السعر الحالي عريض، والسعر قبل الخصم مشطوب ورمادي بعده، و"من" قبل السعر إن اختلفت أسعار المتغيرات.
- **شرائح الفلاتر:** بزوايا 6 بكسل وحد رملي، والمختارة بخلفية طينية فاتحة ونص طيني.
- **اختيار المتغيرات:** أزرار مربعة بارتفاع 44 بكسل، والمختار بحد طيني. القيمة النافدة مشطوبة لكنها قابلة للاختيار لتوضيح النفاد، والتركيبة غير الموجودة معطلة.
- **الحالات الفارغة:** إطار متقطع وأيقونة في دائرة رملية وجملة توضح ما حدث وزر لما يمكن فعله.
- **التحميل:** هياكل رملية نابضة بنفس شكل المحتوى، بدل مؤشرات الدوران.
- **الأيقونات:** مكتبة Lucide بخط رفيع، والأسهم تنعكس تلقائياً في الاتجاه العربي.

## Do's and Don'ts

- افعل: ابدأ أي تصميم من شاشة الجوال ثم وسّعه.
- افعل: استخدم اللون الطيني لفعل واحد بارز في كل منطقة، مثل "أضف للسلة" أو "تسوّق الآن".
- افعل: حافظ على تباين 4.5:1 على الأقل لكل نص، وافحصه بالأمر `pnpm design:lint`.
- افعل: اكتب الأعداد بصيغ الجمع العربية الصحيحة: "منتج واحد"، "منتجان"، "5 منتجات"، "20 منتجاً".
- افعل: أظهر الشحن والإجمالي قبل أي تأكيد، ولا تفاجئ الزائر بأي مبلغ.
- لا تفعل: لا تستخدم أكثر من خط واحد، ولا أوزاناً غير 400 و500 و700.
- لا تفعل: لا تكتب نصاً ذهبياً على خلفية فاتحة، فتباينه ضعيف. الذهبي خلفية لنص بني داكن فقط، وفي موضع أو اثنين في الصفحة.
- لا تفعل: لا تستخدم الأحمر إلا للخصومات والأخطاء.
- لا تفعل: لا تستخدم الأبيض النقي خلفية للصفحة، فالخلفية كريمية والأبيض للسطوح البارزة فقط.
- لا تفعل: لا تستخدم left وright في التنسيق، بل start وend.
- لا تفعل: لا تضع نصاً مهماً فوق صورة دون طبقة داكنة تضمن قراءته.
- لا تفعل: لا تخفِ معلومة مهمة خلف تمرير الفأرة، لأن الجوال لا يملك ذلك.
