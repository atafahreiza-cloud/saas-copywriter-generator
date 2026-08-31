import React from 'react';
import { Sparkles, ShoppingBag, Store, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">
                Penyusun Deskripsi Produk & Copywriting Marketplace
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Optimasi SEO dan konversi penjualan untuk Shopee, Tokopedia, TikTok Shop & Lazada
            </p>
          </div>
        </div>

        {/* Marketplace Badges */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white font-medium text-amber-700 shadow-2xs border border-amber-200/60">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Shopee
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white font-medium text-emerald-700 shadow-2xs border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Tokopedia
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white font-medium text-slate-800 shadow-2xs border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            TikTok Shop
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white font-medium text-blue-700 shadow-2xs border border-blue-200/60">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Lazada
          </div>
        </div>
      </div>
    </header>
  );
};
