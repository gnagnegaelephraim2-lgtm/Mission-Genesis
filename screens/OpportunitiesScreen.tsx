
import React from 'react';
import { OPPORTUNITIES } from '../constants';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const OpportunitiesScreen: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-tactical font-black text-white tracking-tighter leading-none mb-2 italic">GROWTH FEED</h2>
        <p className="text-slate-400 text-sm font-medium">Curated opportunities based on your mission performance.</p>
      </div>

      <div className="space-y-6">
        {OPPORTUNITIES.map((opp) => (
          <div 
            key={opp.id} 
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300"
          >
            {opp.recommended && (
              <div className="absolute top-0 right-0 bg-amber-500 px-4 py-1 rounded-bl-2xl shadow-lg z-10">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-slate-950 fill-slate-950" />
                  <span className="text-[10px] font-tactical font-black text-slate-950 tracking-widest">FOR YOU</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 items-start mb-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-slate-700/50 group-hover:scale-105 transition-transform duration-500">
                {opp.logo}
              </div>
              <div className="flex-1 pr-12">
                <h3 className="text-lg font-tactical font-black text-white leading-tight mb-1 uppercase tracking-tighter">
                  {opp.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  {opp.description}
                </p>
              </div>
            </div>

            <button 
              onClick={() => window.open(opp.url, '_blank')}
              className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-tactical font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
            >
              LEARN MORE
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
            
            {/* Tactical Grid Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesScreen;
