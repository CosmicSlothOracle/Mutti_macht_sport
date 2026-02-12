import React, { useState, useEffect } from 'react';
import { MatchdayData } from '../types';

interface StatisticsSectionProps {
  allMatchData: MatchdayData[];
}

interface TopScorer {
  player: string;
  team: string;
  goals: number;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ allMatchData }) => {
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);

  useEffect(() => {
    if (allMatchData.length === 0) return;

    const playerGoals: { [key: string]: { team: string; goals: number } } = {};

    allMatchData.forEach(matchday => {
      matchday.matches.forEach(match => {
        match.goals.forEach(goal => {
          const key = `${goal.player}-${goal.team}`;
          if (playerGoals[key]) {
            playerGoals[key].goals += 1;
          } else {
            playerGoals[key] = { team: goal.team, goals: 1 };
          }
        });
      });
    });

    const sortedScorers = Object.entries(playerGoals)
      .map(([playerTeam, data]) => {
        const [player, team] = playerTeam.split('-');
        return { player, team, goals: data.goals };
      })
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10); // Top 10 scorers

    setTopScorers(sortedScorers);
  }, [allMatchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Top Torschützen</h2>

      {topScorers.length === 0 && (
        <div className="py-16 text-center text-slate-500">
          <p>Noch keine Torschützen-Daten verfügbar.</p>
        </div>
      )}

      {topScorers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Spieler</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Tore</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {topScorers.map((scorer, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{scorer.player}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{scorer.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-900">{scorer.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatisticsSection;
