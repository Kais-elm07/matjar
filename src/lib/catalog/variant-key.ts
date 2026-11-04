/**
 * مفتاح ثابت لتركيبة خيارات المتغير، مثل "اللون=أزرق|المقاس=M"، لا يتأثر بترتيب الحقول.
 * يقارن بين متغيرين أو بين نسختين من البيانات (السلة المحفوظة والموقع المنشور).
 * في ملف مستقل صغير لأن السلة تحتاجه في كل صفحة، دون جداول الألوان والمقاسات في options.ts.
 */
export function optionsKey(options: Record<string, string>) {
  return Object.keys(options)
    .sort()
    .map((name) => `${name}=${options[name]}`)
    .join("|")
}
