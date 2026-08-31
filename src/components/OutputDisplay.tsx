import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Tag, 
  Package, 
  Truck, 
  Hash, 
  Flame, 
  ShieldCheck, 
  Layers,
  FileText,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { GeneratedDescription, TargetMarketplace } from '../types';

interface OutputDisplayProps {
  data: GeneratedDescription | null;
  isLoading: boolean;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, isLoading }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'structured' | 'raw'>('structured');
  const [customText, setCustomText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Synchronize customText when new data arrives
  React.useEffect(() => {
    if (data?.fullFormattedCopy) {
      setCustomText(data.fullFormattedCopy);
      setIsEditing(false);
    }
  }, [data]);

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => {
        setCopiedSection(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsTxt = () => {
    if (!data) return;
    const content = customText || data.fullFormattedCopy;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Deskripsi-${data.productName.replace(/[^a-zA-Z0-9]/g, '_')}-${data.marketplace}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getMarketplaceBadgeColor = (marketplace: TargetMarketplace) => {
    switch (marketplace) {
      case 'Shopee':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Tokopedia':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TikTok Shop':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Lazada':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 flex flex-col items-center justify-center min-h-[480px] text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md -z-10 animate-pulse"></div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Sedang Menyusun Copywriting Marketplace...
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          AI sedang menganalisis spesifikasi, merumuskan judul SEO, mengubah fitur menjadi manfaat penjualan, dan merapikan format untuk marketplace target.
        </p>

        {/* Skeleton lines */}
        <div className="w-full max-w-lg space-y-3">
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-5/6 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[480px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">
          Belum Ada Deskripsi yang Dihasilkan
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          Isi nama produk dan spesifikasi pada formulir di sebelah kiri, pilih target marketplace, lalu klik tombol <strong className="text-indigo-600">"Buat Deskripsi Produk"</strong> untuk menghasilkan copywriting terstruktur berkonversi tinggi.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md text-left text-xs text-slate-600">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">1. Judul SEO</span>
            2 opsi nama produk kata kunci padat
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">2. Hook Memikat</span>
            Pembuka yang menarik minat beli
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">3. Manfaat Nyata</span>
            Spesifikasi diubah jadi solusi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">4. Isi Paket</span>
            Daftar kelengkapan produk
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">5. Ketentuan Toko</span>
            Jadwal kirim & garansi unboxing
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">6. Hashtag Viral</span>
            5-8 rekomendasi tag relevan
          </div>
        </div>
      </div>
    );
  }

  const activeCopyText = customText || data.fullFormattedCopy;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Top Banner & Main Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getMarketplaceBadgeColor(data.marketplace)}`}>
              {data.marketplace}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-700">
              Gaya: {data.tone}
            </span>
            <span className="text-xs text-slate-400">
              {data.generatedAt ? new Date(data.generatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
            Hasil Copywriting: {data.productName}
          </h2>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Switcher */}
          <div className="bg-white border border-slate-200 rounded-xl p-0.5 flex text-xs font-semibold text-slate-600 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('structured')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'structured' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Terstruktur
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'raw' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Teks Mentah
            </button>
          </div>

          <button
            type="button"
            onClick={downloadAsTxt}
            className="p-2 rounded-xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Unduh format .txt"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Unduh .txt</span>
          </button>

          {/* Primary "Salin Teks" Button */}
          <button
            id="btn-copy-full-text"
            type="button"
            onClick={() => copyToClipboard(activeCopyText, 'full')}
            className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedSection === 'full' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks Lengkap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 lg:p-7 flex-1 space-y-6">
        {viewMode === 'raw' ? (
          /* Raw / Seller Center Ready Textarea View */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  Teks Siap Salin ke Seller Center ({data.marketplace})
                </span>
                {isEditing && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">
                    Mode Edit Aktif
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {activeCopyText.length} Karakter · {activeCopyText.split(/\s+/).filter(Boolean).length} Kata
                </span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setIsEditing(true);
                }}
                rows={18}
                className="w-full font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed resize-y select-all"
                placeholder="Teks deskripsi..."
              />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-500">
                💡 Anda dapat mengedit teks di atas secara langsung sebelum menyalin.
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(activeCopyText, 'raw-full')}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {copiedSection === 'raw-full' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks Ini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Structured Visual Breakdown of the 6 Required Elements */
          <div className="space-y-6">
            {/* Section 1: Rekomendasi Judul Produk SEO-friendly (2 Opsi) */}
            <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Rekomendasi Judul Produk SEO-friendly (2 Opsi)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Target: {data.marketplace} SEO
                </span>
              </div>

              <div className="space-y-2.5">
                {data.titleOptions?.map((title, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded mt-0.5">
                        Opsi {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 select-all">
                          {title}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {title.length} karakter · Optimasi kata kunci pencarian
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(title, `title-${idx}`)}
                      className="shrink-0 self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 inline-flex items-center gap-1.5 transition-all"
                    >
                      {copiedSection === `title-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Judul</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Hook / Pembuka Menarik */}
            <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    Hook / Pembuka Menarik
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(data.hook, 'hook')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 inline-flex items-center gap-1 transition-all"
                >
                  {copiedSection === 'hook' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Hook</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed italic select-all">
                "{data.hook}"
              </div>
            </div>

            {/* Section 3: Poin Keunggulan Utama (Spesifikasi diubah jadi Manfaat) */}
            <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Poin Keunggulan Utama (Spesifikasi Jadi Manfaat)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const text = data.keyBenefits
                      .map((b) => `• ${b.feature}: ${b.benefit}`)
                      .join('\n');
                    copyToClipboard(text, 'benefits');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 inline-flex items-center gap-1 transition-all"
                >
                  {copiedSection === 'benefits' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Poin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {data.keyBenefits?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-baseline gap-2"
                  >
                    <div className="font-semibold text-xs text-slate-900 sm:w-1/3 shrink-0 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>{item.feature}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 sm:w-2/3 flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold hidden sm:inline">➜</span>
                      <span>{item.benefit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Column Row for Packaging & Shipping/Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 4: Kelengkapan Paket */}
              <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-indigo-600" />
                      Kelengkapan Paket
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = data.packageContents.map((p) => `• ${p}`).join('\n');
                      copyToClipboard(text, 'package');
                    }}
                    className="px-2 py-1 rounded text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 inline-flex items-center gap-1"
                  >
                    {copiedSection === 'package' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Salin</span>
                  </button>
                </div>
                <ul className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                  {data.packageContents?.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 5: Ketentuan Pengiriman & Catatan */}
              <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      5
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Ketentuan & Catatan
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = data.shippingAndNotes.map((s) => `• ${s}`).join('\n');
                      copyToClipboard(text, 'shipping');
                    }}
                    className="px-2 py-1 rounded text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 inline-flex items-center gap-1"
                  >
                    {copiedSection === 'shipping' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Salin</span>
                  </button>
                </div>
                <ul className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                  {data.shippingAndNotes?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 6: Rekomendasi 5-8 Hashtag Relevan */}
            <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                    6
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-violet-600" />
                    Rekomendasi Hashtag Relevan ({data.hashtags?.length || 0})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const text = data.hashtags.join(' ');
                    copyToClipboard(text, 'hashtags');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 inline-flex items-center gap-1 transition-all"
                >
                  {copiedSection === 'hashtags' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua Hashtag</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.hashtags?.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => copyToClipboard(tag, `tag-${idx}`)}
                    className="px-3 py-1 bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1 shadow-2xs hover:scale-105"
                    title="Klik untuk menyalin hashtag ini"
                  >
                    <span>{tag}</span>
                    {copiedSection === `tag-${idx}` && (
                      <Check className="w-3 h-3 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="p-4 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hasil teroptimasi algoritma pencarian <strong>{data.marketplace}</strong>.</span>
        </div>

        <button
          type="button"
          onClick={() => copyToClipboard(activeCopyText, 'full-bottom')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          {copiedSection === 'full-bottom' ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Deskripsi Lengkap Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Teks Lengkap</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
