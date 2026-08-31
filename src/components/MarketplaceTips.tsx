import React from 'react';
import { TargetMarketplace } from '../types';
import { Lightbulb, CheckCircle, Info } from 'lucide-react';

interface MarketplaceTipsProps {
  currentMarketplace: TargetMarketplace;
}

export const MarketplaceTips: React.FC<MarketplaceTipsProps> = ({ currentMarketplace }) => {
  const tips: Record<TargetMarketplace, { title: string; points: string[]; note: string }> = {
    Shopee: {
      title: 'Tips Optimasi Algoritma Shopee',
      points: [
        'Gunakan format judul: [Merek] + [Tipe/Nama Produk] + [Fitur Utama/Varian]. Maksimal 120 karakter.',
        'Sertakan emoji di awal poin deskripsi untuk meningkatkan keterbacaan (skimmability).',
        'Sebutkan keuntungan voucher gratis ongkir dan promo toko pada paragraf pembuka.',
        'Gunakan 5-8 hashtag populer di bagian paling bawah deskripsi.'
      ],
      note: 'Shopee memprioritaskan kata kunci di 60 karakter pertama judul produk.'
    },
    Tokopedia: {
      title: 'Tips Optimasi SEO Tokopedia',
      points: [
        'Hindari penggunaan huruf kapital semua (ALL CAPS) atau simbol berlebihan pada judul produk.',
        'Fokuskan spesifikasi teknis dan dimensi akurat agar tidak menimbulkan komplain retur pembeli.',
        'Cantumkan status Garansi Resmi atau Garansi Toko secara eksplisit.',
        'Jelaskan batas waktu pemesanan (cut-off time) untuk pengiriman Instan / Sameday.'
      ],
      note: 'Tokopedia memiliki sistem pencarian semantik yang kuat pada spesifikasi teknis.'
    },
    'TikTok Shop': {
      title: 'Tips Copywriting TikTok Shop',
      points: [
        'Gunakan hook yang kuat dan langsung menyentuh emosi atau solusi masalah dalam 2 baris awal.',
        'Bahasa santai dan persuasif mendorong aksi beli instan (check out sekarang di keranjang kuning).',
        'Tegaskan keaslian 100% original dan jaminan uang kembali.',
        'Gunakan hashtag tren kategori produk untuk visibilitas FYP.'
      ],
      note: 'Pembeli TikTok Shop cenderung menyukai deskripsi ringkas, to-the-point, dan berorientasi visual.'
    },
    Lazada: {
      title: 'Tips Listing Lazada',
      points: [
        'Poin keunggulan (bullet points) di bagian atas sangat mempengaruhi tingkat konversi.',
        'Sertakan detail kelengkapan isi box/paket secara transparan.',
        'Tekankan jaminan kepuasan pelanggan dan kemudahan klaim garansi.',
        'Gunakan kata kunci bahasa Indonesia baku dan istilah industri yang umum dicari.'
      ],
      note: 'Format deskripsi terstruktur di Lazada membantu produk muncul di rekomendasi feeds.'
    }
  };

  const current = tips[currentMarketplace];

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2.5">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
          {current.title}
        </h4>
      </div>
      <ul className="space-y-1.5 text-xs text-slate-600 mb-3">
        {current.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
      <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
        <span>{current.note}</span>
      </div>
    </div>
  );
};
