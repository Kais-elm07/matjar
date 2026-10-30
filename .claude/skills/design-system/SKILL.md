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

القيم مطبّقة في `src/app/globals.css` كمتغيرات shadcn (بصيغة oklch)، فتُستخدم عبر هذه الأصناف:

| قيمة DESIGN.md                         | الصنف في الكود                                               |
| -------------------------------------- | ------------------------------------------------------------ |
| `colors.primary`                       | `bg-primary` / `text-primary` / `border-primary`             |
| `colors.on-primary`                    | `text-primary-foreground`                                    |
| `colors.primary-soft`                  | `bg-primary/10`                                              |
| `colors.ring`                          | `ring-ring/50` (يأتي تلقائياً في مكونات ui)                  |
| `colors.background` و `colors.surface` | `bg-background` / `bg-card`                                  |
| `colors.foreground`                    | `text-foreground`                                            |
| `colors.surface-muted`                 | `bg-muted`                                                   |
| `colors.muted-foreground`              | `text-muted-foreground`                                      |
| `colors.border`                        | `border` / `border-border`                                   |
| `colors.sale`                          | `bg-destructive` / `text-destructive`                        |
| `colors.warning`                       | `text-amber-700`                                             |
| `rounded.lg` / `xl` / `2xl` / `full`   | `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-full` |
| `typography.headline-display`          | `text-3xl md:text-5xl font-extrabold`                        |
| `typography.headline-lg`               | `text-2xl md:text-3xl font-bold`                             |
| `typography.headline-md`               | `text-xl md:text-2xl font-bold`                              |
| `typography.body-md`                   | `text-base leading-7` (النصوص الطويلة `leading-8`)           |
| `typography.body-sm`                   | `text-sm`                                                    |
| `typography.label-md`                  | `text-sm font-medium`                                        |
| `typography.label-sm`                  | `text-xs font-bold`                                          |
| `typography.price-lg` / `price-md`     | `text-2xl md:text-3xl font-bold` / `text-base font-bold`     |
| `spacing.gutter-*` و `container-max`   | `page-container`                                             |
| `spacing.touch-target`                 | زر `size="xl"` أو `size="icon-xl"`، أو `h-11`                |

## قواعد لا تُكسر

- الواجهة من اليمين لليسار: استخدم `ms-` و`me-` و`ps-` و`pe-` و`start-` و`end-`، ولا تستخدم `ml-` و`mr-` و`left-` و`right-`. الأسهم التي تعني "التالي" تأخذ `rtl:rotate-180`.
- الجوال أولاً: الأصناف بلا بادئة للجوال، ثم `sm:` و`md:` و`lg:` للأكبر.
- كل عنصر قابل للنقر بارتفاع 44 بكسل على الأقل.
- خط واحد فقط (Cairo)، والأسعار بأرقام 0-9 عبر `formatPrice`.
- الأعداد بصيغ الجمع العربية الصحيحة عبر `pluralize` في `src/lib/arabic-plural.ts`.
- الأحمر للخصومات والأخطاء فقط.

## بعد التعديل

- إن عدّلت `DESIGN.md` شغّل `pnpm design:lint`، ويجب أن ينتهي بلا أخطاء ولا تحذيرات. الفحص يتحقق أيضاً من تباين الألوان (WCAG AA).
- راجع الصفحة على مقاس الجوال (375 بكسل) والحاسوب.

## تغيير هوية المتجر (الاسم والألوان والخط)

1. عدّل `DESIGN.md`: القيم في الرأس، والشرح في قسمي Overview وColors.
2. شغّل `pnpm design:lint` حتى يصبح بلا أخطاء ولا تحذيرات.
3. انقل الألوان إلى `src/app/globals.css` في قسم `:root` (المتغيرات `--primary` و`--ring` و`--sidebar-primary` وغيرها).
4. حدّث `themeColor` في `src/app/layout.tsx`، ولون `src/app/icon.svg`، واسم المتجر في `src/config/site.ts`.
5. لاستعراض صيغة الملف كاملة: `pnpm exec designmd spec`.
