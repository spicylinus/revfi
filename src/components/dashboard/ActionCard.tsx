'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { ActionTask } from '@/types/audit';

interface ActionCardProps {
  timeframe: 'Today' | 'This Week' | 'This Month';
  tasks: ActionTask[];
}

export default function ActionCard({ timeframe, tasks }: ActionCardProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});

  const toggleTask = (idx: number) => {
    setCompletedTasks(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-primary px-6 py-3 flex items-center gap-2">
        <Calendar size={18} className="text-secondary" />
        <h3 className="text-white font-bold uppercase tracking-widest text-xs">{timeframe}</h3>
      </div>
      
      <div className="p-6 flex-1 flex flex-col gap-4">
        {tasks.map((task, idx) => (
          <button 
            key={idx} 
            onClick={() => toggleTask(idx)}
            className="flex gap-3 text-left group"
          >
            <div className={`mt-1 flex-shrink-0 transition-colors ${completedTasks[idx] ? 'text-accent' : 'text-slate-300 group-hover:text-slate-400'}`}>
              {completedTasks[idx] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </div>
            <div>
              <p className={`text-sm font-bold leading-tight mb-1 transition-all ${completedTasks[idx] ? 'text-text-secondary line-through opacity-60' : 'text-text-primary'}`}>
                {task.task}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase">
                <span>{task.time}</span>
                <span className="text-slate-300">•</span>
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${i < task.difficulty ? 'bg-secondary' : 'bg-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
        {tasks.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-4">No tasks scheduled.</p>
        )}
      </div>
    </div>
  );
}
