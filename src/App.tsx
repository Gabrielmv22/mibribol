import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Lock, Heart as HeartIcon, Sparkles } from 'lucide-react';
import TextHeart from './components/TextHeart';

const Typewriter = ({ text, delay = 50, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, delay, onComplete]);

  return <span className="font-mono">{currentText}</span>;
};

export default function App() {
  const [stage, setStage] = useState<'console' | 'reveal'>('console');
  const [consoleFinished, setConsoleFinished] = useState(false);
  const [showTeAmo, setShowTeAmo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const triggerSurprise = useCallback(() => {
    setStage('reveal');
    
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio bloqueado:", err));
    }

    setTimeout(() => {
      setShowTeAmo(true);
    }, 5000);
  }, []);

  const handleReveal = useCallback(() => {
    if (stage === 'console' && consoleFinished) {
      triggerSurprise();
    }
  }, [stage, consoleFinished, triggerSurprise]);

  return (
    <div 
      onClick={handleReveal}
      className={`relative min-h-screen w-full flex items-center justify-center bg-[#050505] selection:bg-pink-deep/30 ${stage === 'console' && consoleFinished ? 'cursor-pointer' : ''}`}
    >
      <audio ref={audioRef} src="/cancion.mp3" preload="auto" />

      <div className="scanline" />
      
      <AnimatePresence mode="wait">
        {stage === 'console' ? (
          <motion.div
            key="console"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-2xl p-4 md:p-8 font-mono text-xs md:text-base text-white/80"
          >
            <div className="space-y-2">
              <div className="flex gap-2 text-pink-soft/60">
                <span>[system]</span>
                <Typewriter 
                  text="Initializing heart.PROTOCOL_v2.0..." 
                  delay={30} 
                  onComplete={() => setConsoleFinished(true)}
                />
              </div>
              
              <div className="flex gap-2 h-6">
                <span>[status]</span>
                {consoleFinished && (
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-green-400"
                    >
                        Lista?
                    </motion.span>
                )}
              </div>

              {consoleFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 md:pt-8 flex flex-col items-start gap-4 md:gap-6"
                >
                  <p className="text-white/40 italic">
                    {">"} Bruhhh haz click aqui.
                  </p>
                  
                  <button
                    id="decrypt-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerSurprise(); 
                    }}
                    className="group flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 border border-pink-deep/30 bg-pink-deep/5 hover:bg-pink-deep/10 text-pink-soft transition-all duration-300 pointer-events-auto"
                  >
                    <Lock size={14} className="group-hover:rotate-12 transition-transform md:w-4 md:h-4" />
                    <span className="font-mono tracking-widest uppercase text-[10px] md:text-xs">Haz click amorcito</span>
                    <span className="terminal-cursor" />
                  </button>
                  
                  <p className="text-[9px] md:text-[10px] text-white/20 animate-pulse">
                    (o donde sea :D)
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            <TextHeart />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 3, duration: 1.5 }}
              className="z-20 text-center"
            >
              <h2 className="text-pink-deep font-mono text-lg md:text-xl tracking-[0.3em] uppercase glow-text mb-2">
                ...
              </h2>
              <div className="w-12 h-px bg-pink-deep/30 mx-auto mb-6 md:mb-8" />
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setStage('console');
                  setShowTeAmo(false); 
                  if(audioRef.current) {
                    audioRef.current.pause(); 
                    audioRef.current.currentTime = 0;
                  }
                }}
                className="text-white/20 hover:text-white/60 transition-colors uppercase text-[9px] md:text-[10px] tracking-widest font-mono p-2"
              >
                Volver al principio
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {showTeAmo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0.3, 1, 0.3], 
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
                >
                  {/* Aquí agregué tu "RATABOL", asegurando que tenga la letra romántica y se ajuste al móvil */}
                  <h1 className="text-6xl md:text-9xl font-romantic font-bold text-white drop-shadow-[0_0_30px_rgba(255,77,109,1)] text-center leading-tight">
                    RATABOL 💓
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-4 left-4 md:top-8 md:left-8 text-[8px] md:text-[10px] font-mono text-white/10 uppercase tracking-widest space-y-1">
                <div>ln: 420</div>
                <div>id: 0xDEADBEEF</div>
                <div>type: ????</div>
            </div>
            
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-[8px] md:text-[10px] font-mono text-white/10 uppercase tracking-widest">
                mi corazoncito para mi bri // proceso exitoso
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}