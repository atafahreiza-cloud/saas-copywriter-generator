import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { MarketplaceTips } from './components/MarketplaceTips';
import { HistoryList } from './components/HistoryList';
import { TargetMarketplace, ToneOfVoice, GeneratedDescription } from './types';
import { Sparkles, CheckCircle2, User, LogOut, Lock, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// ⚙️ KONFIGURASI PROYEK
// ==========================================
const SUPABASE_URL = "https://rrwjmcmrkbplnwtgzyfv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2748X2cPhj_GjSmtrSzN0A_OBdj0dCv";
const GROQ_API_KEY = "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";
const MAYAR_PAYMENT_LINK = "https://copywriting-for-umkm.myr.id/pl/copywriting-generator-for-product-marketplace";
// ==========================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const STORAGE_KEY = 'penyusun_marketplace_history';

export default function App() {
  const [productName, setProductName] = useState<string>('');
  const [specifications, setSpecifications] = useState<string>('');
  const [marketplace, setMarketplace] = useState<TargetMarketplace>('Shopee');
  const [tone, setTone] = useState<ToneOfVoice>('Santai & Gaul');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedDescription | null>(null);
  const [history, setHistory] = useState<GeneratedDescription[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth & Subscription State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setGeneratedResult(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Gagal memuat histori', e);
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setUserProfile(data);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      showToast('Email dan Password wajib diisi.');
      return;
    }
    setAuthLoading(true);
    try {
      if (isRegisterMode) {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        showToast('Pendaftaran berhasil! Silakan masuk.');
        setIsRegisterMode(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        setCurrentUser(data.user);
        await fetchProfile(data.user.id);
        setShowAuthModal(false);
        showToast('Berhasil masuk!');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal autentikasi');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    showToast('Berhasil keluar.');
  };

  const saveToHistory = (newEntry: GeneratedDescription) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.productName !== newEntry.productName || item.marketplace !== newEntry.marketplace);
      const updated = [newEntry, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Gagal menyimpan histori', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleResetForm = () => {
    setProductName('');
    setSpecifications('');
    setError(null);
  };

  const handleGenerate = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      setError('Silakan Login atau Daftar akun gratis terlebih dahulu.');
      return;
    }

    const isPro = userProfile?.is_subscribed;
    const credits = userProfile?.free_credits ?? 0;

    if (!isPro && credits <= 0) {
      setError('Kuota coba gratis Anda telah habis. Silakan klik tombol Upgrade PRO di atas.');
      return;
    }

    if (!productName.trim()) {
      setError('Harap masukkan Nama Produk & Merek.');
      return;
    }
    if (!specifications.trim()) {
      setError('Harap masukkan Spesifikasi / Bahan / Fitur Produk.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const systemPrompt = `Anda adalah Copywriter E-commerce dan Pakar SEO Marketplace profesional (Shopee, Tokopedia, TikTok Shop, Lazada).
Tugas Anda adalah mengubah data spesifikasi produk menjadi konten copywriting persuasif siap pakai.

Format balasan WAJIB berupa JSON murni dengan struktur berikut:
{
  "titleOptions": ["Judul SEO Opsi 1", "Judul SEO Opsi 2"],
  "hook": "Kalimat pembuka/hook persuasif yang memikat pembeli dalam 2-3 kalimat",
  "keyBenefits": [
    {"feature": "Fitur/Bahan 1", "benefit": "Manfaat nyata bagi pembeli"},
    {"feature": "Fitur/Bahan 2", "benefit": "Manfaat nyata bagi pembeli"},
    {"feature": "Fitur/Bahan 3", "benefit": "Manfaat nyata bagi pembeli"}
  ],
  "packageContents": ["1x Unit Produk Utama", "1x Dus/Kemasan Eksklusif"],
  "shippingAndNotes": [
    "Pesanan sebelum pukul 15.00 WIB dikirim pada hari yang sama.",
    "Wajib menyertakan video unboxing utuh untuk klaim garansi retur."
  ],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}`;

    const userPrompt = `Nama Produk: ${productName.trim()}\nSpesifikasi/Bahan: ${specifications.trim()}\nMarketplace Tujuan: ${marketplace}\nGaya Bahasa: ${tone}`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.5,
          response_format: { type: "json_object" }
        })
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message || 'Gagal memproses ke AI.');
      }

      const contentString = result.choices?.[0]?.message?.content;
      if (!contentString) {
        throw new Error('Respon dari AI kosong.');
      }

      let parsedData: any;
      try {
        parsedData = JSON.parse(contentString);
      } catch {
        const cleaned = contentString.replaceAll('```json', '').replaceAll('```', '').trim();
        parsedData = JSON.parse(cleaned);
      }

      const titles: string[] = Array.isArray(parsedData.titleOptions) && parsedData.titleOptions.length > 0 
        ? parsedData.titleOptions 
        : [`${productName} Premium Original Quality`, `Promo ${productName} - Garansi & Fast Delivery`];

      const hookText: string = parsedData.hook || `Dapatkan ${productName} kualitas terbaik dengan performa maksimal untuk kebutuhan harian Anda!`;

      const benefits = Array.isArray(parsedData.keyBenefits) && parsedData.keyBenefits.length > 0
        ? parsedData.keyBenefits
        : [{ feature: "Kualitas Premium", benefit: "Awet, nyaman, dan tahan lama untuk penggunaan harian" }];

      const packages: string[] = Array.isArray(parsedData.packageContents) && parsedData.packageContents.length > 0
        ? parsedData.packageContents
        : ["1x Unit Produk", "1x Dus / Kemasan Pelindung"];

      const shipping: string[] = Array.isArray(parsedData.shippingAndNotes) && parsedData.shippingAndNotes.length > 0
        ? parsedData.shippingAndNotes
        : ["Pesanan sebelum pukul 15.00 WIB dikirim pada hari yang sama.", "Wajib menyertakan video unboxing utuh untuk klaim garansi."];

      const tags: string[] = Array.isArray(parsedData.hashtags) && parsedData.hashtags.length > 0
        ? parsedData.hashtags
        : [`#${productName.replace(/\s+/g, '')}`, `#${marketplace.replace(/\s+/g, '')}`, '#belanjaonline', '#racuntoko'];

      const rawFormattedText = `${titles[0]}

${hookText}

✨ KEUNGGULAN & SPESIFIKASI:
${benefits.map((b: any) => `• ${b.feature}: ${b.benefit}`).join('\n')}

📦 KELENGKAPAN PAKET:
${packages.map((p: string) => `• ${p}`).join('\n')}

🚚 KETENTUAN PENGIRIMAN & GARANSI:
${shipping.map((s: string) => `• ${s}`).join('\n')}

${tags.join(' ')}`;

      const generatedData: GeneratedDescription = {
        productName: productName.trim(),
        marketplace,
        tone,
        generatedAt: new Date().toISOString(),
        titleOptions: titles,
        hook: hookText,
        keyBenefits: benefits,
        packageContents: packages,
        shippingAndNotes: shipping,
        hashtags: tags,
        fullFormattedCopy: rawFormattedText
      };

      setGeneratedResult(generatedData);
      saveToHistory(generatedData);
      showToast('Deskripsi produk berhasil disusun!');

      if (!isPro && credits > 0) {
        const newCredits = credits - 1;
        await supabase.from('profiles').update({ free_credits: newCredits }).eq('id', currentUser.id);
        setUserProfile((prev: any) => ({ ...prev, free_credits: newCredits }));
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses deskripsi.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = userProfile?.is_subscribed;
  const credits = userProfile?.free_credits ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Header />
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-700">{currentUser.email}</div>
                  <div className={`text-[11px] font-bold ${isPro ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isPro ? '🌟 Member PRO (Unlimited)' : `Sisa Kuota: ${credits}x`}
                  </div>
                </div>
                <button onClick={handleLogout} title="Logout" className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer">
                <User className="w-3.5 h-3.5" />
                Login / Daftar Akun
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser && !isPro && credits <= 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Lock className="w-5 h-5" /> Kuota Gratis Anda Telah Habis!
              </h3>
              <p className="text-xs text-amber-100">Upgrade ke Paket PRO untuk membuat deskripsi e-commerce tanpa batas sepuasnya.</p>
            </div>
            <a href={MAYAR_PAYMENT_LINK} target="_blank" rel="noreferrer" className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs px-5 py-3 rounded-xl text-center transition shadow-xs">
              Upgrade PRO (Rp29.000/bln)
            </a>
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-2xl p-5 text-white shadow-xs">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Marketplace SEO & High-Converting Copy
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Penyusun Deskripsi Produk Otomatis
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-2xl">
              Ubah rincian spesifikasi teknis menjadi copywriting persuasif siap salin untuk Shopee, Tokopedia, TikTok Shop, dan Lazada dengan struktur SEO standar marketplace.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <a href={MAYAR_PAYMENT_LINK} target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs">
              🌟 Beli Paket PRO
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-6">
            <InputForm
              productName={productName}
              setProductName={setProductName}
              specifications={specifications}
              setSpecifications={setSpecifications}
              marketplace={marketplace}
              setMarketplace={setMarketplace}
              tone={tone}
              setTone={setTone}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              onReset={handleResetForm}
              error={error}
            />

            <HistoryList
              history={history}
              onSelect={(item) => {
                setGeneratedResult(item);
                setProductName(item.productName);
                setMarketplace(item.marketplace);
                setTone(item.tone);
              }}
              onClear={handleClearHistory}
              activeItem={generatedResult}
            />

            <MarketplaceTips currentMarketplace={marketplace} />
          </div>

          <div className="lg:col-span-7">
            <OutputDisplay
              data={generatedResult}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-slate-100 relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{isRegisterMode ? 'Daftar Akun Baru' : 'Login Akun'}</h3>
            <p className="text-xs text-slate-500 mb-4">{isRegisterMode ? 'Dapatkan 3x kuota gratis untuk mencoba fitur.' : 'Masuk untuk mengakses kuota dan status PRO Anda.'}</p>
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required placeholder="nama@email.com" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required placeholder="Minimal 6 karakter" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <button type="submit" disabled={authLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition text-sm cursor-pointer">
                {authLoading ? 'Memproses...' : isRegisterMode ? 'Daftar Sekarang' : 'Masuk'}
              </button>
            </form>
            <div className="text-center mt-3">
              <button type="button" onClick={() => setIsRegisterMode(!isRegisterMode)} className="text-xs text-indigo-600 hover:underline cursor-pointer">
                {isRegisterMode ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar gratis'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Penyusun Deskripsi Produk & Copywriting Marketplace</strong> — AI Powered
          </div>
          <div className="text-slate-400">
            Siap pakai untuk Shopee · Tokopedia · TikTok Shop · Lazada
          </div>
        </div>
      </footer>
    </div>
  );
}
