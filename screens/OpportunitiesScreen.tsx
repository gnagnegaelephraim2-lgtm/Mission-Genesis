
import React, { useState } from 'react';
import { OPPORTUNITIES } from '../constants';
import { Sparkles, ArrowUpRight, Filter, Search, GraduationCap, School, Rocket, Cpu } from 'lucide-react';

const OpportunitiesScreen: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'University' | 'Fellowship' | 'Training'>('All');

  const filtered = filter === 'All' 
    ? OPPORTUNITIES 
    : OPPORTUNITIES.filter(o => o.category === filter);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'University': return <School size={16} />;
      case 'Training': return <Cpu size={16} />;
      case 'Fellowship': return <Rocket size={16} />;
      default: return <GraduationCap size={16} />;
    }
  };

  return (
    <div className="p-4 sm:p-10 scanlines">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-[2px] bg-amber-500"></div>
             <h2 className="text-3xl font-tactical font-black text-white tracking-tighter uppercase italic">Growth Hub</h2>
          </div>
          <p className="text-slate-500 text-sm font-medium">Curated STEM pipelines and elite institutional pathways.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'University', 'Fellowship', 'Training'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-5 py-2.5 rounded-xl font-tactical font-black text-[9px] tracking-[0.2em] uppercase transition-all whitespace-nowrap border ${
                filter === cat 
                ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-32">
        {filtered.map((opp) => (
          <div 
            key={opp.id} 
            className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between shadow-3xl backdrop-blur-sm"
          >
            {opp.recommended && (
              <div className="absolute top-0 right-0 bg-amber-500 px-6 py-2 rounded-bl-[2rem] shadow-xl z-10 border-l border-b border-slate-950">
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-slate-950 fill-slate-950" />
                  <span className="text-[10px] font-tactical font-black text-slate-950 tracking-widest uppercase">Elite Pick</span>
                </div>
              </div>
            )}

            <div className="relative z-10">
              <div className="flex gap-5 items-start mb-8">
                <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-slate-800 transition-transform group-hover:scale-110 duration-500 flex-shrink-0">
                  {opp.logo}
                </div>
                <div className="flex-1 pr-10">
                   <div className="flex items-center gap-2 mb-1.5 opacity-60">
                      <div className="text-amber-500">{getCategoryIcon(opp.category)}</div>
                      <span className="text-[8px] font-tactical font-black uppercase tracking-[0.2em] text-white/50">{opp.category}</span>
                   </div>
                  <h3 className="text-2xl font-tactical font-black text-white leading-none uppercase tracking-tighter mb-4 italic">
                    {opp.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed mb-10 italic">
                "{opp.description}"
              </p>
            </div>

            <button 
              onClick={() => window.open(opp.url, '_blank')}
              className="w-full bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-500 font-tactical font-black text-[11px] py-5 rounded-[1.5rem] tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn shadow-xl active:scale-95"
            >
              UPLINK PROTOCOL
              <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
            
            {/* Ambient Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/5 transition-all"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesScreen;
