'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/50">
    <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm"> */}
          <img className='w-12' src="/logo_foot.png" alt="Logo" />
        {/* </div> */}
        <span className="text-2xl font-bold tracking-tight text-sky-600">
          Satu<span className="text-pink-500">Langkah</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
        <a href="#" className="text-sky-600 border-b-2 border-sky-400 pb-1">Home</a>
        <a href="#" className="hover:text-sky-600 transition-colors">Tips Focus</a>
        <a href="#" className="hover:text-sky-600 transition-colors">Komunitas</a>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="relative z-10 px-10 py-8 bg-white/40 backdrop-blur-sm border-t border-white/50 flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-xs text-slate-400 font-medium tracking-wide italic">
      &quot;Hanya satu hal kecil, lalu berhenti jika perlu.&quot;
    </p>
    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
      &copy; 2026 Arifah Nur Basyiroh Machi. Crafted for humanity.
    </p>
  </footer>
);

// --- Views ---

const LandingView = ({ onStart }: { onStart: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="flex flex-col items-center text-center space-y-12 py-16 px-4 max-w-4xl mx-auto"
  >
    <div className="space-y-6">
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
        { title: "Satu", desc: "Hanya satu tugas saat ini.", icon: "🎯" },
        { title: "Kecil", desc: "Langkah mikro yang mudah.", icon: "🌱" },
        { title: "Rayakan", desc: "Dopamin di setiap klik.", icon: "✨" }
      ].map((item, i) => (
        <div key={i} className="p-6 bg-white/40 backdrop-blur-md border border-white rounded-[2rem] shadow-sm flex flex-col items-center gap-3">
          <span className="text-2xl">{item.icon}</span>
          <h4 className="font-bold text-slate-700">{item.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </motion.div>
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
  onNextStep, 
  onReset 
}: { 
  currentStepIndex: number, 
  tasks: string[], 
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
          <div className="aspect-square bg-slate-200 rounded-[2rem] overflow-hidden relative border-4 border-white shadow-inner bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-6xl opacity-20">🏠</span>
            <div className="absolute inset-0 bg-sky-500/5"></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-pink-500 rounded-full animate-ping opacity-60"></div>
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

    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
      <button 
        onClick={onReset}
        className="flex-1 px-10 py-5 bg-sky-600 text-white rounded-3xl font-black text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 hover:scale-105 active:scale-95"
      >
        Lantai Berikutnya
      </button>
      <button className="flex-1 px-10 py-5 bg-white/60 backdrop-blur-md border border-white text-slate-700 rounded-3xl font-bold hover:bg-white/80 transition-all shadow-sm">
        Bagikan Milestone
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
    if (appState === 'PROCESSING') {
      const timer = setTimeout(() => {
        const selectedTasks = MOCK_TASKS[energyLevel];
        setTasks([...selectedTasks].sort(() => Math.random() - 0.5));
        setCurrentStepIndex(0);
        setAppState('STEPS');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState, energyLevel]);

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
