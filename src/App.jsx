import React, { useState } from 'react';
import { 
  Sparkles, Image as ImageIcon, BookOpen, Loader2, Zap, Target, 
  Box, RefreshCw, MapPin, Heart, Shield, MessageSquare, 
  Clock, Scissors, Eye, Waves, Layers, Anchor, AlertCircle
} from 'lucide-react';

const apiKey = "";
const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
const IMAGE_MODEL = "imagen-4.0-generate-001";

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

  const generateStory = async () => {
    setLoading(true);
    try {
      const systemPrompt = `Olet aistillisen kaunokirjallisuuden ammattilainen. Kirjoita upea, tyylikäs ja mukaansatempaava skenaario (200-300 sanaa). 
      Käytä tunnelmallista kieltä, keskity fyysisiin tuntemuksiin ja jännitykseen. 
      Tarinan tulee olla täysin linjassa annettujen parametrien kanssa. Kirjoita suomeksi.`;

      const userPrompt = `Kirjoita tarina treffeistä kumppanin ${vibeData.partnerName} kanssa.
      Tiedot:
      - Tunnelma: ${vibeData.mood}
      - Focus: ${vibeData.focus}
      - Intensiteetti: ${vibeData.intensity}
      - Puhetapa: ${vibeData.comm}
      - Asu: ${vibeData.outfit} ja sukat: ${vibeData.nylon}
      - Aistit & BDSM: ${vibeData.sensory}, ${vibeData.bdsm}
      - Lelut: ${vibeData.toy}
      - Erikoisfokus: ${vibeData.special}
      - Turvallisuus: ${vibeData.safety}
      - Sijainti: ${vibeData.location || 'Yksityinen tila'}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      setStory(data.candidates?.[0]?.content?.parts?.[0]?.text || "Tarinan luominen epäonnistui.");
      setStep('result');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const prompt = `A cinematic, aesthetic, high-end artistic scene: ${vibeData.location || 'luxurious bedroom'}, soft moody lighting, a couple in a ${vibeData.mood} and ${vibeData.intensity} moment, focus on ${vibeData.outfit}, hyper-realistic, 8k.`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:predict?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: { prompt: prompt },
          parameters: { sampleCount: 1 }
        })
      });
      const data = await response.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        setImage(`data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SelectBox = ({ label, icon: Icon, value, options, field }) => (
    <div className="space-y-1.5 group">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1 group-hover:text-pink-500/80 transition-colors">
        <Icon size={10} /> {label}
      </label>
      <select 
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-pink-500/50 transition-all cursor-pointer appearance-none hover:bg-white/10"
        value={value}
        onChange={(e) => setVibeData({...vibeData, [field]: e.target.value})}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.label} className="bg-slate-900 text-sm text-white">
            {opt.emoji} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 font-sans p-4 md:p-8 selection:bg-pink-500/40">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl mb-4 border border-white/5 shadow-2xl shadow-pink-500/5">
            <Sparkles className="text-pink-500" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-pink-100 to-purple-300 bg-clip-text text-transparent mb-2 tracking-tighter italic">VIBE STORY</h1>
          <p className="text-slate-500 uppercase text-[10px] tracking-[0.5em] font-bold opacity-60">The Narrative Extension</p>
        </header>

        {step === 'input' && (
          <div className="space-y-6">
            <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-3xl backdrop-blur-xl">
              <div className="mb-8">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kenen kanssa jaat tämän hetken?</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl font-bold mt-2 focus:ring-4 focus:ring-pink-500/10 border-pink-500/20 outline-none transition-all placeholder:text-slate-700 text-white"
                  placeholder="Kumppanin nimi..."
                  value={vibeData.partnerName}
                  onChange={(e) => setVibeData({...vibeData, partnerName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 text-white">
                <SelectBox label="Tunnelma" icon={Heart} value={vibeData.mood} options={categories.moods} field="mood" />
                <SelectBox label="Fokus" icon={Target} value={vibeData.focus} options={categories.focus} field="focus" />
                <SelectBox label="Intensiteetti" icon={Zap} value={vibeData.intensity} options={categories.intensity} field="intensity" />
                <SelectBox label="Asu" icon={Scissors} value={vibeData.outfit} options={categories.outfits} field="outfit" />
                <SelectBox label="Nylon" icon={Layers} value={vibeData.nylon} options={categories.nylon} field="nylon" />
                <SelectBox label="Aistit" icon={Eye} value={vibeData.sensory} options={categories.sensory} field="sensory" />
                <SelectBox label="BDSM" icon={Anchor} value={vibeData.bdsm} options={categories.bdsm} field="bdsm" />
                <SelectBox label="Lelut" icon={Box} value={vibeData.toy} options={categories.toys} field="toy" />
                <SelectBox label="Puhe" icon={MessageSquare} value={vibeData.comm} options={categories.communication} field="comm" />
                <SelectBox label="Erikois" icon={Sparkles} value={vibeData.special} options={categories.special} field="special" />
                <SelectBox label="Turva" icon={Shield} value={vibeData.safety} options={categories.safety} field="safety" />
                <div className="space-y-1.5 group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1 group-hover:text-green-500/80 transition-colors">
                    <MapPin size={10} /> Sijainti
                  </label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-green-500/50 transition-all hover:bg-white/10"
                    placeholder="Esim. makuuhuone..."
                    value={vibeData.location}
                    onChange={(e) => setVibeData({...vibeData, location: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={generateStory}
                disabled={!vibeData.partnerName || loading}
                className="w-full mt-10 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 py-6 rounded-3xl font-black text-xl tracking-widest shadow-2xl shadow-pink-500/20 transition-all flex items-center justify-center gap-4 text-white"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                KIRJOITA SKENAARIO
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-8">
            <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl shadow-3xl">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-600" />
              
              <div className="flex flex-wrap gap-2 mb-12 opacity-40 hover:opacity-100 transition-opacity">
                {Object.entries(vibeData).map(([key, val]) => (
                  val && key !== 'partnerName' && key !== 'location' && (
                    <span key={key} className="bg-white/5 px-3 py-1.5 rounded-full text-[9px] font-black border border-white/5 uppercase tracking-wider">
                      {val}
                    </span>
                  )
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                {story.split('\n').filter(p => p.trim()).map((para, i) => (
                  <p key={i} className="text-xl md:text-3xl leading-[1.7] text-slate-100 font-serif italic mb-10 first-letter:text-6xl first-letter:text-pink-500 first-letter:font-black first-letter:mr-3 first-letter:float-left">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {!image ? (
                <button 
                  onClick={generateImage}
                  disabled={loading}
                  className="bg-white/5 hover:bg-white/10 text-white p-8 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all border border-white/10 group shadow-xl"
                >
                  {loading ? <Loader2 className="animate-spin text-pink-500" /> : <ImageIcon size={32} className="text-pink-400 group-hover:rotate-6 transition-transform" />}
                  <span className="text-xl font-black tracking-widest uppercase text-white">Visualisoi Hetki</span>
                </button>
              ) : (
                <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group relative">
                  <img src={image} alt="Vibe Illustration" className="w-full h-auto transition-transform duration-[5s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
              )}
              
              <button 
                onClick={() => {setStep('input'); setImage(null);}}
                className="flex items-center justify-center gap-3 text-slate-600 hover:text-pink-400 transition-all py-6 group"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Aloita uusi sopimus</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;