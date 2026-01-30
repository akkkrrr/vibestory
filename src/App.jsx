import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Image as ImageIcon, BookOpen, Loader2, Zap, Target, 
  Box, RefreshCw, MapPin, Heart, Shield, MessageSquare, 
  Clock, Scissors, Eye, Waves, Layers, Anchor, AlertCircle
} from 'lucide-react';

// --- API-AVAIN ---
const apiKey = "AIzaSyC-rkWWFGl2LioSZ1YGoCtzpIHPO3AroUY"; 

const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
// Käytetään Gemini 2.5 Flashia, joka on monipuolisempi ja usein ilmainen kokeilukäyttöön
const IMAGE_MODEL = "gemini-2.5-flash-preview-09-2025";

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
    if (!apiKey) {
      setError("API-avain puuttuu koodista!");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Kirjoita lyhyt, aistillinen ja tyylikäs tarina (suomeksi) treffeistä henkilön ${vibeData.partnerName} kanssa. Käytä parametreja: ${JSON.stringify(vibeData)}.` }] }],
          systemInstruction: { parts: [{ text: "Olet aistillisen fiktion kirjoittaja. Tyylisi on hienostunut ja tunnelmallinen." }] }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      setStory(data.candidates?.[0]?.content?.parts?.[0]?.text || "Tarinan luominen epäonnistui.");
      setStep('result');
    } catch (err) {
      setError("Tarinavirhe: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setImageLoading(true);
    setError(null);
    try {
      const promptText = `Generate a high-end, aesthetic, artistic image representing: ${vibeData.mood} mood, ${vibeData.outfit}, luxury lighting, cinematic background. NO TEXT. HIGH RESOLUTION.`;
      
      // Kokeillaan Gemini 2.5 Flashia kuvamodulla
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
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

      const imageData = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

      if (imageData) {
        setImage(`data:image/png;base64,${imageData}`);
      } else {
        // Jos API-avain ei salli kuvia, näytetään tyylikäs placeholder
        setImage(`https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000`);
        setError("Kuvagenerointi ei ole tuettu tällä API-avaimella (vaatii maksullisen tilan). Näytetään tunnelmakuva.");
      }
    } catch (err) {
      console.error(err);
      // Fallback kuvaan jos API epäonnistuu
      setImage(`https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000`);
      setError("Kuvapalvelu on rajoitettu laskutetuille tileille. Käytetään valmista tunnelmakuvaa.");
    } finally {
      setImageLoading(false);
    }
  };

  const SelectBox = ({ label, icon: Icon, value, options, field }) => (
    <div className="flex flex-col space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
        <Icon size={12} /> {label}
      </label>
      <select 
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500 transition-all cursor-pointer"
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
    <div className="min-h-screen bg-[#020205] text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10">
            <Sparkles className="text-pink-500" size={24} />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent italic tracking-tighter">VIBE STORY</h1>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {step === 'input' ? (
          <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl">
            <div className="mb-8">
              <label className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-2 block">Kumppanin nimi</label>
              <input 
                className="w-full bg-white/5 border-b border-white/10 p-4 text-xl font-bold focus:border-pink-500 outline-none text-white transition-all"
                placeholder="Nimi..."
                value={vibeData.partnerName}
                onChange={(e) => setVibeData({...vibeData, partnerName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectBox label="Tunnelma" icon={Heart} value={vibeData.mood} options={categories.moods} field="mood" />
              <SelectBox label="Fokus" icon={Target} value={vibeData.focus} options={categories.focus} field="focus" />
              <SelectBox label="Intensiteetti" icon={Zap} value={vibeData.intensity} options={categories.intensity} field="intensity" />
              <SelectBox label="Asu" icon={Scissors} value={vibeData.outfit} options={categories.outfits} field="outfit" />
              <SelectBox label="Sukat" icon={Layers} value={vibeData.nylon} options={categories.nylon} field="nylon" />
              <SelectBox label="Aistit" icon={Eye} value={vibeData.sensory} options={categories.sensory} field="sensory" />
            </div>

            <button 
              onClick={generateStory}
              disabled={!vibeData.partnerName || loading}
              className="w-full mt-10 bg-gradient-to-r from-pink-600 to-purple-700 py-5 rounded-xl font-bold tracking-widest hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "LUO TARINA"}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900/30 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl">
              <div className="prose prose-invert max-w-none">
                {story.split('\n').filter(p => p.trim()).map((para, i) => (
                  <p key={i} className="text-xl md:text-2xl leading-relaxed text-slate-200 font-serif italic mb-6">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {!image ? (
                <button 
                  onClick={generateImage}
                  disabled={imageLoading}
                  className="w-full max-w-sm bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                >
                  {imageLoading ? <Loader2 className="animate-spin text-pink-500" /> : <ImageIcon className="text-pink-500" />}
                  <span className="font-bold uppercase tracking-widest text-sm">Visualisoi</span>
                </button>
              ) : (
                <div className="w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src={image} alt="Vibe Visual" className="w-full h-auto" />
                </div>
              )}
              
              <button 
                onClick={() => {setStep('input'); setImage(null); setError(null);}}
                className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
              >
                <RefreshCw size={12} className="inline mr-2" /> Aloita alusta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;