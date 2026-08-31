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

  // Inisialisasi Auth Session & Local History
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
        const cleaned = contentString.replace(/```json/g, '').replace(/
