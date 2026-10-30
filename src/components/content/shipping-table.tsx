import { formatPrice } from "@/lib/catalog/money"
import { getCheckoutConfig } from "@/lib/checkout/config"
import { deliveryTime } from "@/lib/checkout/delivery"

/** جدول المدن وأسعار التوصيل ومدته، مأخوذ من src/data/shipping.ts فيبقى مطابقاً لصفحة الطلب. */
export function ShippingTable() {
  const { cities, express, freeShippingFrom } = getCheckoutConfig()

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[32rem] text-sm">
          <caption className="sr-only">أسعار ومدة التوصيل حسب المدينة</caption>
          <thead className="bg-muted text-start">
            <tr>
              <th scope="col" className="p-3 text-start font-bold">
                المدينة
              </th>
              <th scope="col" className="p-3 text-start font-bold">
                التوصيل العادي
              </th>
              <th scope="col" className="p-3 text-start font-bold">
                المدة
              </th>
              <th scope="col" className="p-3 text-start font-bold">
                التوصيل السريع
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cities.map((city) => (
              <tr key={city.name}>
                <th scope="row" className="p-3 text-start font-medium">
                  {city.name}
                </th>
                <td className="p-3 font-bold text-primary">
                  {formatPrice(city.fee)}
                </td>
                <td className="p-3">{deliveryTime(city.days)}</td>
                <td className="p-3">
                  {city.express ? (
                    <>
                      <span className="font-bold text-primary">
                        {formatPrice(city.fee + express.extraFee)}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        ({express.label})
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">غير متاح</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        الشحن العادي مجاني للطلبات من{" "}
        <span className="font-bold text-foreground">
          {formatPrice(freeShippingFrom)}
        </span>
        .
      </p>
    </div>
  )
}
