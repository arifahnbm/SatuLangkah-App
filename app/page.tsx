'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  Loader2, 
  RefreshCcw, 
  Smile, 
  Zap, 
  Coffee,
  ChevronRight,
  Heart,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// --- Types ---
type AppState = 'LANDING' | 'UPLOAD' | 'PROCESSING' | 'STEPS' | 'FINISHED';
type EnergyLevel = 'Low' | 'Normal' | 'High';

interface Task {
  id: string;
  instruction: string;
}

// --- Constants & Mock Data ---
const MOCK_TASKS: Record<EnergyLevel, string[]> = {
  Low: [
    "Ambil satu helai pakaian dari lantai",
    "Letakkan pakaian itu di keranjang",
    "Ambil satu botol kosong",
    "Buang botol itu ke tempat sampah",
    "Tarik napas dalam, kamu hebat!",
    "Luruskan satu bantal di kasur"
  ],
  Normal: [
    "Kumpulkan semua pakaian di lantai ke keranjang",
    "Bawa piring-piring kotor ke dapur",
    "Bersihkan permukaan meja dari sisa kertas",
    "Rapikan tumpukan buku di rak",
    "Buang semua sampah di area ini"
  ],
  High: [
    "Bereskan semua pakaian dan masukkan ke lemari",
    "Cuci semua piring yang ada di dapur",
    "Sapu dan pel area ini sampai bersih",
    "Tata ulang meja kerja agar lebih rapi",
    "Ganti sprei kasur dengan yang bersih"
  ]
};

// --- Components ---

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  
  useEffect(() => {
    const sections = ["home", "tips", "cara-kerja"];

    const handleScroll = () => {
      const sections = ["home", "tips", "cara-kerja"];

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);

        if (!element) continue;

        const { offsetTop, offsetHeight } = element;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActive(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = (section: string) =>
    cn(
      "relative pb-1 transition-all duration-300 hover:text-sky-600",
      active === section
        ? "text-sky-600 font-bold"
        : "text-slate-500 font-medium"
    );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/50">
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <img className="w-12" src="/logo_foot.png" alt="Logo" />

          <span className="text-2xl font-bold tracking-tight text-sky-600">
            Satu<span className="text-pink-500">Langkah</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          
          <a href="#home" className={navLinkClass("home")}>
            Mulai

            {active === "home" && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute left-0 right-0 -bottom-1 h-[2px] bg-sky-400 rounded-full"
              />
            )}
          </a>

          <a href="#tips" className={navLinkClass("tips")}>
            Tips Fokus

            {active === "tips" && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute left-0 right-0 -bottom-1 h-[2px] bg-sky-400 rounded-full"
              />
            )}
          </a>

          <a href="#cara-kerja" className={navLinkClass("cara-kerja")}>
            Cara Kerja

            {active === "cara-kerja" && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute left-0 right-0 -bottom-1 h-[2px] bg-sky-400 rounded-full"
              />
            )}
          </a>

        </div>
             {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-white/50 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-b border-white overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <a 
                href="#home" 
                onClick={() => {
                  setTimeout(() => {
                    setIsMobileMenuOpen(false);
                  }, 150);
                }}
                className="text-lg font-bold text-sky-600"
              >
                Mulai
              </a>
              <a 
                href="#tips" 
                onClick={() => {
                  setTimeout(() => {
                    setIsMobileMenuOpen(false);
                  }, 150);
                }}
                className="text-lg font-medium text-slate-600 hover:text-sky-600 transition-colors"
              >
                Tips Fokus
              </a>
              <a 
                href="#cara-kerja" 
                onClick={() => {
                  setTimeout(() => {
                    setIsMobileMenuOpen(false);
                  }, 150);
                }}
                className="text-lg font-medium text-slate-600 hover:text-sky-600 transition-colors"
              >
                Cara Kerja
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="relative z-10 px-6 md:px-10 py-12 bg-white backdrop-blur-sm border-t border-white/50">
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
      {/* Logo & Tagline */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <img className="w-10" src="/logo_foot.png" alt="Logo" />

          <span className="text-xl font-bold tracking-tight text-sky-600">
            Satu<span className="text-pink-500">Langkah</span>
          </span>
        </div>
        <p className="text-md text-slate-500 font-medium text-center">
          Mari ubah rasa kewalahan jadi satu langkah kecil.
        </p>
      </div>
      
      {/* Safety & Copyright */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-200/50">
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50/50 px-4 py-1.5 rounded-full border border-emerald-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Tenang, foto kamu tidak disimpan
        </div>
        
        <p className="text-[9px] md:text-[10px] font-bold md:font-normal text-slate-300 uppercase tracking-widest text-center">
          &copy; 2026 Arifah Nur Basyiroh Machi. Crafted for humanity.
        </p>
      </div>
    </div>
  </footer>
);

// --- Animated Elements ---

const AnimatedClock = () => (
  <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-inner border border-slate-100 mb-6 group-hover:scale-110 transition-transform duration-500">
    <div className="absolute inset-1 border-2 border-slate-100 rounded-full" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-slate-300 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
    />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 3600, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-slate-500 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
    />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 w-0.5 h-4.5 bg-sky-400 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
    />
    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full z-10" />
  </div>
);

const AnimatedBody = () => (
  <div className="flex items-end justify-center gap-1.5 h-12 mb-6 group-hover:scale-110 transition-transform duration-500">
    <motion.div 
      animate={{ height: [15, 25, 15], y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-3.5 bg-sky-300/60 rounded-t-full"
    />
    <motion.div 
      animate={{ height: [20, 35, 20], y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="w-3.5 bg-pink-300/60 rounded-t-full"
    />
    <motion.div 
      animate={{ height: [18, 30, 18], y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="w-3.5 bg-emerald-300/60 rounded-t-full"
    />
  </div>
);

const AnimatedGift = () => (
  <div className="relative w-12 h-12 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
    <motion.div
      animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10"
    >
      <span className="text-4xl block">🎁</span>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <AnimatePresence>
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 1.5],
              y: [0, -30],
              x: [-15, 0, 15]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="text-lg"
          >
            ✨
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  </div>
);

const AnimatedDart = () => (
  <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
    <span className="text-4xl relative z-10">🎯</span>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.8],
          opacity: [0.5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeOut"
        }}
        className="absolute w-full h-full border-2 border-sky-400 rounded-full"
      />
    ))}
  </div>
);

const AnimatedGrowth = () => (
  <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
    <motion.span 
      animate={{ 
        scale: [0.8, 1.2, 1],
        rotate: [0, -5, 5, 0]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="text-4xl"
    >
      🌱
    </motion.span>
    <motion.div
      animate={{ 
        opacity: [0, 1, 0],
        y: [10, -10],
        scale: [0.5, 1]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatDelay: 1
      }}
      className="absolute -top-2 text-xs text-sky-400"
    >
      ✨
    </motion.div>
  </div>
);

const AnimatedSparkles = () => (
  <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
    <span className="text-4xl relative z-10">✨</span>
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ 
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          x: [(i - 1.5) * 20, (i - 1.5) * 30],
          y: [0, -30]
        }}
        transition={{ 
          duration: 1.5, 
          delay: i * 0.2, 
          repeat: Infinity, 
          repeatDelay: 0.5 
        }}
        className="absolute text-sm"
      >
        🌟
      </motion.div>
    ))}
  </div>
);

// --- Views ---

const LandingView = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col w-full">
    {/* Hero Section (Home) */}
    <motion.section 
      id="home"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="scroll-mt-24 flex flex-col items-center text-center space-y-12 py-20 px-4 max-w-4xl mx-auto min-h-[80vh] justify-center"
    >
      <div className="space-y-6 relative">
        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-12 h-12 bg-pink-200/30 blur-xl rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute -bottom-10 -right-10 w-16 h-16 bg-sky-200/30 blur-xl rounded-full"
        />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-800 leading-[1.1]">
          Fokus pada <br/> <span className="text-sky-600 bg-clip-text">Satu Langkah.</span>
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
          Terjebak dengan kamar yang berantakan? Unggah fotonya, dan kami akan memberikanmu <span className="text-sky-600 font-bold">satu instruksi kecil</span> sampai semuanya selesai.
        </p>
      </div>

      <button 
        onClick={onStart}
        className="group relative px-10 py-5 bg-white text-slate-800 rounded-full text-xl font-bold shadow-xl shadow-sky-100/50 border border-sky-100 overflow-hidden transition-all hover:scale-105 active:scale-95"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-pink-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <span className="relative z-10 flex items-center gap-2">
          Mulai Petualangan <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

      <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { title: "Satu", desc: "Hanya satu tugas saat ini.", icon: <AnimatedDart /> },
          { title: "Kecil", desc: "Langkah mikro yang mudah.", icon: <AnimatedGrowth /> },
          { title: "Rayakan", desc: "Dopamin di setiap klik.", icon: <AnimatedSparkles /> }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="p-6 bg-white/40 backdrop-blur-md border border-white rounded-[2rem] shadow-sm flex flex-col items-center gap-3"
          >
            <div className="mb-2">{item.icon}</div>
            <h4 className="font-bold text-slate-700">{item.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed text-center">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Tips Focus Section */}
    <motion.section 
      id="tips"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="scroll-mt-24 py-24 px-6 bg-sky-50/30 backdrop-blur-sm border-y border-white"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Tips Fokus</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Trik kecil untuk membohongi otakmu agar tetap bergerak maju.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            { title: "Aturan 2 Menit", desc: "Jika sesuatu butuh waktu kurang dari 2 menit, lakukan sekarang juga tanpa berpikir.", icon: <AnimatedClock /> },
            { title: "Body Doubling", desc: "Bekerjalah saat orang lain juga sedang bekerja, meski kalian tidak bicara.", icon: <AnimatedBody /> },
            { title: "Dopamin Mini", desc: "Berikan dirimu hadiah kecil (seperti stiker) setelah menyelesaikan satu hal.", icon: <AnimatedGift /> }
          ].map((tip, i) => (
            <motion.div 
              key={i}
              initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-lg shadow-sky-100/20 relative group overflow-hidden"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -right-8 -bottom-8 w-24 h-24 bg-sky-100/30 rounded-full blur-2xl group-hover:bg-pink-100/30 transition-colors"
              />
              <div className="mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{tip.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Cara Kerja Section */}
    <motion.section 
      id="cara-kerja"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="scroll-mt-24 py-24 px-6 bg-white/40 backdrop-blur-sm border-t border-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 bg-sky-50 text-sky-500 text-xs font-bold uppercase tracking-widest rounded-full">
            Alur Proses
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-800 leading-tight">
            Bagaimana <span className="text-pink-500">SatuLangkah</span> Bekerja?
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Kami mengubah rasa kewalahan menjadi serangkaian tindakan yang bisa kamu selesaikan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[2.75rem] left-[10%] right-[10%] h-0.5 bg-dashed bg-gradient-to-r from-sky-200 via-pink-200 to-sky-200 opacity-50 z-0 border-t-2 border-dashed border-sky-200"></div>

          {[
            { 
              step: "01", 
              title: "Foto Ruangan", 
              desc: "Ambil foto area yang berantakan. Jangan malu, ini adalah langkah pertama menuju perubahan.",
              icon: (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Camera className="w-6 h-6 text-sky-500" />
                </motion.div>
              )
            },
            { 
              step: "02", 
              title: "Cek Energi", 
              desc: "Tentukan berapa banyak tenaga yang kamu miliki sekarang. Kami akan menyesuaikan tugasnya.",
              icon: (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-6 h-6 text-pink-500" />
                </motion.div>
              )
            },
            { 
              step: "03", 
              title: "Analisis AI", 
              desc: "Gemini AI kami akan membedah foto tersebut dan membaginya menjadi langkah-langkah mikro.",
              icon: (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-6 h-6 text-indigo-500" />
                </motion.div>
              )
            },
            { 
              step: "04", 
              title: "Mulai Melangkah", 
              desc: "Ikuti satu instruksi saja. Rayakan setiap kali kamu menyelesaikannya dengan tombol 'Sudah!'.",
              icon: (
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </motion.div>
              )
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
               whileHover={{ y: -10 }}
              className="relative z-10 p-8 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-sm flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">{item.step}</span>
                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  </div>
);

const UploadView = ({ 
  energyLevel, 
  setEnergyLevel, 
  uploadingImage, 
  fileInputRef, 
  onFileUpload, 
  onReset 
}: { 
  energyLevel: EnergyLevel, 
  setEnergyLevel: (l: EnergyLevel) => void, 
  uploadingImage: string | null, 
  fileInputRef: React.RefObject<HTMLInputElement | null>, 
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  onReset: () => void 
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center space-y-12 py-12 px-6 max-w-2xl mx-auto"
  >
    <div className="w-full space-y-8 bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-sky-100/20">
      <div className="text-center">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Internal Check-in</h3>
        <h2 className="text-2xl font-bold text-slate-800">Bagaimana kabarmu?</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {(['Low', 'Normal', 'High'] as EnergyLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => setEnergyLevel(level)}
            className={cn(
              "p-4 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
              energyLevel === level 
                ? "bg-sky-50 border-sky-400 text-sky-700 shadow-md scale-105" 
                : "bg-white/60 border-transparent text-slate-400 hover:border-sky-100"
            )}
          >
            <span className="text-2xl">
              {level === 'Low' && '🔋'}
              {level === 'Normal' && '⚡'}
              {level === 'High' && '🔥'}
            </span>
            <div className="text-center">
              <p className="text-sm font-bold">{level}</p>
              <p className="text-[10px] opacity-60">
                {level === 'Low' ? 'Tugas mikro' : level === 'Normal' ? 'Moderat' : 'Siap aksi'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>

    <div className="w-full space-y-6">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer w-full aspect-video border-3 border-dashed border-white rounded-[3rem] bg-white/40 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center transition-all hover:bg-white/60 shadow-lg shadow-sky-100/10"
      >
        {uploadingImage ? (
          <img src={uploadingImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="w-20 h-20 bg-sky-100 rounded-3xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="text-sky-500 w-10 h-10" />
            </div>
            <p className="font-bold text-slate-600 text-xl tracking-tight">Tunjukkan Kekacauanmu</p>
            <p className="text-sm text-slate-400 mt-1 italic">Kami akan menyederhanakannya untukmu</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onFileUpload}
          className="hidden" 
          accept="image/*"
          id="camera-input"
        />
      </div>
    </div>

    <button 
      onClick={onReset}
      className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
    >
      Cancel & Reset
    </button>
  </motion.div>
);

const ProcessingView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4"
  >
    <div className="relative">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="w-32 h-32 rounded-full border-4 border-dashed border-blue-200"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    </div>
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-slate-800">AI Sedang Menganalisis...</h2>
      <p className="text-slate-500 animate-pulse">Menghancurkan kekacauan menjadi butiran debu instruksi yang mudah...</p>
    </div>
    <div className="flex gap-2">
      <span className="w-2 h-2 rounded-full bg-blue-300 animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
    </div>
  </motion.div>
);

const StepView = ({ 
  currentStepIndex, 
  tasks, 
  uploadingImage,
  onNextStep, 
  onReset 
}: { 
  currentStepIndex: number, 
  tasks: string[], 
  uploadingImage: string | null,
  onNextStep: () => void, 
  onReset: () => void 
}) => {
  const progress = ((currentStepIndex + 1) / tasks.length) * 100;
  
  return (
    <motion.div 
      key={`step-${currentStepIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 py-12 max-w-7xl mx-auto"
    >
      {/* Sidebar Left: Info */}
      <div className="md:col-span-3 flex flex-col gap-6">
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-sky-100/10">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-slate-800 leading-none">{Math.round(progress)}%</span>
              <span className="text-xs font-bold text-sky-600">{currentStepIndex + 1}/{tasks.length}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-sky-400 to-sky-300 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.3)]"
              />
            </div>
          </div>
        </div>

        <div className="bg-pink-50/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-pink-100/50 flex-1 flex flex-col justify-center">
          <h3 className="text-xs uppercase tracking-widest font-bold text-pink-400 mb-4">Mantra Hari Ini</h3>
          <p className="text-sm text-pink-800 leading-relaxed italic font-medium">
            &quot;Satu hal kecil pada satu waktu adalah cara terbaik untuk mengalahkan kelelahan.&quot;
          </p>
        </div>
      </div>

      {/* Center: The One Thing */}
      <div className="md:col-span-6 flex flex-col items-center">
        <div className="w-full bg-white/80 backdrop-blur-2xl rounded-[3.5rem] border border-white shadow-2xl shadow-sky-200/20 flex flex-col items-center justify-center text-center p-12 md:p-20 relative overflow-hidden min-h-[450px]">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-40"></div>
          
          <div className="mb-10 relative">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-5xl animate-pulse">
              🎯
            </div>
          </div>

          <h2 className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">Tugas Saat Ini</h2>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-12">
            {tasks[currentStepIndex]}
          </h1>

          <button 
            onClick={onNextStep}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-pink-400 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
            <div className="relative bg-white text-slate-800 px-14 py-6 rounded-full font-black text-2xl border border-sky-100 shadow-sm transition-all hover:scale-105 active:scale-95">
              Sudah! ✨
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar Right: Preview */}
      <div className="md:col-span-3 flex flex-col gap-6">
        <div className="bg-white/60 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white shadow-xl shadow-sky-100/10">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 px-2">Analisis Visual</h3>
          <div className="aspect-square bg-slate-200 rounded-[2rem] overflow-hidden relative border-4 border-white shadow-inner flex items-center justify-center">
            {uploadingImage ? (
              <img src={uploadingImage} alt="Analysis Target" className="w-full h-full object-cover opacity-80" />
            ) : (
              <span className="text-6xl opacity-20">🏠</span>
            )}
            <div className="absolute inset-0 bg-sky-500/5"></div>
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border-2 border-white/50"
            />
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full border-2 border-white/50"
            />
          </div>
          <p className="mt-4 text-[11px] text-center text-slate-400 italic font-medium px-4">
            AI sedang melacak progres berdasarkan foto awalmu.
          </p>
        </div>

        <button 
          onClick={onReset}
          className="mt-auto flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-widest py-4 rounded-3xl hover:bg-pink-50/50"
        >
          <RefreshCcw size={12} /> Restart Program
        </button>
      </div>
    </motion.div>
  );
};

const FinishedView = ({ onReset }: { onReset: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 text-center px-4 max-w-2xl mx-auto"
  >
    <div className="relative">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-48 h-48 bg-white/40 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white shadow-2xl shadow-sky-200/50"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-lg">
          <CheckCircle2 size={64} />
        </div>
      </motion.div>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [-20, -150], 
            x: [0, (i % 2 === 0 ? 80 : -80)],
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.5)]"
        />
      ))}
    </div>

    <div className="space-y-6">
      <h2 className="text-5xl font-black text-slate-800 tracking-tight">MISSION ACCOMPLISHED! 🥳</h2>
      <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
        Setiap butiran debu instruksi telah kamu taklukkan. Ambillah waktu sejenak untuk bernapas dan bangga pada progresmu.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-6 w-1/2 max-w-md">
      <button 
        onClick={onReset}
        className="flex-1 px-10 py-5 bg-pink-600 text-white rounded-3xl font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 hover:scale-105 active:scale-95"
      >
        Lantai Berikutnya
      </button>
    </div>
  </motion.div>
);

export default function SatuLangkahApp() {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('Normal');
  const [tasks, setTasks] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transitions
  const handleStart = () => setAppState('UPLOAD');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadingImage(event.target?.result as string);
      reader.readAsDataURL(file);
      setTimeout(() => {
        setAppState('PROCESSING');
      }, 500);
    }
  };

  useEffect(() => {
  if (appState !== 'PROCESSING' || !uploadingImage) return;

  const runAIAnalysis = async () => {
    try {
      const base64Data = uploadingImage.split(',')[1];
      const mimeType = uploadingImage.split(',')[0]
        .split(':')[1]
        .split(';')[0];

      const prompt = `
Analisis foto ruangan ini.

Temukan barang yang berantakan:
- pakaian
- botol
- sampah
- kertas
- meja berantakan

Buat langkah mikro sederhana.

Energi user: ${energyLevel}

Rules:
- Low = 4 langkah
- Normal = 6 langkah
- High = 8 langkah

Gunakan bahasa Indonesia singkat.

Return JSON array only.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: prompt,
          },
        ],

        config: {
          responseMimeType: "application/json",

          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error("Empty response");
      }

      const aiTasks = JSON.parse(text);

      setTasks(aiTasks);
      setCurrentStepIndex(0);
      setAppState('STEPS');

    } catch (error) {
      console.error(error);

      const selectedTasks = MOCK_TASKS[energyLevel];

      setTasks(selectedTasks);
      setCurrentStepIndex(0);
      setAppState('STEPS');
    }
  };

  runAIAnalysis();

}, [appState, uploadingImage, energyLevel]);

  const handleNextStep = () => {
    if (currentStepIndex < tasks.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setAppState('FINISHED');
    }
  };

  const handleReset = () => {
    setAppState('LANDING');
    setUploadingImage(null);
    setCurrentStepIndex(0);
    setTasks([]);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans selection:bg-sky-100 selection:text-sky-600 relative overflow-hidden flex flex-col">
      {/* Soft Mesh Gradient Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      
      <Navbar />
      
      <div className="flex-1 relative z-10 pt-20">
        <AnimatePresence mode="wait">
          {appState === 'LANDING' && <LandingView key="landing" onStart={handleStart} />}
          {appState === 'UPLOAD' && (
            <UploadView 
              key="upload" 
              energyLevel={energyLevel} 
              setEnergyLevel={setEnergyLevel} 
              uploadingImage={uploadingImage} 
              fileInputRef={fileInputRef} 
              onFileUpload={handleFileUpload} 
              onReset={handleReset} 
            />
          )}
          {appState === 'PROCESSING' && <ProcessingView key="processing" />}
          {appState === 'STEPS' && (
            <StepView 
              key="steps" 
              currentStepIndex={currentStepIndex} 
              tasks={tasks} 
              uploadingImage={uploadingImage}
              onNextStep={handleNextStep} 
              onReset={handleReset} 
            />
          )}
          {appState === 'FINISHED' && <FinishedView key="finished" onReset={handleReset} />}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
