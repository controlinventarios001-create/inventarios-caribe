
import React, { useMemo } from 'react';
import AppIcon from './AppIcon';
import { Location } from '../types';
import { ACTIVITY_MAP } from '../constants';

interface AuxiliarMonitorProps {
  locations: Location[];
}

const AuxiliarMonitor: React.FC<AuxiliarMonitorProps> = ({ locations }) => {
  const auxiliariesData = useMemo(() => {
    const map: Record<string, { 
      name: string; 
      sedes: string[]; 
      totalActivities: number; 
      completedActivities: number;
      activityStats: Record<string, number>;
    }> = {};

    locations.forEach(loc => {
      const aux = loc.auxiliar || 'SIN ASIGNAR';
      if (!map[aux]) {
        map[aux] = { 
          name: aux, 
          sedes: [], 
          totalActivities: 0, 
          completedActivities: 0,
          activityStats: {} 
        };
        ACTIVITY_MAP.forEach(a => map[aux].activityStats[a.key] = 0);
      }

      map[aux].sedes.push(loc.name);
      ACTIVITY_MAP.forEach(a => {
        map[aux].totalActivities++;
        if (loc.activities[a.key]) {
          map[aux].completedActivities++;
          map[aux].activityStats[a.key]++;
        }
      });
    });

    return Object.values(map).sort((a, b) => 
      (b.completedActivities / b.totalActivities) - (a.completedActivities / a.totalActivities)
    );
  }, [locations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {auxiliariesData.map((aux, idx) => {
        const progress = Math.round((aux.completedActivities / aux.totalActivities) * 100) || 0;
        
        return (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
            <div className="bg-slate-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <AppIcon name="User" size={24} />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest leading-none">{aux.name}</h3>
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                    {aux.sedes.length} {aux.sedes.length === 1 ? 'Sede asignada' : 'Sedes asignadas'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${progress === 100 ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {progress}%
                </span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">EFECTIVIDAD</p>
              </div>
            </div>

            <div className="p-6 flex-1">
              <div className="mb-6">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                  <span>Avance General</span>
                  <span>{aux.completedActivities} / {aux.totalActivities} Tareas</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Mini Matriz de Auxiliar */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 text-center tracking-[0.2em]">Desempeño por Actividad</h4>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {ACTIVITY_MAP.map(a => {
                    const count = aux.activityStats[a.key];
                    const total = aux.sedes.length;
                    const actProgress = (count / total) * 100;
                    
                    return (
                      <div key={a.key} className="flex flex-col items-center gap-2" title={`${a.label}: ${count}/${total}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                          actProgress === 100 ? 'bg-emerald-500 text-white' : 
                          actProgress > 0 ? 'bg-blue-100 text-blue-600 border border-blue-200' : 
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {count}
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase">{a.short}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                 <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em] flex items-center gap-2">
                    <AppIcon name="MapPin" size={12} className="text-blue-500" />
                    Sedes a Cargo
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {aux.sedes.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 uppercase shadow-sm">
                        {s}
                      </span>
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    {progress === 100 ? 'Completado' : 'En proceso'}
                  </span>
               </div>
               <button className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors tracking-widest flex items-center gap-1">
                  Ver Detalles <AppIcon name="ChevronRight" size={12} />
               </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuxiliarMonitor;
