
import React, { useState, useMemo } from 'react';
import { OPPORTUNITIES } from '../constants';
import { 
  Sparkles, 
  ArrowUpRight, 
  School, 
  Rocket, 
  Cpu, 
  Globe2, 
  Library, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Microscope,
  Leaf
} from 'lucide-react';

const OpportunitiesScreen: React.FC = () => {
  const [activePillar, setActivePillar] = useState<'all' | 'academic' | 'impact'>('all');

  const pillars = useMemo(() => {
    return {
      academic: OPPORTUNITIES.filter(o => o.category === 'University' || o.name.toLowerCase().includes('research')),
      impact: OPPORTUNITIES.filter(o => o.category === 'Fellowship' || o.category === 'Training')
    };
  }, []);

  const displayList = useMemo(() => {
    if (activePillar === 'academic') return pillars.academic;
    if (activePillar === 'impact') return pillars.impact;
    return OPPORTUNITIES;
  }, [activePillar, pillars]);

  return (
    <div className="p-4 sm:p-10 scanlines animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="text-left space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
             <h2 className="text-4xl md:text-5xl font-tactical font-black text-white tracking-tighter uppercase italic leading-none">Growth Strategy</h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-tactical tracking-[0.2em] uppercase font-bold max-w-xl italic">
            Synchronizing mission performance with global institutional pipelines. Select your growth trajectory below.
          </p>
        </div>

        {/* GROWTH TOGGLE */}
        <div className="bg-slate-900/60 p-1.5 rounded-[2rem] border border-slate-800 flex shadow-2xl backdrop-blur-xl">
           {[
             { id: 'all', label: 'All Protocols', icon: Globe2 },
             { id: 'academic', label: 'Academic Meridian', icon: Library },
             { id: 'impact', label: 'Impact Horizon', icon: Lightbulb }
           ].map((p) => (
             <button
               key={p.id}
               onClick={() => setActivePillar(p.id as any)}
               className={`flex items-center gap-2 px-6 py-3 rounded-full font-tactical font-black text-[9px] uppercase tracking-widest transition-all ${
                 activePillar === p.id 
                 ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                 : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <p.icon size={14} />
               <span className="hidden sm:inline">{p.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* PILLAR DASHBOARD (If viewing all) */}
      {activePillar === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
           {/* ACADEMIC PILLAR CARD */}
           <div className="group relative bg-blue-600/5 border border-blue-500/20 rounded-[3rem] p-10 overflow-hidden hover:border-blue-500/50 transition-all duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-8">
                 <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                    <Microscope size={32} className="text-blue-400" />
                 </div>
                 <span className="text-[10px] font-tactical font-black text-blue-500 tracking-[0.4em] uppercase">Sector Alpha-9</span>
              </div>
              <h3 className="text-3xl font-tactical font-black text-white uppercase italic tracking-tighter mb-4">The Academic Meridian</h3>
              <p className="text-sm text-slate-400 font-medium italic mb-8 leading-relaxed">
                Elite theoretical research pipelines. Optimized for high-performance solvers in Physics, Mathematics, and Core Sciences.
              </p>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px]">🎓</div>
                    ))}
                 </div>
                 <span className="text-[10px] font-tactical font-black text-blue-400 uppercase tracking-widest">53 Institutional Nodes Locked</span>
              </div>
           </div>

           {/* IMPACT PILLAR CARD */}
           <div className="group relative bg-emerald-600/5 border border-emerald-500/20 rounded-[3rem] p-10 overflow-hidden hover:border-emerald-500/50 transition-all duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-10 group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-8">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                    <Leaf size={32} className="text-emerald-400" />
                 </div>
                 <span className="text-[10px] font-tactical font-black text-emerald-500 tracking-[0.4em] uppercase">Sector Omega-1</span>
              </div>
              <h3 className="text-3xl font-tactical font-black text-white uppercase italic tracking-tighter mb-4">The Impact Horizon</h3>
              <p className="text-sm text-slate-400 font-medium italic mb-8 leading-relaxed">
                Applied social engineering and development fellowships. Tailored for community-driven innovation and environmental scale.
              </p>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px]">🌍</div>
                    ))}
                 </div>
                 <span className="text-[10px] font-tactical font-black text-emerald-400 uppercase tracking-widest">51 Tactical Fellowships Active</span>
              </div>
           </div>
        </div>
      )}

      {/* OPPORTUNITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-32">
        {displayList.map((opp) => (
          <div 
            key={opp.id} 
            className="bg-slate-950/40 border border-slate-800 rounded-[3rem] p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between shadow-3xl backdrop-blur-sm"
          >
            {opp.recommended && (
              <div className="absolute top-0 right-0 bg-amber-500 px-6 py-2 rounded-bl-[2rem] shadow-xl z-10 border-l border-b border-slate-950">
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-slate-950 fill-slate-950" />
                  <span className="text-[10px] font-tactical font-black text-slate-950 tracking-widest uppercase italic">Elite Pipeline</span>
                </div>
              </div>
            )}

            <div className="relative z-10">
              <div className="flex gap-5 items-start mb-8">
                <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-800 transition-transform group-hover:scale-110 duration-500 flex-shrink-0">
                  {opp.logo}
                </div>
                <div className="flex-1 pr-10">
                   <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded-md ${opp.category === 'University' ? 'bg-blue-500/20 text-blue-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                        {opp.category === 'University' ? <School size={12} /> : <Rocket size={12} />}
                      </div>
                      <span className="text-[8px] font-tactical font-black uppercase tracking-[0.2em] text-white/40">{opp.category}</span>
                   </div>
                  <h3 className="text-2xl font-tactical font-black text-white leading-[1.1] uppercase tracking-tighter mb-4 italic group-hover:text-amber-500 transition-colors">
                    {opp.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed mb-10 italic opacity-80 group-hover:opacity-100">
                "{opp.description}"
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-amber-500" />
                    <span className="text-[8px] font-tactical font-black text-slate-500 uppercase tracking-widest">Growth Potential</span>
                 </div>
                 <span className="text-[10px] font-tactical font-black text-white italic">High-Fidelity</span>
              </div>
              
              <button 
                onClick={() => window.open(opp.url, '_blank')}
                className="w-full bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-500 font-tactical font-black text-[11px] py-5 rounded-[1.8rem] tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn shadow-xl active:scale-95"
              >
                UPLINK PROTOCOL
                <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            
            {/* Ambient Background Glow */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/5 transition-all ${opp.category === 'University' ? 'bg-blue-500/5' : 'bg-emerald-500/5'}`}></div>
          </div>
        ))}
      </div>

      {/* FOOTER STATS */}
      <div className="fixed bottom-28 left-0 right-0 z-40 pointer-events-none px-4">
         <div className="max-w-4xl mx-auto bg-slate-950/80 backdrop-blur-2xl border border-slate-800 px-8 py-4 rounded-[2rem] flex items-center justify-between shadow-3xl pointer-events-auto">
            <div className="flex items-center gap-4">
               <ShieldCheck size={20} className="text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-tactical font-black text-slate-500 uppercase tracking-widest">Operational Readiness</span>
                  <span className="text-[10px] font-tactical font-black text-white italic">Level 4 Node Access Granted</span>
               </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-800 mx-4"></div>
            <div className="flex items-center gap-4">
               <Zap size={20} className="text-amber-500" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-tactical font-black text-slate-500 uppercase tracking-widest">Opportunity Yield</span>
                  <span className="text-[10px] font-tactical font-black text-white italic">125+ Strategic Pipes Active</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OpportunitiesScreen;
