// lib/db/schema.ts

import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  decimal, 
  timestamp, 
  boolean, 
  primaryKey, 
  pgEnum,
  uniqueIndex,
  index,
  integer // ✅ 新增：引入 integer，用于购买数量
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- [核心配置] 全局时间戳，支持软删除 ---
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), 
};

// --- [枚举] 定义订单状态 ---
export const orderStatusEnum = pgEnum("order_status", [
  "pending", 
  "paid",
  "processing", 
  "shipped", 
  "delivered", 
  "cancelled"
]);

// --- [1. 业务基础表] ---

// 分类表 (Categories)
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  ...timestamps,
});

// 品牌表 (Brands)
export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  logoUrl: text("logo_url"), 
  ...timestamps,
});

// 核心商品表 (Products)
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), 
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  badge: varchar("badge", { length: 50 }), 
  isTrending: boolean("is_trending").default(false),
  
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  brandId: uuid("brand_id").references(() => brands.id, { onDelete: "set null" }),
  
  ...timestamps,
}, (table) => ({
  // 架构师注：显式创建索引以加速 slug 关联查询
  slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
  categoryIdx: index("products_category_idx").on(table.categoryId),
}));

// --- [2. 用户资产表] ---

// 收藏夹 (Wishlist)
export const wishlist = pgTable("wishlist", {
  userId: uuid("user_id").notNull(), // 对应 Auth ID
  productSlug: varchar("product_slug", { length: 255 })
    .notNull()
    .references(() => products.slug, { onDelete: "cascade", onUpdate: "cascade" }), 
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.productSlug] }),
  // 加速用户查询自己的收藏列表
  userWishlistIdx: index("wishlist_user_idx").on(t.userId),
}));

// 地址表 (Addresses)
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  receiverName: varchar("receiver_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  ...timestamps,
}, (table) => ({
  userAddressIdx: index("address_user_idx").on(table.userId),
  // 🚀 核心修复：必须添加此联合唯一约束，完美对齐 Action 中的 target 数组
  addressUniqueIdx: uniqueIndex("user_address_postal_unq").on(
    table.userId, 
    table.addressLine1, 
    table.postalCode
  ),
}));

// 订单表 (Orders)
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(), 
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  addressId: uuid("address_id").references(() => addresses.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => ({
  orderNumberIdx: uniqueIndex("order_number_idx").on(table.orderNumber),
  userOrderIdx: index("order_user_idx").on(table.userId),
}));

// ✅ 新增：订单详情表 (Order Items)
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }), // 级联删除：订单取消/删除，明细一并抹除
  productSlug: varchar("product_slug", { length: 255 }).notNull(), // 记录当时买的是哪个商品
  productName: varchar("product_name", { length: 255 }).notNull(), // 商品名称快照
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),  // 成交单价快照（防止未来商品涨价导致历史订单价格错乱）
  quantity: integer("quantity").notNull(),                         // 购买数量
  imageUrl: text("image_url"),                                     // 图片快照
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});


// --- [3. ORM 关联关系 (Relations)] ---

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  wishlistedBy: many(wishlist),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  product: one(products, {
    fields: [wishlist.productSlug],
    references: [products.slug],
  }),
}));

export const addressesRelations = relations(addresses, ({ many }) => ({
  orders: many(orders),
}));

// ✅ 修改：为 orders 表增加 items 关联，支持查询订单时直接带出其下的所有商品明细
export const ordersRelations = relations(orders, ({ one, many }) => ({
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  items: many(orderItems), 
}));

// ✅ 新增：定义 orderItems 属于哪个 order
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull(), // 必须关联你现有的 orders 表的 ID
  billplzBillId: varchar("billplz_bill_id", { length: 255 }).unique(), 
  amount: integer("amount").notNull(), 
  status: varchar("status", { length: 50 }).notNull().default("pending"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});