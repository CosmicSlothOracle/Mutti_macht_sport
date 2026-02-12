
import React from 'react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
}

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const isHomeWinner = match.homeScore > match.awayScore;
  const isAwayWinner = match.awayScore > match.homeScore;
  const isDraw = match.homeScore === match.awayScore && match.status === 'beendet';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {formatDate(match.date)}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
          match.status === 'beendet' ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-700'
        }`}>
          {match.status}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <h3 className={`font-bold text-lg ${isHomeWinner ? 'text-slate-900' : 'text-slate-500'}`}>
              {match.homeTeam}
            </h3>
          </div>
          
          <div className={`flex items-center gap-3 ${isDraw ? 'bg-amber-600' : 'bg-slate-900'} text-white px-4 py-2 rounded-lg font-mono text-2xl font-bold min-w-[100px] justify-center shadow-inner`}>
            <span>{match.homeScore}</span>
            <span className="text-slate-400">:</span>
            <span>{match.awayScore}</span>
          </div>
          
          <div className="flex-1 text-left">
            <h3 className={`font-bold text-lg ${isAwayWinner ? 'text-slate-900' : 'text-slate-500'}`}>
              {match.awayTeam}
            </h3>
          </div>
        </div>

        {match.goals && match.goals.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-widest text-center">Torschützen</p>
            <div className="grid grid-cols-2 gap-x-8 text-xs">
              <div className="space-y-1">
                {match.goals.filter(g => g.team === match.homeTeam).map((g, i) => (
                  <div key={i} className="flex items-center justify-end text-right text-slate-600">
                    <span className="mr-2">{g.player}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{g.minute}'</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {match.goals.filter(g => g.team === match.awayTeam).map((g, i) => (
                  <div key={i} className="flex items-center text-slate-600">
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded mr-2">{g.minute}'</span>
                    <span>{g.player}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
