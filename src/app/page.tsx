"use client";

import { useState } from "react";

const EMAIL_TYPES = ["Newsletter Header", "Promotional Email Header", "Transactional Email", "Event Invitation Header", "Product Launch Header", "Seasonal Campaign Header", "Welcome Series Header"];
const STYLES = ["Minimalist", "Bold & Colorful", "Corporate Professional", "Playful & Fun", "Luxury & Elegant", "Modern Tech", "Warm & Personal"];
const COLORS = ["Blue", "Red", "Green", "Purple", "Orange", "Teal", "Pink", "Black & White"];

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const t = line.trim();
    if (!t) return <div key={i} className="h-2" />;
    if (t.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3">{t.replace("## ","")}</h2>;
    if (t.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-blue-300 mt-4 mb-2">{t.replace("### ","")}</h3>;
    if (t.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{t.replace("- ","")}</li>;
    if (/^\d+\.\s/.test(t)) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-decimal">{t.replace(/^\d+\.\s/,"")}</li>;
    if (t.startsWith("**")) return <p key={i} className="text-blue-200 text-sm font-semibold mt-3 mb-1">{t.replace(/\*\*/g,"")}</p>;
    if (t.startsWith("`") && t.endsWith("`")) return <p key={i} className="bg-blue-900/30 text-blue-200 text-xs px-3 py-2 rounded-lg my-2 font-mono">{t.replace(/`/g,"")}</p>;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{t}</p>;
  });
}

export default function Home() {
  const [brand, setBrand] = useState("");
  const [emailType, setEmailType] = useState("Newsletter Header");
  const [style, setStyle] = useState("Minimalist");
  const [color, setColor] = useState("Blue");
  const [offer, setOffer] = useState("");
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!brand.trim()) { setError("Please enter your brand name."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are an expert email marketing copywriter and designer. Generate email newsletter header and banner copy for the following campaign.\n\nBrand: ${brand}\nEmail Type: ${emailType}\nVisual Style: ${style}\nColor Theme: ${color}\nOffer/Promotion (optional): ${offer}\nCall-to-Action (optional): ${cta}\n\nProvide:\n1. **Header Subject Line** (3 options, varying lengths)\n2. **Preview Text / Preheader** (2 options, under 100 chars each)\n3. **Hero Banner Headline** (punchy, designed for above-the-fold)\n4. **Sub-headline** (supporting copy, 1-2 sentences)\n5. **Primary CTA Button Text** (action-oriented, max 5 words)\n6. **Secondary CTA** (if applicable)\n7. **Design Notes** (layout suggestions, visual hierarchy tips, color pairings for ${color} theme with ${style} style)\n\nFormat in clean markdown. Be specific and actionable.`
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output || data.text || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">✉️</div>
            <h1 className="text-3xl font-bold">AI Email Header & Banner</h1>
          </div>
          <p className="text-slate-400 text-sm">Generate high-converting email newsletter headers, banners, and subject lines.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Brand / Company Name</label>
            <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Acme Corp" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Type</label>
              <select value={emailType} onChange={e => setEmailType(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {EMAIL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Visual Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color Theme</label>
              <select value={color} onChange={e => setColor(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {COLORS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Offer / Promotion (optional)</label>
              <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="50% off annual plans this week only" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Desired CTA (optional)</label>
              <input value={cta} onChange={e => setCta(e.target.value)} placeholder="Shop the Sale" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>}

          <button onClick={handleGenerate} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin">◌</span> Generating Header Copy...</> : "✉️ Generate Email Header & Banner"}
          </button>
        </div>

        {output && (
          <div className="mt-8 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-300">Your Email Header Copy</h2>
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-slate-400 hover:text-white bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">Copy</button>
            </div>
            <div className="space-y-1">{renderMarkdown(output)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
