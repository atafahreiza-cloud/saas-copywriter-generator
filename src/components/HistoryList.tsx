import React from 'react';
import { GeneratedDescription } from '../types';
import { Clock, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface HistoryListProps {
  history: GeneratedDescription[];
  onSelect: (item: GeneratedDescription) => void;
  onClear: () => void;
  activeItem: GeneratedDescription | null;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onClear,
  activeItem,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Riwayat Generasi ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
          title="Hapus riwayat"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {history.map((item, index) => {
          const isSelected = activeItem?.generatedAt === item.generatedAt;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-medium'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{item.productName}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-medium text-indigo-600">{item.marketplace}</span>
                  <span>·</span>
                  <span>{item.tone}</span>
                </div>
              </div>
              <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
