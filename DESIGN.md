---
version: alpha
name: متجري
description: >-
  الهوية البصرية لمتجر إلكتروني عربي للعرض بطابع "بساطة عصرية": خلفية بيضاء
  وخط واحد هادئ، وصور كبيرة، ورأس شفاف فوق واجهة بعرض الشاشة، وبطاقات منتجات
  مفصولة بخطوط رفيعة بدل الإطارات، وتذييل كحلي بجملة كبيرة. الكحلي للهيكل
  والأزرار، والكهرماني لشارات الخصم فقط. اسم المتجر مؤقت حتى اعتماد الاسم النهائي.
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
typography:
  headline-display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.2
  headline-display-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 34px
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
  tab-bar-height: 64px
components:
  button-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-cta-hover:
    backgroundColor: "color-mix(in srgb, #1d2733 90%, #ffffff)"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 24px
  button-on-image:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 28px
  site-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    height: 64px
  header-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
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
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    height: 32px
  whatsapp-button:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 56px
  hero-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-display}"
    padding: 24px
  promo-tag:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px
  category-tile:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
  section-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 20px
  carousel-arrow:
    backgroundColor: "{colors.background}"
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
  site-footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
  footer-statement:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-lg}"
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
  share-image:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-display}"
    padding: 48px
  share-image-meta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary-muted}"
    typography: "{typography.body-lg}"
  share-image-price:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.highlight}"
    typography: "{typography.headline-display}"
---

# الهوية البصرية لمتجري

هذا الملف هو المرجع الوحيد لشكل المتجر. أي صفحة أو مكوّن جديد يتبع القيم والقواعد هنا.
الألوان مطبّقة في الكود داخل `src/app/globals.css` بنفس قيم hex المكتوبة هنا، والزوايا عبر المتغير `--radius`.
عند تغيير الهوية: عدّل هذا الملف أولاً، ثم افحصه بالأمر `pnpm design:lint`، ثم انقل القيم إلى `globals.css`.

## Overview

متجر عربي بطابع **بساطة عصرية**: صفحات بيضاء هادئة تترك المساحة للصور والمنتجات، ويجد فيها الزائر المنتج ويفهم سعره ويضيفه للسلة دون تشتيت.

- **مصدر الإلهام:** مزيج اختاره صاحب المشروع من ثلاثة متاجر حقيقية وصل إليها عبر معارض التصميم (recent.design ودليل designeer.xyz): الرأس الشفاف من Cowboy، والواجهة بعرض الشاشة وشبكة البطاقات من Qiqi، والتذييل الداكن بجملة كبيرة من The Other Glasses. أُعيد بناء الأفكار بالعربية ومن اليمين لليسار، ولم يُنسخ كود أي موقع ولا صوره.
- **الشخصية:** هادئة وواثقة وأنيقة، تشبه علامات المنتجات الحديثة لا الأسواق المزدحمة.
- **الجمهور:** متسوقون عرب يتصفحون غالباً من الجوال، بعضهم قليل الخبرة بالتسوق الإلكتروني.
- **الإحساس المطلوب:** صورة كبيرة تستقبل الزائر، ورأس خفيف يختفي خلفها ثم يعود أبيض عند التمرير، وبطاقات تفصلها خطوط رفيعة، ولون واحد (الكحلي) يقود العين إلى الفعل التالي.
- **الاتجاه:** الواجهة كلها من اليمين لليسار. المحاذاة والأسهم والقوائم المنزلقة تبدأ من اليمين.
- **الجوال أولاً:** كل تصميم يبدأ من عرض 375 بكسل، مع شريط تنقل ثابت أسفل الشاشة.

## Colors

لون واحد للهوية هو الكحلي، والكهرماني لشارات الخصم فقط، والبقية أبيض ورماديات محايدة.

- **الكحلي (primary, #1d2733):** الأزرار الرئيسية، والأسعار، والروابط، والعناصر المختارة، وخلفية التذييل. النص فوقه أبيض بتباين 15:1.
- **الرمادي الفاتح على الكحلي (on-primary-muted, #bbbec2):** روابط التذييل والنصوص الثانوية فوق الكحلي، بتباين 8:1.
- **الكحلي الفاتح (primary-soft):** خلفية الخيار المختار في الفلاتر.
- **الكهرماني (highlight, #febd69):** شارات الخصم فقط، وفي صور المشاركة. لا يُستخدم للأزرار ولا للخلفيات الكبيرة. النص فوقه داكن (on-highlight, #111111) بتباين 11.4:1.
- **حلقة التركيز (ring, #d97706):** كهرماني داكن يظهر بوضوح على الأبيض (3.2:1) وعلى الكحلي (4.7:1).
- **الخلفية والسطوح (background و surface, #ffffff):** أبيض لكل الصفحات والبطاقات.
- **السطح الرمادي (surface-muted, #f5f5f5):** حقل البحث، ومربعات الفئات، وبطاقات الآراء، وخلفية الصور التي لم تُحمَّل بعد.
- **النص الأساسي (foreground, #111111):** العناوين وأسماء المنتجات، وخلفية شريط الإعلان.
- **النص الثانوي (muted-foreground, #666666):** الأوصاف وأسماء الفئات في البطاقات والسعر قبل الخصم، بتباين 5.7:1.
- **الحدود (border, #e5e5e5):** الخطوط الفاصلة بين البطاقات، وحدود الحقول.
- **الأحمر (error, #dc2626):** رسائل الخطأ و"نفد من المخزون" فقط.
- **الكهرماني الداكن (warning, #b45309):** تنبيه "بقي عدد قليل".
- **الأخضر (success, #15803d):** حالة "متوفر" وزر واتساب.
- **النص فوق الصور:** أبيض دائماً فوق طبقة تدرج داكنة شفافة من أسفل الصورة (من 60% إلى 0%)، حتى يبقى مقروءاً مهما كانت الصورة.

## Typography

خط واحد فقط في كل الموقع: **IBM Plex Sans Arabic**، مستضاف داخل المشروع في `src/fonts`، بملفات للحروف العربية وملفات للأرقام والحروف اللاتينية.
الملفات نسخ مصغّرة تحوي حروف المتجر فقط، يولّدها الأمر `pnpm fonts` من الأصول في `assets/fonts`، فيبقى حجم الخط كله 66 كيلوبايت.
المراجع الثلاثة تستخدم خطوطاً لاتينية بلا حروف عربية، لذلك بقي IBM Plex Sans Arabic، وهو قريب منها في الهدوء.
الخط ثابت الأوزان، والمتوفر منه ثلاثة فقط: 400 للنصوص، و500 للأسماء والأزرار، و700 للعناوين والأسعار.

- **عنوان الواجهة (headline-display):** 56 بكسل على الحاسوب و34 على الجوال، أبيض فوق الصورة، في سطرين على الأكثر.
- **العناوين (headline):** عريضة (700) مع تباعد أسطر مريح للحروف العربية. لكل عنوان قيمة للجوال وأخرى للحاسوب.
- **النصوص (body):** 16 بكسل كحد أدنى للنص الأساسي، بتباعد أسطر 1.75 لأن الحروف العربية تحتاج مساحة رأسية أكبر من اللاتينية.
- **الأسماء والأزرار (label):** وزن متوسط 500، والشارات الصغيرة 12 بكسل بوزن 700.
- **الأسعار (price):** عريضة بالكحلي دائماً، وبأرقام 0-9 لتجنب الالتباس، والعملة بعد الرقم: "129 ر.س".
- **الحقول:** 16 بكسل على الجوال حتى لا يكبّر المتصفح الصفحة تلقائياً عند الكتابة.

## Layout

- **الشبكة:** حاوية بعرض أقصى 1280 بكسل في المنتصف، وهامش جانبي 16 بكسل على الجوال و24 على الحاسوب (`page-container`). الواجهة والتذييل وحدهما بعرض الشاشة كاملاً.
- **الرأس على الحاسوب:** صف واحد بارتفاع 72 بكسل: الشعار في البداية، وروابط الأقسام في المنتصف، وحقل بحث رمادي قصير ثم المفضلة والسلة وزر "تسوّق الآن" في النهاية. في الصفحة الرئيسية يكون شفافاً بنص أبيض فوق الواجهة، ويتحول إلى أبيض بحد سفلي عند التمرير أو في بقية الصفحات.
- **الرأس على الجوال:** صف واحد بارتفاع 64 بكسل: زر القائمة في البداية، والشعار في المنتصف، وزر البحث والسلة في النهاية. زر البحث يفتح حقل البحث في سطر تحت الرأس.
- **شريط التنقل السفلي على الجوال:** ثابت بارتفاع 64 بكسل: الرئيسية، الفئات، البحث، المفضلة، السلة. وتُترك له مساحة أسفل كل صفحة.
- **ترتيب الصفحة الرئيسية:** الواجهة بعرض الشاشة، ثم شريط الثقة، ثم الفئات، ثم الأكثر مبيعاً، ثم الرائج بتبويبات الفئات، ثم وصل حديثاً، ثم عروض بعدّاد تنازلي، ثم بطاقة عرض عريضة، ثم آراء العملاء، ثم التذييل.
- **صفوف المنتجات:** تُسحب أفقياً على كل الشاشات، مع زرّي تمرير دائريين في رأس القسم على الحاسوب.
- **شبكة المنتجات في القوائم:** عمودان على الجوال، 3 على اللوحي، 4 على الحاسوب (3 عند وجود شريط الفلاتر الجانبي)، والبطاقات تفصلها خطوط رفيعة بلا إطارات.
- **مقياس المسافات:** مضاعفات 4 بكسل. المسافة بين أقسام الصفحة 56 إلى 80 بكسل، وداخل البطاقات 12 إلى 16 بكسل.
- **اللمس:** كل عنصر قابل للنقر بارتفاع 44 بكسل على الأقل، والشرائح الصغيرة 36 بكسل مع مسافات بينها.
- **الاتجاه:** استخدم الخصائص المنطقية دائماً (`ms` و`me` و`ps` و`pe` و`start` و`end`) بدل اليسار واليمين.

## Elevation & Depth

التصميم **مسطح تماماً**: لا ظلال على البطاقات ولا حدود حولها، بل خطوط فاصلة رفيعة بينها.

- الظل مسموح فقط للعناصر العائمة: قائمة الفئات الكبيرة، واقتراحات البحث، ونافذة السلة، والإشعارات.
- الرأس يصبح أبيض بحد سفلي رفيع عند التمرير، وشريط الجوال السفلي ثابت بحد علوي خفيف.
- الصور تكبر قليلاً (3%) عند مرور الفأرة فوق البطاقة، وهذه الحركة الوحيدة في البطاقات.

## Shapes

- **الأزرار:** حبوب بزوايا دائرية بالكامل (`full`)، وكذلك حقل البحث والتبويبات والشرائح.
- **الصور ومربعات الفئات والحقول:** 8 بكسل (`lg`).
- **الشارات الصغيرة، مثل الخصم:** 4 بكسل (`sm`).
- **الواجهة والتذييل:** بلا زوايا، لأنهما بعرض الشاشة.
- **الدوائر تبقى دوائر:** أزرار التمرير، وعدّادات الرأس، ودوائر الألوان في الفلاتر والمتغيرات.

## Components

- **الزر الرئيسي (button-cta):** كحلي بنص أبيض، حبة بارتفاع 44 بكسل، للفعل الأهم في المنطقة: "أضف للسلة"، "إتمام الطلب"، "عرض النتائج".
- **الزر الثانوي (button-secondary):** أبيض بحد كحلي ونص كحلي، للفعل الثاني: "اشترِ الآن"، "عرض السلة".
- **الزر الخفيف (button-outline):** أبيض بحد رمادي، للأفعال البديلة مثل "مسح الفلاتر" و"متابعة التسوق".
- **الزر فوق الصورة (button-on-image):** أبيض بنص داكن فوق الواجهة والبطاقات المصوّرة، بارتفاع 48 بكسل.
- **الرأس:** صف واحد. في الرئيسية شفاف بنص أبيض فوق الواجهة، ثم أبيض بحد عند التمرير. روابط الأقسام في المنتصف، و"الفئات" يفتح لوحة كبيرة بأعمدة، وحقل البحث حبة رمادية قصيرة تتسع عند التركيز، وعدّادا المفضلة والسلة دائرتان كحليتان صغيرتان لا تظهران عند الصفر.
- **الواجهة الرئيسية:** صورة بعرض الشاشة بارتفاع 80% من الشاشة على الحاسوب و4:5 على الجوال، وتدرج داكن من الأسفل، وفي ركنها السفلي من جهة البداية: شارة صغيرة بيضاء، وعنوان كبير، وسطر وصف، وزر أبيض واحد. أكثر من شريحة تُسحب باللمس بنقاط وأسهم، دون تشغيل تلقائي.
- **مربعات الفئات:** صورة الفئة على مربع رمادي فاتح بزوايا 8 بكسل، والاسم وعدد المنتجات تحتها.
- **بطاقة المنتج:** بلا إطار ولا ظل، تفصلها عن جاراتها خطوط رفيعة. الصورة مربعة تملأ البطاقة، وفي ركنها شارة الخصم الكهرمانية وزر القلب. تحت الصورة: اسم الفئة بالرمادي في سطر، ثم الاسم والسعر الكحلي. زر "أضف للسلة" (أو "اختر الخيارات" للمنتجات متعددة الخيارات) ظاهر دائماً أسفل البطاقة، كحلي بحد بلا تعبئة.
- **التبويبات:** حبة كحلية للتبويب النشط، ونص داكن للبقية.
- **العدّاد التنازلي:** يظهر فقط لمنتج له تاريخ انتهاء عرض حقيقي في البيانات، ويختفي المنتج من القسم عند انتهائه.
- **نافذة السلة:** تنزلق من جهة النهاية، فيها المنتجات بصورها وخياراتها، ومحدد الكمية، والحذف، والمجموع، وزرّا "إتمام الطلب" و"عرض السلة".
- **إتمام الطلب:** صفحة واحدة بخطوات مرقمة في دوائر كحلية، كل خطوة في بطاقة بحد خفيف. الحقول بارتفاع 44 بكسل، والتسمية فوق الحقل، ورسالة الخطأ تحته بالأحمر. الملخص بخلفية رمادية، مثبت على الحاسوب ويُطوى على الجوال، وزر التأكيد الكحلي يحمل الإجمالي. تنبيه "متجر تجريبي" ظاهر قبل التأكيد وبعده.
- **شريط الإعلان:** سطر داكن رفيع أعلى كل الصفحات فوق الرأس، يختفي عند التمرير، بنص واحد قصير ورابط اختياري.
- **زر واتساب:** دائرة خضراء بأيقونة بيضاء في زاوية الشاشة من جهة النهاية، فوق شريط الجوال السفلي. يظهر فقط عند ضبط رقم واتساب.
- **الصفحات الثابتة:** عمود نص بعرض أقصى 768 بكسل وعناوين عريضة، وقائمة جانبية بالصفحات على الحاسوب. الأسئلة الشائعة تُفتح وتُطوى، وجدول الشحن يُبنى من ملف الشحن.
- **التذييل:** كحلي بعرض الشاشة: جملة كبيرة عن المتجر في جهة البداية مع زر "تواصل معنا"، وأعمدة الروابط بالرمادي الفاتح في جهة النهاية، ثم سطر الحقوق والشعار في الأسفل بحد علوي خفيف.
- **صور المشاركة (share-image):** تظهر عند مشاركة رابط في واتساب ومواقع التواصل، وتُولَّد وقت البناء بمقاس 1200×630: صورة لكل منتج، وصورة لكل فئة، وصورة عامة للمتجر. خلفية كحلية، والصورة مربعة على اليسار بزوايا دائرية، وعمود النص على اليمين: الشعار واسم المتجر، ثم اسم الفئة بالرمادي الفاتح، ثم الاسم بالأبيض العريض، والسعر بالكهرماني في الأسفل وبجانبه السعر قبل الخصم مشطوباً. شارة الخصم كهرمانية فوق الصورة. صورة الفئة والصورة العامة تعرضان حقيقتين فقط من بيانات المتجر: الدفع عند الاستلام وحد الشحن المجاني.
- **الحالات الفارغة:** إطار متقطع وأيقونة في دائرة رمادية وجملة توضح ما حدث وزر لما يمكن فعله.
- **التحميل:** هياكل رمادية نابضة بنفس شكل المحتوى، بدل مؤشرات الدوران.
- **الأيقونات:** مكتبة Lucide بخط رفيع، والأسهم تنعكس تلقائياً في الاتجاه العربي.

## Do's and Don'ts

- افعل: ابدأ أي تصميم من شاشة الجوال ثم وسّعه.
- افعل: استخدم الكحلي لفعل واحد بارز في كل منطقة، والزر ذا الحد الكحلي للفعل الثاني.
- افعل: حافظ على تباين 4.5:1 على الأقل لكل نص، وافحصه بالأمر `pnpm design:lint`.
- افعل: اكتب الأعداد بصيغ الجمع العربية الصحيحة: "منتج واحد"، "منتجان"، "5 منتجات"، "20 منتجاً".
- افعل: أظهر الشحن والإجمالي قبل أي تأكيد، ولا تفاجئ الزائر بأي مبلغ.
- افعل: اجعل الحركة قصيرة (300 ملّي ثانية أو أقل) ولغرض واضح، مثل انزلاق النوافذ، ونبضة القلب عند الحفظ، وانفتاح الأسئلة الشائعة. ومن طلب تقليل الحركة من إعدادات جهازه لا يرى أي حركة.
- لا تفعل: لا تستخدم الكهرماني إلا لشارات الخصم. لا أزرار ولا خلفيات كهرمانية، ولا نص كهرماني على الأبيض (تباينه 1.7:1 فقط).
- لا تفعل: لا تضع إطاراً أو ظلاً حول بطاقة المنتج، فالخطوط الفاصلة تكفي.
- لا تفعل: لا تعرض أرقاماً وهمية مثل "25 شخصاً يشاهدون الآن" أو "شخص اشترى للتو"، ولا عدّاداً تنازلياً دون تاريخ حقيقي.
- لا تفعل: لا تخفِ زر الإضافة للسلة أو أي معلومة مهمة خلف تمرير الفأرة، لأن الجوال لا يملك ذلك.
- لا تفعل: لا تشغّل الشرائح المتحركة تلقائياً، فالزائر يقرر متى ينتقل.
- لا تفعل: لا تُظهر المحتوى بحركة عند التمرير إليه، فهذا يؤخر القراءة ويثقل الصفحة على الجوال.
- لا تفعل: لا تستخدم أكثر من خط واحد، ولا أوزاناً غير 400 و500 و700.
- لا تفعل: لا تستخدم الأحمر إلا للأخطاء والنفاد.
- لا تفعل: لا تستخدم left وright في التنسيق، بل start وend.
- لا تفعل: لا تضع نصاً مهماً فوق صورة دون طبقة تدرج داكنة تضمن قراءته.
