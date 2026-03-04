// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 工业级 UI 工具函数：
 * 接收任意数量的 Tailwind 类名、条件判断或对象，
 * 安全地合并它们并解决特定的 CSS 冲突。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}