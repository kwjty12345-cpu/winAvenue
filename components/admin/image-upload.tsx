// components/admin/image-upload.tsx
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

export const ImageUpload = ({ onUploadSuccess }: { onUploadSuccess: (urls: string[]) => void }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 删除某一张图片
  const handleRemove = (indexToRemove: number, e: React.MouseEvent) => {
    e.preventDefault();
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(newPreviews);
    onUploadSuccess(newPreviews); // 将更新后的数组传给父组件
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // 关键：获取所有被选中的文件
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setUploading(true);
      const newUrls: string[] = [];

      // 循环上传每一张图片
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(`images/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(`images/${fileName}`);
        newUrls.push(data.publicUrl);
      }

      // 把新传的图追加到现有的预览列表里
      const updatedPreviews = [...previews, ...newUrls];
      setPreviews(updatedPreviews);
      onUploadSuccess(updatedPreviews);

    } catch (error) {
      alert("部分图片上传失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. 多图预览网格 */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group">
              <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
              <button 
                onClick={(e) => handleRemove(index, e)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {/* 标记第一张为封面图 */}
              {index === 0 && (
                <div className="absolute bottom-0 left-0 w-full bg-brand-primary text-white text-[10px] font-bold text-center py-1">
                  封面图
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. 上传按钮区 */}
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-all">
        <div className="flex flex-col items-center justify-center py-4">
          {uploading ? <Loader2 className="w-6 h-6 animate-spin text-brand-primary" /> : <Upload className="w-6 h-6 text-neutral-400" />}
          <p className="mt-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
            {uploading ? "正在上传..." : "点击或拖拽上传多张照片"}
          </p>
        </div>
        {/* 关键：加上 multiple 属性允许一次选多张 */}
        <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
};