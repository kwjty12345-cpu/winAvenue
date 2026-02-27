import Link from 'next/link';
import { useCart } from "./CartContext"; // 1. 引入购物车 Hook

const products = [
  {
    id: 1,
    name: 'Kira Quilted Satchel',
    price: 'RM 1,250',
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop',
    tag: 'New In',
    colors: ['#4A3F35', '#F5F5DC', '#8B0000'],
  },
  {
    id: 2,
    name: 'Fleming Soft Tote',
    price: 'RM 1,580',
    imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
    colors: ['#4A3F35', '#D2B48C'],
  },
  {
    id: 3,
    name: 'Eleanor Crossbody',
    price: 'RM 1,100',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    tag: 'Best Seller',
    colors: ['#4A3F35'],
  },
  {
    id: 4,
    name: 'Robinson Chain Wallet',
    price: 'RM 850',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    colors: ['#FFC0CB', '#4A3F35', '#FCFAF8'],
  }
];

export default function FeaturedProducts() {
  const { addToCart } = useCart(); // 2. 获取加购函数

  return (
    // 1. 使用全新的暖调燕麦色背景 bg-brand-gray
    <section className="relative py-24 bg-brand-gray overflow-hidden">
      
      {/* 2. 背景水印文字改用 brand-black配合极低透明度，显得更柔和 */}
      <div className="absolute top-1/4 left-0 w-full flex justify-center pointer-events-none select-none z-0">
        <span className="text-[18vw] font-bold text-brand-black/[0.04] tracking-tighter uppercase whitespace-nowrap">
          LUXE PARADISE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-2xl font-light tracking-widest text-brand-black uppercase">
            Trending Now
          </h2>
          <div className="w-12 h-[1px] bg-brand-black mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              
              {product.tag && (
                <div className="absolute top-3 left-3 z-20 bg-brand-white/95 px-2 py-1 shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-brand-black font-medium">
                    {product.tag}
                  </span>
                </div>
              )}

              {/* 卡片背景使用温馨的珍珠白 bg-brand-white */}
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-white mb-5 cursor-pointer shadow-[0_4px_20px_rgba(74,63,53,0.05)] group-hover:shadow-[0_10px_40px_rgba(74,63,53,0.08)] transition-shadow duration-500">
                <Link href={`/product/${product.id}`}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                </Link>

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20">
                  {/* 3. 为按钮绑定加购事件 */}
                  <button 
                    onClick={() => addToCart({ ...product, img: product.imageUrl })}
                    className="w-full bg-brand-white/90 backdrop-blur-sm text-brand-black py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-black hover:text-brand-white transition-colors border border-brand-line"
                  >
                    Quick Shop
                  </button>
                </div>
              </div>

              <div className="text-center flex flex-col items-center space-y-2">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-sm tracking-widest text-brand-black uppercase font-medium hover:text-brand-black/70 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-brand-black/60 tracking-wider">
                  {product.price}
                </p>

                <div className="flex space-x-2 pt-2">
                  {product.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="w-3 h-3 rounded-full border border-brand-line cursor-pointer hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link 
            href="/shop"
            className="inline-block border-b border-brand-black pb-1 text-sm uppercase tracking-widest text-brand-black hover:text-brand-black/60 hover:border-brand-black/60 transition-all duration-300"
          >
            View All Bags
          </Link>
        </div>

      </div>
    </section>
  );
}