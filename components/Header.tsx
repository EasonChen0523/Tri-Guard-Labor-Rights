
import React from 'react';
import { ShieldAlert, Scale, Building2, Smartphone, Lightbulb } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onOpenIdentityGuide: () => void;
  onOpenMindsetGuide: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenIdentityGuide, onOpenMindsetGuide }) => {
  return (
    <header className="bg-slate-900 text-white pb-16 pt-10 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute right-[-10%] top-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
         <div className="absolute left-[-10%] bottom-[-10%] w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Logo className="w-20 h-20 md:w-24 h-24" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            勞權三線守護基地
          </h1>
        </div>
        
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          整合 <span className="text-blue-400 font-bold">勞保局</span>、<span className="text-amber-400 font-bold">勞檢處</span>、<span className="text-red-400 font-bold">國稅局</span> 三大檢舉管道。<br className="hidden md:block"/>
          一站式生成專業文案，讓您的勞權防線滴水不漏。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <button 
            onClick={onOpenMindsetGuide}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-amber-500/40 transition-all transform hover:scale-105 active:scale-95"
          >
            <Lightbulb className="w-5 h-5" />
            同步三線心法
          </button>

          <button 
            onClick={onOpenIdentityGuide}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-full font-bold shadow-xl shadow-indigo-500/40 transition-all transform hover:scale-105 active:scale-95"
          >
            <Smartphone className="w-5 h-5" />
            行動自然人憑證教學
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm font-bold mt-10">
            <div className="bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> 勞保局
            </div>
            <div className="bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div> 勞檢處
            </div>
            <div className="bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> 國稅局
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
