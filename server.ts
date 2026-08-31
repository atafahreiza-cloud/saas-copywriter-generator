import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Google GenAI client
let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Marketplace copywriting generation API
app.post("/api/generate-description", async (req, res) => {
  try {
    const { productName, specifications, marketplace, tone } = req.body;

    if (!productName || !specifications) {
      return res.status(400).json({
        error: "Nama produk dan spesifikasi produk wajib diisi.",
      });
    }

    const ai = getGenAI();

    const systemInstruction = `Anda adalah Copywriter & Marketplace Specialist E-Commerce Indonesia profesional yang ahli dalam optimasi algoritma SEO dan konversi penjualan tinggi (high-converting copy) untuk marketplace seperti Shopee, Tokopedia, TikTok Shop, dan Lazada.

Tugas Anda adalah mengubah informasi produk dari pengguna menjadi deskripsi produk marketplace terstruktur, menarik, persuasif, dan siap pakai sesuai target marketplace dan gaya bahasa yang dipilih.

Karakteristik Marketplace:
- Shopee: Suka visual rapi dengan emoji, promo tersirat, garansi & voucher, keyword padat.
- Tokopedia: Struktur rapi, profesional, transparan, spesifikasi detail, fokus pada kualitas & garansi resmi.
- TikTok Shop: Hook sangat kuat di kalimat awal, bahasa engaging, dorongan beli sekarang (FOMO/urgensi halus), viral hashtag.
- Lazada: Informatif, poin-poin jelas, jaminan keaslian produk, kepuasan pelanggan.

Gaya Bahasa:
- 'Santai & Gaul': Menggunakan kata sapaan akrab (Bro/Sis/Kak/Teman), bahasa kekinian yang natural, akrab namun tetap terpercaya.
- 'Elegan & Premium': Menggunakan diksi berkelas, anggun, menonjolkan prestige, kualitas bahan prima, dan nilai eksklusif.
- 'Persuasif Promo': Menggunakan penekanan keuntungan maksimal, ajakan tindakan (CTA) kuat, penawaran terbaik, dan nilai ekonomis tinggi.

Format Output Wajib Mengikuti JSON Schema:
1. titleOptions: 2 opsi judul produk SEO-friendly yang memaksimalkan kata kunci pencarian marketplace (Format: [Merek] + [Kategori/Nama Produk] + [Spesifikasi Unggulan/Varian/Bahan]).
2. hook: Kalimat pembuka / hook 1-2 paragraf pendek yang memikat perhatian calon pembeli dan menjawab permasalahan/kebutuhan mereka.
3. keyBenefits: Daftar fitur spesifikasi yang diubah menjadi MANFAAT nyata bagi pembeli (contoh: "Bahan Cotton 24s -> Adem seharian, menyerap keringat maksimal tanpa bikin gerah").
4. packageContents: Daftar kelengkapan isi paket yang diterima pembeli (cth: 1x Unit Produk, 1x Box Eksklusif, Kartu Garansi/Petunjuk, Bonus/Sticker).
5. shippingAndNotes: Ketentuan jadwal pengiriman (cut-off order, pengiriman Instant/Sameday/Reguler), kebijakan garansi, dan syarat komplain video unboxing.
6. hashtags: 5 sampai 8 rekomendasi hashtag relevan dan viral (diawali tanda #).
7. fullFormattedCopy: Teks deskripsi lengkap terstruktur yang sudah dirapikan dengan pembatas visual yang elegan, emoji pendukung, dan siap langsung disalin-tempel ke halaman seller center marketplace.`;

    const prompt = `Nama Produk & Merek: ${productName}
Spesifikasi / Bahan / Fitur:
${specifications}

Target Marketplace: ${marketplace || "Shopee"}
Gaya Bahasa: ${tone || "Santai & Gaul"}

Hasilkan salinan copywriting marketplace lengkap dalam bahasa Indonesia sesuai instruksi dan schema JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 opsi judul produk SEO-friendly untuk marketplace",
            },
            hook: {
              type: Type.STRING,
              description: "Kalimat pembuka / hook menarik sesuai gaya bahasa",
            },
            keyBenefits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: {
                    type: Type.STRING,
                    description: "Fitur / Spesifikasi teknis",
                  },
                  benefit: {
                    type: Type.STRING,
                    description: "Manfaat nyata bagi pembeli",
                  },
                },
                required: ["feature", "benefit"],
              },
              description: "Daftar poin keunggulan (spesifikasi jadi manfaat)",
            },
            packageContents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Kelengkapan paket yang didapatkan pembeli",
            },
            shippingAndNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Ketentuan pengiriman, garansi, dan catatan toko",
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5-8 rekomendasi hashtag relevan",
            },
            fullFormattedCopy: {
              type: Type.STRING,
              description: "Teks deskripsi lengkap siap salin untuk seller center",
            },
          },
          required: [
            "titleOptions",
            "hook",
            "keyBenefits",
            "packageContents",
            "shippingAndNotes",
            "hashtags",
            "fullFormattedCopy",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Tidak ada respon yang dihasilkan dari Gemini AI.");
    }

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: {
        ...parsedData,
        productName,
        marketplace,
        tone,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error generating marketplace copy:", error);
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan saat membuat deskripsi produk.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Penyusun Deskripsi Produk & Copywriting Marketplace",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

startServer();
