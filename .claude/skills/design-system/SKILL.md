---
name: design-system
description: الهوية البصرية للمتجر وفق ملف DESIGN.md (صيغة Google DESIGN.md). استخدمها قبل أي عمل على الواجهة، مثل صفحة أو مكوّن جديد، أو تعديل ألوان أو خطوط أو مسافات أو أزرار، أو تغيير هوية المتجر واسمه وألوانه.
---

# نظام التصميم للمتجر

المرجع الوحيد لشكل المتجر هو الملف `DESIGN.md` في جذر المشروع. يتبع صيغة [DESIGN.md من Google](https://github.com/google-labs-code/design.md): قيم دقيقة في رأس الملف (YAML)، وشرح لكل قسم تحته.

## قبل أي عمل على الواجهة

1. اقرأ `DESIGN.md` كاملاً: القيم في الرأس، ثم أقسام Overview وComponents وDo's and Don'ts.
2. استخدم الأصناف الموجودة في الجدول أدناه، ولا تكتب ألواناً أو مقاسات جديدة مباشرة في الكود.
3. ابحث في `src/components` عن مكوّن مشابه قبل إنشاء مكوّن جديد، والتزم بشكله.
4. إن احتجت قيمة غير موجودة في DESIGN.md، أضفها إلى الملف أولاً مع شرح سببها، ثم استخدمها.

## ربط القيم بأصناف Tailwind

القيم مطبّقة في `src/app/globals.css` كمتغيرات shadcn بنفس قيم hex، فتُستخدم عبر هذه الأصناف:

| قيمة DESIGN.md                              | الصنف في الكود                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `colors.primary` (الكحلي)                   | `bg-primary` / `text-primary` / `border-primary`                            |
| `colors.on-primary`                         | `text-primary-foreground`                                                   |
| `colors.on-primary-muted`                   | `text-primary-foreground-muted` (نص ثانوي فوق الكحلي)                       |
| `colors.primary-soft`                       | `bg-primary/10`                                                             |
| `colors.highlight` (الكهرماني)              | `bg-highlight text-highlight-foreground`                                    |
| `colors.ring`                               | `ring-ring/50` (يأتي تلقائياً في مكونات ui)                                 |
| `colors.background` و `colors.surface`      | `bg-background` / `bg-card`                                                 |
| `colors.foreground`                         | `text-foreground`                                                           |
| `colors.surface-muted`                      | `bg-muted`                                                                  |
| `colors.muted-foreground`                   | `text-muted-foreground`                                                     |
| `colors.border`                             | `border` / `border-border`                                                  |
| `colors.error` / `warning` / `success`      | `text-destructive` / `text-warning` / `text-success`                        |
| `colors.tile-yellow` … `tile-orange`        | `bg-tile-yellow` / `bg-tile-green` / … (مربعات الفئات)                      |
| `button-cta` / `button-primary` / `outline` | `<Button variant="cta">` / `<Button>` / `<Button variant="outline">`        |
| `rounded.md` / `lg` / `xl` / `2xl` / `full` | `rounded-md` / `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-full` |
| `typography.headline-display`               | `text-3xl md:text-5xl font-bold`                                            |
| `typography.headline-lg`                    | `text-2xl md:text-3xl font-bold`                                            |
| `typography.headline-md`                    | `text-xl md:text-2xl font-bold`                                             |
| `typography.body-md`                        | `text-base leading-7` (النصوص الطويلة `leading-8`)                          |
| `typography.body-sm`                        | `text-sm`                                                                   |
| `typography.label-md`                       | `text-sm font-medium`                                                       |
| `typography.label-sm`                       | `text-xs font-bold`                                                         |
| `typography.price-lg` / `price-md`          | `text-2xl md:text-3xl font-bold` / `text-base font-bold`                    |
| `spacing.gutter-*` و `container-max`        | `page-container`                                                            |
| `spacing.touch-target`                      | زر `size="xl"` أو `size="icon-xl"`، أو `h-11`                               |

## قواعد لا تُكسر

- الواجهة من اليمين لليسار: استخدم `ms-` و`me-` و`ps-` و`pe-` و`start-` و`end-`، ولا تستخدم `ml-` و`mr-` و`left-` و`right-`. الأسهم التي تعني "التالي" تأخذ `rtl:rotate-180`.
- الجوال أولاً: الأصناف بلا بادئة للجوال، ثم `sm:` و`md:` و`lg:` للأكبر.
- كل عنصر قابل للنقر بارتفاع 44 بكسل على الأقل.
- خط واحد فقط (IBM Plex Sans Arabic) بثلاثة أوزان: `font-normal` و`font-medium` و`font-bold`. لا تستخدم `font-semibold` أو `font-extrabold` لأن الخط لا يملكها.
- الأسعار بأرقام 0-9 عبر `formatPrice`.
- الأعداد بصيغ الجمع العربية الصحيحة عبر `pluralize` في `src/lib/arabic-plural.ts`.
- الكهرماني (`variant="cta"`) للفعل الأهم في المنطقة، والكحلي (الزر الافتراضي) للفعل الثاني.
- الكهرماني خلفية لنص داكن فقط، ولا يُكتب نصاً على خلفية بيضاء (تباينه 1.7:1).
- الأحمر للأخطاء والنفاد فقط، وشارة الخصم كهرمانية.
- الأزرار والشرائح وحقل البحث والتبويبات حبوب (`rounded-full`)، والبطاقات والحقول العادية `rounded-lg`.
- زر الإضافة للسلة ظاهر دائماً في البطاقة، ولا شيء مهم يظهر بمرور الفأرة فقط.
- لا أرقام وهمية ("يشاهده الآن")، ولا عدّاد تنازلي دون تاريخ حقيقي في البيانات، ولا آراء عملاء مختلقة.
- الشبكة (`grid`) التي تحوي صفاً يُسحب أفقياً تحتاج `grid-cols-1` على الجوال، وإلا اتسعت الصفحة بعرض الصف.
- الحركة قصيرة (300 ملّي ثانية أو أقل) ولغرض واضح، والتمرير الناعم عبر `scrollBehavior()` في `src/lib/motion.ts` حتى يحترم إعداد "تقليل الحركة". لا حركة لإظهار المحتوى عند التمرير.
- أي نافذة أو لوحة لا تظهر إلا بضغطة تُحمَّل بـ `next/dynamic` عند فتحها أو بعد فراغ المتصفح (`useIdle` في `src/lib/use-idle.ts`)، كما في `LazyCartSheet` و`MobileNav`، حتى لا تؤخر ظهور الصفحة على الجوال.

## مكونات جاهزة قبل إنشاء جديد

- `ProductCard` و`ProductGrid` و`ProductRail` في `src/components/product`: بطاقة المنتج وشبكتها وصفها الأفقي.
- `Carousel` و`SectionHeading` في `src/components/store`: صف يُسحب بأزرار تمرير، وعنوان قسم مع "عرض الكل".
- `PromoCard` و`SpotlightCard` و`WideBanner` و`BANNER_THEME` في `src/components/home`: بطاقات العروض بسماتها الثلاث.
- `useAddToCart` و`QuantityStepper` في `src/components/cart`: الإضافة للسلة مع فتح نافذتها، ومحدد الكمية.
- `Tabs` في `src/components/ui/tabs.tsx`: تبويبات خفيفة بواجهة shadcn دون Base UI، وكل لوحاتها في HTML.
- `toast` في `src/lib/toast.ts`: رسائل التنبيه القصيرة، تُحمّل مكتبتها عند أول رسالة. لا تستورد من `sonner` مباشرة.
- `openGraph` و`shareImages` في `src/lib/seo.ts`: بيانات المشاركة لأي صفحة جديدة مع صورتها.

## بعد التعديل

- إن عدّلت `DESIGN.md` شغّل `pnpm design:lint`، ويجب أن ينتهي بلا أخطاء ولا تحذيرات. الفحص يتحقق أيضاً من تباين الألوان (WCAG AA).
- راجع الصفحة على مقاس الجوال (375 بكسل) والحاسوب.

## تغيير هوية المتجر (الاسم والألوان والخط)

1. عدّل `DESIGN.md`: القيم في الرأس، والشرح في قسمي Overview وColors.
2. شغّل `pnpm design:lint` حتى يصبح بلا أخطاء ولا تحذيرات.
3. انسخ الألوان بنفس قيم hex إلى `src/app/globals.css` في قسم `:root` (المتغيرات `--primary` و`--ring` و`--sidebar-primary` وغيرها)، والزوايا إلى `--radius` (قيمة `rounded.lg`).
4. حدّث `themeColor` في `src/app/layout.tsx`، ولون `src/app/icon.svg`، واسم المتجر في `src/config/site.ts`.
5. لتغيير الخط: ضع ملفات woff2 الأصلية من Fontsource مع ترخيصها في `assets/fonts/<اسم-الخط>`، وشغّل `pnpm fonts` ليولّد نسخها المصغّرة في `src/fonts/<اسم-الخط>`، ثم حدّث `localFont` في `src/app/layout.tsx`. ملف للحروف العربية وآخر للاتينية، ولكل وزن ملف إن لم يكن الخط متغير الوزن. احذف مجلد الخط القديم من المكانين.
6. لاستعراض صيغة الملف كاملة: `pnpm exec designmd spec`.
