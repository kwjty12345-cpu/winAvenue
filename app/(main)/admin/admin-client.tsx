"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Pencil } from "lucide-react"; // ✅ 新增了 Pencil 图标
import { ImageUpload } from "@/components/admin/image-upload";
import { VideoUpload } from "@/components/admin/video-upload"; 
// ✅ 新增了 updateProduct 引入
import { createProduct, createCategory, createBrand, updateOrderStatus, deleteProduct, updateProduct } from "@/app/actions/admin";

export default function AdminClient({ 
  allCategories, 
  allBrands,
  allOrders,
  allProducts 
}: { 
  allCategories: any[], 
  allBrands: any[],
  allOrders: any[],
  allProducts: any[]
}) {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "inventory">("inventory"); // 默认先看库存方便测试
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState(""); 
  const [isPending, startTransition] = useTransition();

  // ✅ 新增状态：记录当前正在编辑的商品
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`⚠️ 警告：确定要永久删除 ${productName} 吗？此操作无法撤销！`)) {
      startTransition(async () => {
        await deleteProduct(productId);
      });
    }
  };

  // ✅ 新增：处理编辑表单提交
  const handleUpdateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    const updateData = {
      price: formData.get("price") as string,
      brandId: formData.get("brandId") as string,
      badge: formData.get("badge") as string,
    };

    startTransition(async () => {
      await updateProduct(editingProduct.id, updateData);
      setEditingProduct(null); // 保存成功后关闭弹窗
    });
  };

  return (
    <div className="container mx-auto pt-32 pb-24 px-6 max-w-6xl">
      <h1 className="text-2xl font-serif tracking-widest uppercase mb-12 text-center text-zinc-900">
        Admin Dashboard
      </h1>

      {/* 🎛️ 隐奢选项卡切换 */}
      <div className="flex justify-center gap-12 border-b border-zinc-200 mb-12">
        <button 
          onClick={() => setActiveTab("products")}
          className={`pb-4 text-xs tracking-[0.2em] font-bold uppercase transition-colors ${
            activeTab === "products" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Publish
        </button>
        <button 
          onClick={() => setActiveTab("inventory")}
          className={`pb-4 text-xs tracking-[0.2em] font-bold uppercase transition-colors ${
            activeTab === "inventory" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Inventory
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`pb-4 text-xs tracking-[0.2em] font-bold uppercase transition-colors ${
            activeTab === "orders" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Orders
        </button>
      </div>

      {/* ==================== 视图 A：商品发布中心 ==================== */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 flex flex-col gap-8 p-10 border border-neutral-200 bg-white shadow-sm rounded-xl">
            <div className="border-b pb-4">
              <h2 className="text-sm font-semibold tracking-widest uppercase">发布新商品</h2>
            </div>
            <form action={createProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">商品照片 (必填)</label>
                  <ImageUpload onUploadSuccess={(urls) => setImageUrls(urls)} />
                  <input type="hidden" name="imageUrl" value={imageUrls.join(",")} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">商品影片 (选填)</label>
                  <VideoUpload onUploadSuccess={(url) => setVideoUrl(url)} />
                  <input type="hidden" name="videoUrl" value={videoUrl} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">商品名称</label>
                  <input name="name" placeholder="例如：Kira Satchel" className="w-full p-3 border border-neutral-200 text-sm focus:outline-none focus:border-brand-primary transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">自定义链接 (Slug)</label>
                  <input name="slug" placeholder="例如：kira-satchel" className="w-full p-3 border border-neutral-200 text-sm focus:outline-none focus:border-brand-primary transition-all" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">价格 (RM)</label>
                  <input name="price" type="number" step="0.01" placeholder="0.00" className="w-full p-3 border border-neutral-200 text-sm" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">商品标签 (Badge)</label>
                  <select name="badge" className="w-full p-3 border border-neutral-200 text-sm focus:outline-none focus:border-brand-primary transition-all text-neutral-600">
                    <option value="">-- 无标签 --</option>
                    <option value="NEW IN">NEW IN</option>
                    <option value="LIMITED">LIMITED EDITION</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">归属分类与品牌</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select name="categoryId" className="w-full p-3 border border-neutral-200 text-sm uppercase tracking-widest font-medium text-neutral-600" required>
                    <option value="">-- 选择分类 --</option>
                    {allCategories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select name="brandId" className="w-full p-3 border border-neutral-200 text-sm uppercase tracking-widest font-medium text-neutral-600" required>
                    <option value="">-- 选择品牌 --</option>
                    {allBrands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-brand-primary text-white py-5 text-xs tracking-[0.3em] uppercase font-bold hover:bg-neutral-800 transition-all rounded-lg shadow-lg">
                确认发布商品
              </button>
            </form>
          </div>

          <div className="space-y-10">
             <div className="p-8 border border-neutral-200 bg-white rounded-xl shadow-sm space-y-6">
                <h2 className="text-xs font-bold tracking-widest uppercase border-b pb-3">新建分类</h2>
                <form action={createCategory} className="space-y-4">
                   <input name="name" placeholder="分类名" className="w-full p-3 border border-neutral-100 text-sm bg-neutral-50 focus:outline-brand-primary" required />
                   <input name="slug" placeholder="链接" className="w-full p-3 border border-neutral-100 text-sm bg-neutral-50 focus:outline-brand-primary" required />
                   <button className="w-full border border-brand-primary py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-brand-primary hover:text-white transition-all">确认添加</button>
                </form>
             </div>
             <div className="p-8 border border-neutral-200 bg-white rounded-xl shadow-sm space-y-6">
                <h2 className="text-xs font-bold tracking-widest uppercase border-b pb-3">新建品牌</h2>
                <form action={createBrand} className="space-y-4">
                   <input name="name" placeholder="品牌名" className="w-full p-3 border border-neutral-100 text-sm bg-neutral-50 focus:outline-brand-primary" required />
                   <input name="slug" placeholder="链接" className="w-full p-3 border border-neutral-100 text-sm bg-neutral-50 focus:outline-brand-primary" required />
                   <button className="w-full border border-brand-primary py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-brand-primary hover:text-white transition-all">确认添加</button>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* ==================== 视图 B：商品库存管理台 ==================== */}
      {activeTab === "inventory" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Product</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Brand / Category</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Price (RM)</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Date Added</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {allProducts?.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-zinc-100 shrink-0">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl.split(',')[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-serif tracking-wide text-zinc-900 flex items-center gap-2">
                            {product.name} 
                            {/* 如果有 Badge，展示一个小小的提示 */}
                            {product.badge && <span className="bg-zinc-800 text-white text-[8px] px-1.5 py-0.5 tracking-wider">{product.badge}</span>}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1">/{product.slug}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-bold tracking-widest uppercase text-zinc-700">{product.brand?.name || '-'}</p>
                        <p className="text-[10px] text-zinc-500 uppercase mt-1">{product.category?.name || '-'}</p>
                      </td>
                      <td className="p-4 text-xs font-medium tracking-wider">{product.price}</td>
                      <td className="p-4 text-xs text-zinc-500 tracking-wider">
                        {new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      {/* ✅ 修改：增加一个铅笔图标用于唤醒编辑面板 */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="text-zinc-400 hover:text-black transition-colors p-2"
                            title="Edit Product"
                          >
                            <Pencil size={16} strokeWidth={1.5} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            disabled={isPending}
                            className="text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50 p-2"
                            title="Delete Product"
                          >
                            <Trash2 size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🎯 隐奢弹窗：商品快编面板 */}
          {editingProduct && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                onClick={() => setEditingProduct(null)} // 点击背景关闭
              />
              <div className="relative bg-white w-full max-w-md p-8 shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
                <h3 className="text-sm font-serif uppercase tracking-widest mb-6 border-b pb-4 text-brand-primary">
                  Quick Edit
                </h3>
                <form onSubmit={handleUpdateProduct} className="space-y-5">
                  <p className="text-xs text-zinc-500 tracking-wider">
                    Editing: <span className="font-bold text-zinc-900">{editingProduct.name}</span>
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Price (RM)</label>
                    <input 
                      name="price" type="number" step="0.01" 
                      defaultValue={editingProduct.price} 
                      className="w-full p-3 border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors" required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Brand</label>
                    <select 
                      name="brandId" 
                      defaultValue={editingProduct.brandId} 
                      className="w-full p-3 border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors" required
                    >
                      {allBrands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Badge</label>
                    <select 
                      name="badge" 
                      defaultValue={editingProduct.badge || ""} 
                      className="w-full p-3 border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors text-neutral-600"
                    >
                      <option value="">-- No Badge --</option>
                      <option value="NEW IN">NEW IN</option>
                      <option value="LIMITED">LIMITED EDITION</option>
                      <option value="BEST SELLER">BEST SELLER</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end gap-4 border-t mt-4">
                    <button type="button" onClick={() => setEditingProduct(null)} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-black transition-colors font-bold px-4">
                      Cancel
                    </button>
                    <button type="submit" disabled={isPending} className="bg-black text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50">
                      {isPending ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 视图 C：订单管理指挥中心 ==================== */}
      {activeTab === "orders" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {allOrders?.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 text-sm tracking-widest uppercase">
              暂无订单数据
            </div>
          ) : (
            allOrders?.map((order) => (
              <div key={order.id} className="bg-white border border-zinc-200 shadow-sm">
                <div className="bg-zinc-50 p-6 border-b border-zinc-200 flex flex-wrap justify-between items-center gap-6">
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 mb-1">Order No.</p>
                    <p className="text-xs font-bold tracking-wider">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 mb-1">Date</p>
                    <p className="text-xs font-medium tracking-wider">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 mb-1">Total (RM)</p>
                    <p className="text-xs font-bold tracking-wider">{order.totalAmount}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 mb-1">Action</p>
                    <select 
                      disabled={isPending}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-bold tracking-widest uppercase px-4 py-2 border outline-none cursor-pointer transition-colors ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                        order.status === 'shipped' ? 'bg-zinc-800 text-white border-zinc-900' :
                        'bg-green-100 text-green-900 border-green-200'
                      }`}
                    >
                      <option value="pending">待处理 (PENDING)</option>
                      <option value="processing">打包中 (PROCESSING)</option>
                      <option value="shipped">已发货 (SHIPPED)</option>
                      <option value="delivered">已送达 (DELIVERED)</option>
                      <option value="cancelled">已取消 (CANCELLED)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                  <div className="p-6 space-y-4">
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold mb-4">Purchased Items</h3>
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="font-serif tracking-wide">{item.productName}</span>
                        <span className="text-zinc-500 text-xs tracking-wider">x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold mb-4">Shipping Info</h3>
                    {order.address ? (
                      <div className="text-xs leading-relaxed tracking-wider text-zinc-700">
                        <p className="font-bold text-zinc-900 mb-1">{order.address.receiverName} ({order.address.phoneNumber})</p>
                        <p>{order.address.addressLine1}</p>
                        {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                        <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500">Error: Address data missing</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}