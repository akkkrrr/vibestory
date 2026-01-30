import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Image as ImageIcon, BookOpen, Loader2, Zap, Target, 
  Box, RefreshCw, MapPin, Heart, Shield, MessageSquare, 
  Clock, Scissors, Eye, Waves, Layers, Anchor, AlertCircle
} from 'lucide-react';

// --- API-AVAIN ---
// Hae avain täältä: https://aistudio.google.com/app/apikey
// Liitä se lainausmerkkien sisään:
const apiKey = "AIzaSyC-rkWWFGl2LioSZ1YGoCtzpIHPO3AroUY"; 

const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
// Vaihdettu malli sellaiseksi, joka toimii ilmaisella API-avaimella
const IMAGE_MODEL = "gemini-2.5-flash-image-preview";

const categories = {
  moods: [
    { emoji: "🌹", label: "Sensuelli", value: "sensuelli" },
    { emoji: "🔥", label: "Villi", value: "villi" },
    { emoji: "😈", label: "Leikkisä", value: "leikkisa" },
    { emoji: "👑", label: "Dominoiva", value: "dominoiva" },
    { emoji: "💕", label: "Hellä", value: "hella" }
  ],
  focus: [
    { emoji: "✨", label: "Minun nautintoni", value: "minun-nautinto" },
    { emoji: "💝", label: "Kumppanin nautinto", value: "kumppanin-nautinto" },
    { emoji: "🎭", label: "Matka > Määränpää", value: "matka-tarkein" },
    { emoji: "🔥", label: "Molemmat yhtä aikaa", value: "molemmat" }
  ],
  intensity: [
    { emoji: "🕊️", label: "Lempeä", value: "lempea" },
    { emoji: "🌟", label: "Kohtalainen", value: "kohtalainen" },
    { emoji: "💥", label: "Intensiivinen", value: "intensiivinen" }
  ],
  communication: [
    { emoji: "💬", label: "Dirty talk", value: "dirty-talk" },
    { emoji: "🤫", label: "Kuiskailu", value: "kuiskailu" },
    { emoji: "🤐", label: "Hiljaisuus", value: "hiljaisuus" },
    { emoji: "📢", label: "Ohjeiden anto", value: "ohjeiden-anto" },
    { emoji: "🌟", label: "Kehut", value: "kehut" }
  ],
  outfits: [
    { emoji: "👙", label: "Pitsialusvaatteet", value: "pitsialusvaatteet" },
    { emoji: "👗", label: "Body/Korsetti", value: "body-korset" },
    { emoji: "🧥", label: "Aamutakki", value: "aamutakki" },
    { emoji: "✨", label: "Alaston", value: "alaston" }
  ],
  nylon: [
    { emoji: "🦵", label: "Ei sukkia", value: "none" },
    { emoji: "🦵", label: "Nude stay-ups", value: "nude-stay-ups" },
    { emoji: "🖤", label: "Black stay-ups", value: "black-stay-ups" },
    { emoji: "🤍", label: "White stay-ups", value: "white-stay-ups" },
    { emoji: "❤️", label: "Red stay-ups", value: "red-stay-ups" },
    { emoji: "🕳️", label: "Avoimet sukkahousut", value: "avoimet-sukkahousut" }
  ],
  sensory: [
    { emoji: "✨", label: "Ei aistielementtejä", value: "none" },
    { emoji: "😎", label: "Blindfold", value: "blindfold" },
    { emoji: "🎧", label: "Kuulokkeet", value: "kuulokkeet" },
    { emoji: "📸", label: "Valokuvaus", value: "valokuvaus" },
    { emoji: "🪢", label: "Bondage", value: "bondage" },
    { emoji: "⛓️", label: "Kahleet", value: "kahleet" },
    { emoji: "🧊", label: "Jää", value: "jaa" },
    { emoji: "🕯️", label: "Kuuma vaha", value: "kuuma-vaha" }
  ],
  bdsm: [
    { emoji: "✨", label: "Ei BDSM", value: "none" },
    { emoji: "🔱", label: "Piiskaus", value: "piiskaus" },
    { emoji: "🏓", label: "Paddle", value: "paddle" },
    { emoji: "🎯", label: "Raippa", value: "raippa" },
    { emoji: "👋", label: "Spanking", value: "spanking" },
    { emoji: "🫱", label: "Kuristaminen", value: "kuristaminen" },
    { emoji: "🦷", label: "Pureminen", value: "pureminen" },
    { emoji: "💅", label: "Kynnet", value: "kynnet" },
    { emoji: "🔘", label: "Nännipuristus", value: "nannipuristus" },
    { emoji: "💇", label: "Hiusten vetäminen", value: "hiusten-vetaminen" }
  ],
  toys: [
    { emoji: "✨", label: "Ei leluja", value: "none" },
    { emoji: "📳", label: "Vibraattori", value: "vibrator" },
    { emoji: "🍆", label: "Dildo", value: "dildo" },
    { emoji: "🦾", label: "Strap-on", value: "strap-on" },
    { emoji: "📎", label: "Nännipiistimet", value: "nannipiistimet" },
    { emoji: "🔌", label: "Anaalitappi", value: "anaalitappi" },
    { emoji: "💧", label: "Hierontaöljy", value: "hierontaoljy" },
    { emoji: "👆", label: "Sormipeli", value: "sormipeli" },
    { emoji: "🪶", label: "Feather tickler", value: "feather-tickler" }
  ],
  special: [
    { emoji: "✨", label: "Ei erityistä", value: "none" },
    { emoji: "🎁", label: "Toisen orgasmi edellä", value: "toisen-orgasmi-edella" },
    { emoji: "💝", label: "Vain nautintoa toiselle", value: "vain-nautintoa-toiselle" },
    { emoji: "♾️", label: "Useat orgasmit", value: "useat-orgasmit" },
    { emoji: "⏳", label: "Edging", value: "edging" },
    { emoji: "🚫", label: "Yhdyntä kielletty", value: "yhdynta-kielletty" },
    { emoji: "💫", label: "Foreplay-fokus", value: "foreplay-fokus" },
    { emoji: "⚡", label: "Quickie", value: "quickie" },
    { emoji: "🕉️", label: "Tantric", value: "tantric" }
  ],
  safety: [
    { emoji: "🫂", label: "Aftercare", value: "aftercare" },
    { emoji: "🛑", label: "Safe word", value: "safe-word" },
    { emoji: "✅", label: "Checkpoints", value: "checkpoints" }
  ]
};

const App = () => {
  const [step, setStep] = useState('input');
  const [vibeData, setVibeData] = useState({
    partnerName: '',
    mood: categories.moods[0].label,
    focus: categories.focus[0].label,
    intensity: categories.intensity[1].label,
    comm: categories.communication[0].label,
    outfit: categories.outfits[0].label,
    nylon: categories.nylon[0].label,
    sensory: categories.sensory[0].label,
    bdsm: categories.bdsm[0].label,
    toy: categories.toys[0].label,
    special: categories.special[0].label,
    safety: categories.safety[0].label,
    location: ''
  });
  const [story, setStory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const generateStory = async () => {
    if (!apiKey || apiKey === "") {
      setError("API-avain puuttuu koodista! Hae se AI Studiosta ja lisää muuttujaan 'apiKey'.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const systemPrompt = `Olet aistillisen kaunokirjallisuuden ammattilainen. Kirjoita upea, tyylikäs ja mukaansatempaava skenaario (200-300 sanaa). Käytä tunnelmallista kieltä, keskity fyysisiin tuntemuksiin ja jännitykseen. Tarinan tulee olla täysin linjassa annettujen parametrien kanssa. Kirjoita suomeksi.`;

      const userPrompt = `Kirjoita tarina treffeistä kumppanin ${vibeData.partnerName} kanssa.
      Parametrit: ${JSON.stringify(vibeData)}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      setStory(data.candidates?.[0]?.content?.parts?.[0]?.text || "Tarinan luominen epäonnistui.");
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("Virhe tarinan luonnissa: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!apiKey) return;
    setImageLoading(true);
    setError(null);
    try {
      // Käytetään gemini-2.5-flash-image-preview mallia joka tukee responseModalities: ['IMAGE']
      const promptText = `Generate an artistic, moody, high-end aesthetic visual: A luxurious room with atmospheric lighting, cinematic, ${vibeData.mood} mood, focusing on ${vibeData.outfit}, hyper-realistic photography style, 8k. Do not include text.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { 
            responseModalities: ["IMAGE"] 
          }
        })
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      // Etsitään kuva vastauksesta
      const imageData = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

      if (imageData) {
        setImage(`data:image/png;base64,${imageData}`);
      } else {
        throw new Error("Kuvaa ei voitu luoda. Tarkista mallin saatavuus.");
      }
    } catch (err) {
      console.error(err);
      setError("Kuvan luominen epäonnistui: " + err.message + ". Imagen 4 vaatii tällä hetkellä maksullisen tilauksen, käytettiin varamallia.");
    } finally {
      setImageLoading(false);
    }
  };

  const SelectBox = ({ label, icon: Icon, value, options, field }) => (
    <div className="flex flex-col space-y-2 group">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1 group-hover:text-pink-500 transition-colors">
        <Icon size={12} /> {label}
      </label>
      <select 
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500/50 hover:bg-white/5 transition-all cursor-pointer"
        value={value}
        onChange={(e) => setVibeData({...vibeData, [field]: e.target.value})}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.label} className="bg-slate-950 text-white">
            {opt.emoji} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl mb-6 border border-white/10 shadow-2xl">
            <Sparkles className="text-pink-500" size={32} />
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-white via-pink-200 to-purple-400 bg-clip-text text-transparent mb-3 tracking-tighter italic">VIBE STORY</h1>
          <p className="text-slate-500 uppercase text-[10px] tracking-[0.6em] font-bold opacity-70">The Narrative Extension</p>
        </header>

        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl text-red-400 text-sm flex flex-col gap-2 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
              <AlertCircle size={20} /> HUOMIO
            </div>
            <p>{error}</p>
          </div>
        )}

        {step === 'input' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl shadow-3xl">
              <div className="mb-12">
                <label className="text-[11px] font-black text-pink-500/80 uppercase tracking-[0.3em] mb-3 block">Kumppanin nimi</label>
                <input 
                  className="w-full bg-white/5 border-b-2 border-white/10 rounded-t-xl p-5 text-2xl font-bold focus:border-pink-500 outline-none transition-all placeholder:text-slate-800 text-white"
                  placeholder="Kenen kanssa jaat tämän?..."
                  value={vibeData.partnerName}
                  onChange={(e) => setVibeData({...vibeData, partnerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SelectBox label="Tunnelma" icon={Heart} value={vibeData.mood} options={categories.moods} field="mood" />
                <SelectBox label="Fokus" icon={Target} value={vibeData.focus} options={categories.focus} field="focus" />
                <SelectBox label="Intensiteetti" icon={Zap} value={vibeData.intensity} options={categories.intensity} field="intensity" />
                <SelectBox label="Asu" icon={Scissors} value={vibeData.outfit} options={categories.outfits} field="outfit" />
                <SelectBox label="Sukat" icon={Layers} value={vibeData.nylon} options={categories.nylon} field="nylon" />
                <SelectBox label="Aistit" icon={Eye} value={vibeData.sensory} options={categories.sensory} field="sensory" />
                <SelectBox label="BDSM" icon={Anchor} value={vibeData.bdsm} options={categories.bdsm} field="bdsm" />
                <SelectBox label="Lelut" icon={Box} value={vibeData.toy} options={categories.toys} field="toy" />
                <SelectBox label="Erikois" icon={Sparkles} value={vibeData.special} options={categories.special} field="special" />
              </div>

              <button 
                onClick={generateStory}
                disabled={!vibeData.partnerName || loading}
                className="w-full mt-12 bg-gradient-to-r from-pink-600 to-indigo-700 hover:opacity-90 disabled:opacity-20 py-6 rounded-2xl font-black text-xl tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 text-white"
              >
                {loading ? <Loader2 className="animate-spin" /> : <BookOpen size={24} />}
                LUO SKENAARIO
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-slate-900/30 border border-white/10 rounded-[3rem] p-10 md:p-16 relative overflow-hidden backdrop-blur-2xl">
              <div className="flex flex-wrap gap-3 mb-12">
                {Object.entries(vibeData).map(([key, val]) => (
                  val && val !== 'none' && key !== 'partnerName' && (
                    <span key={key} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-pink-300/80">
                      {val}
                    </span>
                  )
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                {story.split('\n').filter(p => p.trim()).map((para, i) => (
                  <p key={i} className="text-2xl md:text-3xl leading-[1.8] text-slate-200 font-serif italic mb-8 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 items-center">
              {!image ? (
                <button 
                  onClick={generateImage}
                  disabled={imageLoading}
                  className="w-full max-w-md bg-white/5 border border-white/10 hover:bg-white/10 p-8 rounded-3xl flex items-center justify-center gap-4 transition-all group"
                >
                  {imageLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin text-pink-500" />
                      <span className="font-black tracking-widest uppercase animate-pulse">Luodaan visuaalia...</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={28} className="text-pink-500 group-hover:scale-125 transition-transform" />
                      <span className="font-black tracking-widest uppercase">Visualisoi skenaario</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-slate-900 animate-in zoom-in duration-500">
                  <img src={image} alt="Vibe Visual" className="w-full h-auto" />
                </div>
              )}
              
              <button 
                onClick={() => {setStep('input'); setImage(null); setError(null);}}
                className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors py-4 uppercase text-[10px] font-black tracking-[0.4em]"
              >
                <RefreshCw size={14} /> Tee uusi valinta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;