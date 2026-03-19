import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // 1. 鉴权：获取当前用户
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 2. 提取 URL 上的参数（解析 Next.js 15+ 异步 searchParams）
  const params = await searchParams;
  const successOrderNumber = params?.success;

  // 3. 数据库查询：拉取该用户的所有订单，并携带订单里的商品明细
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    with: {
      items: true, // 极其优雅的关联查询，拉出刚才你写入的 orderItems
    },
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🎉 刚刚下单成功的提示横幅 */}
        {successOrderNumber && (
          <div className="mb-12 bg-green-50/50 border border-green-200 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="text-green-600 mb-2" size={32} strokeWidth={1.5} />
            <h2 className="text-lg font-serif tracking-widest uppercase text-green-900">
              Order Confirmed
            </h2>
            <p className="text-sm text-green-700 tracking-wide font-light">
              Thank you for your purchase. Your order <span className="font-medium">{successOrderNumber}</span> is currently being processed.
            </p>
          </div>
        )}

        {/* 头部标题 */}
        <div className="mb-16 space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-zinc-900">
            Order History
          </h1>
          <div className="h-[1px] w-16 bg-zinc-300"></div>
        </div>

        {/* 订单列表渲染 */}
        {userOrders.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 space-y-4">
            <p className="text-sm tracking-[0.1em] uppercase">You have no previous orders.</p>
            <Link href="/shop" className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 underline underline-offset-4">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {userOrders.map((order) => (
              <div key={order.id} className="bg-white border border-zinc-200">
                {/* 订单信息头 */}
                <div className="bg-zinc-50 p-6 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">Order Number</p>
                    <p className="text-sm font-medium tracking-wider">{order.orderNumber}</p>
                  </div>
                  <div className="space-y-1 sm:text-right">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">Date Placed</p>
                    <p className="text-sm font-medium tracking-wider">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1 sm:text-right">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">Total Amount</p>
                    <p className="text-sm font-medium tracking-wider">RM {order.totalAmount}</p>
                  </div>
                  <div className="space-y-1 sm:text-right">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">Status</p>
                    <span className="inline-block px-3 py-1 bg-zinc-200 text-zinc-800 text-[10px] font-bold tracking-[0.1em] uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* 订单包含的商品明细 */}
                <div className="p-6">
                  <div className="divide-y divide-zinc-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                        <div className="relative w-20 aspect-[4/5] bg-zinc-100 shrink-0">
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={`/product/${item.productSlug}`} className="text-sm font-serif tracking-widest uppercase hover:text-zinc-500 transition-colors">
                                {item.productName}
                              </Link>
                              <p className="text-xs text-zinc-500 mt-2 tracking-wide">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium tracking-wider">
                              RM {item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}