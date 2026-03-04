// components/admin/video-upload.tsx
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Video, X, Loader2 } from "lucide-react"; // 👈 确认引入了 X 图标

export const VideoUpload = ({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 👈 [新增] 清除视频的处理函数
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止触发 label 的点击事件
    setPreview(null);
    onUploadSuccess(""); // 通知父组件清空 URL
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        alert("视频不能超过 50MB");
        return;
      }

      setUploading(true);
      const fileName = `${Math.random().toString(36).substring(2)}.mp4`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(`videos/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(`videos/${fileName}`);
      setPreview(data.publicUrl);
      onUploadSuccess(data.publicUrl);
    } catch (error) {
      alert("视频上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full relative group"> {/* 👈 加上 relative 和 group 方便定位按钮 */}
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-all overflow-hidden relative">
        {preview ? (
          <>
            <video src={preview} className="w-full h-full object-cover" />
            {/* 👈 [新增] 悬浮显示的取消按钮 */}
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
              title="删除视频"
            >
              <X size={16} />
            </button>
            {/* 播放小图标提示这是一个视频 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
               <Video className="text-white/50 w-8 h-8" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            {uploading ? <Loader2 className="w-8 h-8 animate-spin text-brand-primary" /> : <Video className="w-8 h-8 text-neutral-400" />}
            <p className="mt-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
              {uploading ? "正在上传影片..." : "上传商品影片"}
            </p>
          </div>
        )}
        <input type="file" className="hidden" accept="video/mp4,video/quicktime" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
};