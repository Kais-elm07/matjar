# Testing the store with real people

Automated tests make sure the buttons work, but they cannot tell where a person gets confused. This test reveals that in about an hour, and it is the last item of phase 7 in the plan.

The testers use the Arabic store, so the tasks and questions you read to them are kept in Arabic below, each with an English translation.

## Before the test

- **Choose 3 to 5 people** who differ in age and in online shopping experience, at least one of them with little experience.
- **Each person uses their own phone**, because a familiar device is closer to real life.
- **Open the site for them:** the deployed URL, or the local network URL if they are on the same Wi-Fi network as you.
- **Only tell them:** «نختبر الموقع لا نختبرك. فكّر بصوت عالٍ، وقل ما تبحث عنه وما يحيّرك» ("We are testing the site, not you. Think out loud, and say what you are looking for and what confuses you."). The orders are demos, and nothing is paid.
- **Don't help or explain**, even if the person stumbles. Note where they stopped; that is exactly what you are looking for. If someone is stuck for more than two minutes, move on to the next task.

## The tasks

Read each task as written, without pointing to where it is on the site:

1. ابحث عن ساعة يد، واعرف سعرها قبل الخصم وبعده.
   _(Find a wristwatch, and find out its price before and after the discount.)_
2. اختر القميص القطني الكلاسيكي بمقاس L ولون أزرق، وأضفه إلى السلة.
   _(Choose the classic cotton shirt in size L and blue, and add it to the cart.)_
3. احفظ منتجاً عليه خصم في المفضلة، ثم افتح المفضلة وتأكد أنه فيها.
   _(Save a discounted product to the wishlist, then open the wishlist and check that it is there.)_
4. اجعل كمية القميص في السلة قطعتين.
   _(Change the quantity of the shirt in the cart to two.)_
5. أتمم الطلب إلى مدينة جدة بالدفع عند الاستلام، واستخدم كوبون الخصم WELCOME10.
   _(Place the order for delivery to Jeddah with cash on delivery, and use the discount coupon WELCOME10.)_
6. اعرف كم يكلف الشحن إلى مدينتك، ومتى يصل الطلب.
   _(Find out how much shipping to your city costs, and when the order arrives.)_
7. اعرف كيف ترجع منتجاً لم يناسبك.
   _(Find out how to return a product that didn't suit you.)_

## What to record

Keep a table like this for each person. "Hesitated" means any moment when they stopped, tapped the wrong thing, or said "Where...?":

| Task | Done? | Time (approx.) | Where they hesitated or made a mistake | What they said |
| ---- | ----- | -------------- | -------------------------------------- | -------------- |
| 1    |       |                |                                        |                |
| 2    |       |                |                                        |                |
| 3    |       |                |                                        |                |
| 4    |       |                |                                        |                |
| 5    |       |                |                                        |                |
| 6    |       |                |                                        |                |
| 7    |       |                |                                        |                |

## Questions after the test

- ما أصعب شيء واجهته؟ _(What was the hardest thing you ran into?)_
- هل كان هناك شيء لم تفهمه أو كلمة غير واضحة؟ _(Was there anything you didn't understand, or a word that wasn't clear?)_
- ما الذي أعجبك؟ _(What did you like?)_
- لو كان المتجر حقيقياً، هل كنت ستشتري منه؟ ولماذا؟ _(If the store were real, would you buy from it? Why?)_
- على 10، كم تعطي سهولة استخدامه؟ _(Out of 10, how easy was it to use?)_

## After the tests

- A problem that came up with two or more people is a real problem in the site, not in the people.
- Share the tables, or a summary of them, in a Claude Code session, so the recurring problems are fixed before deployment.
- The phase's success criterion: every tester completed the order (task 5) without help.
