import React, { useState, useEffect } from 'react';
import { fetchLeagueTable } from '../apiService';
import { LeagueTableEntry, LoadingStatus } from '../types';

const TableSection: React.FC = () => {
  const [table, setTable] = useState<LeagueTableEntry[]>([]);
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);

  useEffect(() => {
    const loadTable = async () => {
      setStatus(LoadingStatus.LOADING);
      try {
        const result = await fetchLeagueTable();
        setTable(result);
        setStatus(LoadingStatus.SUCCESS);
      } catch (error) {
        console.error("Error loading league table:", error);
        setStatus(LoadingStatus.ERROR);
      }
    };
    loadTable();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Bundesliga Tabelle</h2>

      {status === LoadingStatus.LOADING && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Lade Tabelle...</p>
        </div>
      )}

      {status === LoadingStatus.ERROR && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-xl mx-auto text-red-700">
          <p className="font-bold">Fehler beim Laden der Tabelle.</p>
          <p className="text-sm">Bitte versuchen Sie es später erneut.</p>
        </div>
      )}

      {status === LoadingStatus.SUCCESS && table.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Spiele</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">G</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">U</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">V</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Tore</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">GTore</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Diff</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Punkte</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {table.map((entry, index) => (
                <tr key={entry.teamName} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div className="flex items-center">
                      {entry.iconUrl && <img src={entry.iconUrl} alt={entry.teamName} className="h-6 w-6 mr-3" />}
                      {entry.teamName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.matches}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.draws}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.losses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.goals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.opponentGoals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{entry.goalDifference}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableSection;
