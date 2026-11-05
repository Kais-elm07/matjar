import { getCheckoutConfig } from "@/lib/checkout/config"
import { deliveryTime } from "@/lib/checkout/delivery"
import { shippingFee } from "@/lib/checkout/totals"
import { formatPrice } from "@/lib/money"

/** Table of cities with delivery prices and times, from src/data/shipping.ts so it matches the checkout page. */
export function ShippingTable() {
  const config = getCheckoutConfig()
  const { cities, express, freeShippingFrom } = config

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border">
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
                  {formatPrice(shippingFee(city, "standard", config))}
                </td>
                <td className="p-3">{deliveryTime(city.days)}</td>
                <td className="p-3">
                  {city.express ? (
                    <>
                      <span className="font-bold text-primary">
                        {formatPrice(shippingFee(city, "express", config))}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        ({express.deliveryTime})
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
