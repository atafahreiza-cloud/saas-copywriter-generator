import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Layers, 
  MessageSquareQuote, 
  Store, 
  Tag, 
  Lightbulb, 
  ChevronDown,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { TargetMarketplace, ToneOfVoice, PresetSample } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';

interface InputFormProps {
  productName: string;
  setProductName: (val: string) => void;
  specifications: string;
  setSpecifications: (val: string) => void;
  marketplace: TargetMarketplace;
  setMarketplace: (val: TargetMarketplace) => void;
  tone: ToneOfVoice;
  setTone: (val: ToneOfVoice) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset: () => void;
  error?: string | null;
}

const MARKETPLACES: { id: TargetMarketplace; label: string; desc: string; color: string; badgeBg: string }[] = [
  { 
    id: 'Shopee', 
    label: 'Shopee', 
    desc: 'Format ramah emoji, penekanan voucher & garansi toko',
    color: 'text-amber-700 border-amber-300 bg-amber-50/70',
    badgeBg: 'bg-amber-500'
  },
  { 
    id: 'Tokopedia', 
    label: 'Tokopedia', 
    desc: 'Spesifikasi detail, SEO judul ketat & garansi resmi',
    color: 'text-emerald-700 border-emerald-300 bg-emerald-50/70',
    badgeBg: 'bg-emerald-500'
  },
  { 
    id: 'TikTok Shop', 
    label: 'TikTok Shop', 
    desc: 'Hook instan memikat, gaya persuasif FOMO & hashtag viral',
    color: 'text-rose-700 border-rose-300 bg-rose-50/70',
    badgeBg: 'bg-rose-500'
  },
  { 
    id: 'Lazada', 
    label: 'Lazada', 
    desc: 'Deskripsi terstruktur, jaminan kepuasan & keaslian produk',
    color: 'text-blue-700 border-blue-300 bg-blue-50/70',
    badgeBg: 'bg-blue-500'
  },
];

const TONE_OPTIONS: { id: ToneOfVoice; label: string; desc: string; badge: string }[] = [
  { 
    id: 'Santai & Gaul', 
    label: 'Santai & Gaul', 
    desc: 'Akrab, bersahabat (Kak/Bro/Sis), mudah dipahami kalangan muda',
    badge: 'Generasi Z / Milenial'
  },
  { 
    id: 'Elegan & Premium', 
    label: 'Elegan & Premium', 
    desc: 'Bahasa berkelas, profesional, menonjolkan kualitas dan prestige',
    badge: 'High-End & Luxury'
  },
  { 
    id: 'Persuasif Promo', 
    label: 'Persuasif Promo', 
    desc: 'Fokus pada keuntungan pembeli, urgensi, penawaran terbaik & CTA kuat',
    badge: 'Tinggi Konversi'
  },
];

export const InputForm: React.FC<InputFormProps> = ({
  productName,
  setProductName,
  specifications,
  setSpecifications,
  marketplace,
  setMarketplace,
  tone,
  setTone,
  onSubmit,
  isLoading,
  onReset,
  error
}) => {
  const handleApplyPreset = (preset: PresetSample) => {
    setProductName(preset.productName);
    setSpecifications(preset.specifications);
    setMarketplace(preset.marketplace);
    setTone(preset.tone);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && productName.trim() && specifications.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 lg:p-7 flex flex-col gap-6">
      {/* Header & Quick Presets */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Formulir Data Produk
            </h2>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading || (!productName && !specifications)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Kosongkan form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Sample Templates Bar */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Coba Contoh Produk Cepat:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Form Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        onKeyDown={handleKeyDown}
        className="space-y-5"
      >
        {/* Field 1: Nama Produk & Merek */}
        <div>
          <label htmlFor="product-name" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Nama Produk & Merek <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="product-name"
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Aerostreet T-Shirt Oversize Cotton Combed 24s Vintage Edition"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
            <span>Sertakan merek dan nama varian utama agar judul lebih presisi.</span>
            <span>{productName.length} karakter</span>
          </div>
        </div>

        {/* Field 2: Spesifikasi / Bahan / Fitur Produk */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="product-specs" className="block text-sm font-semibold text-slate-900">
              Spesifikasi / Bahan / Fitur Produk <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-500">
              {specifications.length} karakter
            </span>
          </div>
          <textarea
            id="product-specs"
            required
            rows={5}
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            placeholder="Tuliskan spesifikasi detail atau poin-poin fitur, contoh:&#10;- Bahan 100% Katun Combed 24s gramasi 190 gsm&#10;- Sablon discharge tidak kaku & awet dicuci&#10;- Jahitan rantai standart distro kualitas ekspor&#10;- Pilihan ukuran S sampai XXL&#10;- Garansi tukar baru jika ada cacat produksi"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 leading-relaxed resize-y font-normal"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            💡 AI akan otomatis mengonversi poin spesifikasi teknis menjadi manfaat nyata bagi calon pembeli.
          </p>
        </div>

        {/* 2-Column Row for Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 3: Target Marketplace */}
          <div>
            <label htmlFor="target-marketplace" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-indigo-600" />
              <span>Target Marketplace</span>
            </label>
            <div className="relative">
              <select
                id="target-marketplace"
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value as TargetMarketplace)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 cursor-pointer"
              >
                {MARKETPLACES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {MARKETPLACES.find((m) => m.id === marketplace)?.desc}
            </p>
          </div>

          {/* Field 4: Gaya Bahasa */}
          <div>
            <label htmlFor="tone-voice" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
              <span>Gaya Bahasa (Tone)</span>
            </label>
            <div className="relative">
              <select
                id="tone-voice"
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneOfVoice)}
                className="w-full appearance-none px-3.5 py-2.5 pr-10 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 cursor-pointer"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {TONE_OPTIONS.find((t) => t.id === tone)?.desc}
            </p>
          </div>
        </div>

        {/* Prominent Action Button */}
        <div className="pt-2">
          <button
            id="btn-generate-description"
            type="submit"
            disabled={isLoading || !productName.trim() || !specifications.trim()}
            className="w-full group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:via-indigo-600 hover:to-violet-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all text-sm sm:text-base cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Menyusun Copywriting dengan AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                <span>Buat Deskripsi Produk</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white/20 rounded font-normal ml-1">
                  Ctrl + Enter
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
