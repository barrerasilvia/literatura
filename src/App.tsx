import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  Layers,
  GraduationCap,
  Download
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cards } from './data/cards.ts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<string>('Todas');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  }, []);

  const categories = ['Todas', ...Array.from(new Set(cards.map(c => c.category)))];
  const filteredCards = filter === 'Todas' ? cards : cards.filter(c => c.category === filter);
  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const downloadCSV = () => {
    const content = cards.map(c => `"${c.question}";"${c.answer}"`).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tarjetas_anki_corregidas.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] dark:bg-zinc-950 text-[#1A1A1A] dark:text-zinc-100 font-sans selection:bg-[#D4CFC7] dark:selection:bg-zinc-800 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white dark:text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Anki Master</h1>
              <p className="text-xs text-black/50 dark:text-white/50 uppercase tracking-widest font-semibold">Revisión de Lengua y Literatura</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadCSV}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <Download size={16} />
              <span>Exportar Anki</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                filter === cat 
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                  : "bg-white dark:bg-zinc-900 text-black/60 dark:text-white/60 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Card Container */}
        <div className="relative max-w-2xl mx-auto h-[450px] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x > swipeThreshold) {
                  handlePrev();
                } else if (info.offset.x < -swipeThreshold) {
                  handleNext();
                }
              }}
              className="w-full h-full cursor-pointer touch-pan-y"
              onTap={() => setIsFlipped(!isFlipped)}
            >
              <div className={cn(
                "relative w-full h-full transition-all duration-500 preserve-3d",
                isFlipped && "rotate-y-180"
              )}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-900 rounded-[32px] p-8 sm:p-12 shadow-2xl shadow-black/5 dark:shadow-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-black/5 dark:bg-white/5" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30 dark:text-white/30">{currentCard?.category}</span>
                    <Layers size={16} className="text-black/20 dark:text-white/20" />
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                    <div className="min-h-full flex flex-col justify-center text-center">
                      <h2 className="text-2xl sm:text-3xl font-serif italic text-black/80 dark:text-white/80 leading-tight">
                        {currentCard?.question}
                      </h2>
                    </div>
                  </div>
                  <div className="text-center text-xs font-bold text-black/20 dark:text-white/20 uppercase tracking-widest mt-4">
                    Click para revelar respuesta
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black dark:bg-zinc-100 text-white dark:text-black rounded-[32px] p-8 sm:p-12 shadow-2xl border border-white/10 dark:border-black/10 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-white/10 dark:bg-black/10" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 dark:text-black/30">Respuesta</span>
                    <CheckCircle2 size={16} className="text-white/40 dark:text-black/40" />
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                    <div className="min-h-full flex flex-col justify-center text-center">
                      <p className="text-lg sm:text-2xl font-medium leading-relaxed text-white/90 dark:text-black/90">
                        {currentCard?.answer}
                      </p>
                    </div>
                  </div>
                  <div className="text-center text-xs font-bold text-white/20 dark:text-black/20 uppercase tracking-widest mt-4">
                    Click para volver a la pregunta
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-lg shadow-black/5 dark:shadow-white/5 active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="bg-white dark:bg-zinc-900 px-6 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
            <span className="font-mono text-sm font-bold">
              {currentIndex + 1} <span className="text-black/20 dark:text-white/20">/</span> {filteredCards.length}
            </span>
          </div>

          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-lg shadow-black/5 dark:shadow-white/5 active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-24 border-t border-black/5 dark:border-white/5 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Instrucciones</h3>
            <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
              He expandido la base de datos a 300 tarjetas para cubrir todo el año escolar. Usa los filtros para estudiar temas específicos.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Interfaz</h3>
            <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
              Optimizado para móviles: puedes deslizar las tarjetas a la izquierda o derecha para navegar, además de usar las flechas.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Estado</h3>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-600">300 Tarjetas Listas</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.4);
        }
      `}</style>
    </div>
  );
}
