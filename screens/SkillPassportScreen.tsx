
import React, { useMemo, useState, useEffect } from 'react';
import { MISSIONS, OPPORTUNITIES, WORLDS } from '../constants';
import { Opportunity } from '../types';
import { 
  Fingerprint, 
  Cpu, 
  Rocket, 
  School, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Scan,
  Database
} from 'lucide-react';

interface SkillPassportScreenProps {
  completedMissions: number[];
  userXp: number;
  userLevel: number;
}

const SkillPassportScreen: React.FC<SkillPassportScreenProps> = ({ completedMissions, userXp, userLevel }) => {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Neural Matching Logic
  const matchingData = useMemo(() => {
    // 1. Calculate mastery per world
    const worldMastery: Record<string, number> = {};
    WORLDS.forEach(w => {
      const worldMissions = MISSIONS.filter(m => m.worldId === w.id);
      const completedInWorld = worldMissions.filter(m => completedMissions.includes(m.id));
      worldMastery[w.id] = worldMissions.length > 0 ? (completedInWorld.length / worldMissions.length) : 0;
    });

    // 2. Identify top skills/categories
    const technicalScore = (worldMastery['computer-science'] || 0) + (worldMastery['robotics'] || 0) + (worldMastery['engineering'] || 0);
    const academicScore = (worldMastery['mathematics'] || 0) + (worldMastery['physics'] || 0) + (worldMastery['biology'] || 0);
    const impactScore = (worldMastery['env-science'] || 0) + (worldMastery['health-science'] || 0);

    // 3. Match opportunities
    const matchedUniversities = OPPORTUNITIES.filter(o => 
      o.category === 'University' && (academicScore > 0.1 || userLevel >= 3)
    ).slice(0, 10);

    const matchedFellowships = OPPORTUNITIES.filter(o => 
      o.category === 'Fellowship' && (userLevel >= 5 || impactScore > 0.2)
    ).slice(0, 10);

    const matchedTraining = OPPORTUNITIES.filter(o => 
      o.category === 'Training' && (technicalScore > 0.05 || userLevel >= 1)
    ).slice(0, 10);

    return {
      stats: { technicalScore, academicScore, impactScore },
      matches: {
        University: matchedUniversities,
        Fellowship: matchedFellowships,
        Training: matchedTraining
      }
    };
  }, [completedMissions, userLevel]);

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 scanlines">
        <div className="relative mb-12">
          <Fingerprint size={120} className="text-amber-500/20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Scan size={80} className="text-amber-500 animate-[ping_2s_infinite]" />
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-[scan-move_2s_infinite]"></div>
        </div>
        <h2 className="text-2xl font-tactical font-black text-white uppercase italic tracking-widest mb-4">Neural Handshake in Progress...</h2>
        <p className="text-slate-500 text-xs font-tactical tracking-[0.4em] uppercase">Analyzing mission data & skill metrics</p>
        <style>{`
          @keyframes scan-move {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-10 scanlines animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="text-left">
          <div className="flex items-center gap-4 mb-3">
             <div className="p-3 bg-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Fingerprint size={24} className="text-slate-950" />
             </div>
             <div>
                <h2 className="text-4xl font-tactical font-black text-white tracking-tighter uppercase italic leading-none">Skill Passport</h2>
                <p className="text-amber-500/60 text-[10px] font-tactical font-black tracking-[0.4em] uppercase mt-1">Matched Growth Protocols Enabled</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
           {[
             { label: 'Technical', score: matchingData.stats.technicalScore, icon: Cpu },
             { label: 'Academic', score: matchingData.stats.academicScore, icon: BarChart3 },
             { label: 'Impact', score: matchingData.stats.impactScore, icon: Activity }
           ].map((s, i) => (
             <div key={i} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-1 shadow-xl">
                <s.icon size={14} className="text-amber-500" />
                <span className="text-[8px] font-tactical font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                <span className="text-xs font-tactical font-black text-white">{(s.score * 100).toFixed(0)}%</span>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-16 pb-32">
        {/* Fix: Explicitly type entries to avoid 'unknown' type for 'list' which causes length and map errors */}
        {(Object.entries(matchingData.matches) as [string, Opportunity[]][]).map(([category, list]) => (
          <section key={category}>
            <div className="flex items-center gap-4 mb-8">
               <div className={`w-10 h-[2px] ${category === 'University' ? 'bg-blue-500' : category === 'Fellowship' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
               <div className="flex items-center gap-3">
                  {category === 'University' ? <School size={18} className="text-blue-400" /> : category === 'Fellowship' ? <Rocket size={18} className="text-rose-400" /> : <Database size={18} className="text-emerald-400" />}
                  <h3 className="text-xl font-tactical font-black text-white tracking-tighter uppercase italic">{category} Matches</h3>
               </div>
               <span className="text-[9px] font-tactical font-black text-slate-500 uppercase tracking-widest bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                 {list.length} PIPELINES FOUND
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.length > 0 ? (
                list.map((opp) => (
                  <div key={opp.id} className="bg-slate-950/40 border border-slate-800 hover:border-amber-500/30 rounded-[2.5rem] p-6 group transition-all duration-500 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="relative z-10">
                       <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                             {opp.logo}
                          </div>
                          <div className="flex flex-col items-end">
                             <div className="flex items-center gap-1 text-emerald-500 mb-1">
                                <Sparkles size={10} className="fill-emerald-500" />
                                <span className="text-[8px] font-tactical font-black uppercase tracking-widest">98% Match</span>
                             </div>
                             <div className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-lg">
                                <span className="text-[7px] font-tactical font-black text-slate-500 uppercase tracking-widest">Verified Node</span>
                             </div>
                          </div>
                       </div>
                       <h4 className="text-lg font-tactical font-black text-white uppercase italic tracking-tighter mb-3 leading-tight group-hover:text-amber-500 transition-colors">
                         {opp.name}
                       </h4>
                       <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed mb-8">
                         "{opp.description}"
                       </p>
                    </div>

                    <button 
                      onClick={() => window.open(opp.url, '_blank')}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-500 font-tactical font-black text-[9px] py-4 rounded-2xl tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/btn active:scale-95 shadow-lg"
                    >
                      CONNECT TO PIPELINE
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>

                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/5 transition-all"></div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 px-8 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center bg-slate-950/20">
                   <Activity size={40} className="text-slate-700 mb-4 animate-pulse" />
                   <h4 className="text-sm font-tactical font-black text-slate-500 uppercase tracking-widest mb-2">Insufficient Neural Data</h4>
                   <p className="text-[10px] font-medium text-slate-600 uppercase max-w-xs italic">Continue solving tactical missions in this sector to unlock matching growth protocols.</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40">
         <div className="bg-amber-500 text-slate-950 px-8 py-3 rounded-full flex items-center gap-3 shadow-[0_15px_40px_rgba(245,158,11,0.4)] animate-in slide-in-from-bottom-10">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-tactical font-black uppercase tracking-widest">Global Mesh Sync Optimized</span>
         </div>
      </div>
    </div>
  );
};

export default SkillPassportScreen;
