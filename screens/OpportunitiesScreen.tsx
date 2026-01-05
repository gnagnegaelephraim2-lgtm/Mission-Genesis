
import React from 'react';
import { OPPORTUNITIES } from '../constants';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const OpportunitiesScreen: React.FC = () => {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <h2 className="text-4xl font-tactical font-black text-white tracking-tighter leading-none mb-3 italic uppercase">Growth Feed</h2>
        <p className="text-slate-400 text-base font-medium">Curated STEM pipelines and elite tactical programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {OPPORTUNITIES.map((opp) => (
          <div 
            key={opp.id} 
            className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-7 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between shadow-2xl"
          >
            {opp.recommended && (
              <div className="absolute top-0 right-0 bg-amber-500 px-6 py-2 rounded-bl-3xl shadow-xl z-10">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-slate-950 fill-slate-950" />
                  <span className="text-[11px] font-tactical font-black text-slate-950 tracking-widest">FOR YOU</span>
                </div>
              </div>
            )}

            <div>
              <div className="flex gap-6 items-start mb-6">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-700/50 group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                  {opp.logo}
                </div>
                <div className="flex-1 pr-12">
                  <h3 className="text-xl font-tactical font-black text-white leading-tight mb-2 uppercase tracking-tighter">
                    {opp.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => window.open(opp.url, '_blank')}
              className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-tactical font-black text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group/btn mt-4 shadow-lg"
            >
              LEARN MORE
              <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
