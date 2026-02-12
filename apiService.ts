import { MatchdayData, Match, Goal } from './types';

const OPENLIGADB_BASE = 'https://api.openligadb.de';

interface OpenLigaMatch {
  matchID: number;
  matchDateTime: string;
  team1: { teamName: string };
  team2: { teamName: string };
  matchIsFinished: boolean;
  matchResults?: Array<{
    resultTypeID: number;
    pointsTeam1: number;
    pointsTeam2: number;
  }>;
  goals?: Array<{
    matchMinute: number;
    goalGetterName: string;
    scoreTeam1: number;
    scoreTeam2: number;
  }>;
  group: { groupOrderID: number };
}

function mapOpenLigaToMatch(raw: OpenLigaMatch): Match {
  const finalResult = raw.matchResults?.find(r => r.resultTypeID === 2);
  const homeScore = finalResult?.pointsTeam1 ?? 0;
  const awayScore = finalResult?.pointsTeam2 ?? 0;

  const goals: Goal[] = [];
  if (raw.goals?.length) {
    const sorted = [...raw.goals].sort((a, b) => a.matchMinute - b.matchMinute);
    let prevScore1 = 0;
    let prevScore2 = 0;
    for (const g of sorted) {
      const team = g.scoreTeam1 > prevScore1 ? raw.team1.teamName : raw.team2.teamName;
      goals.push({ minute: g.matchMinute, player: g.goalGetterName, team });
      prevScore1 = g.scoreTeam1;
      prevScore2 = g.scoreTeam2;
    }
  }

  let status: 'beendet' | 'läuft' | 'geplant' = 'beendet';
  if (!raw.matchIsFinished) {
    status = new Date(raw.matchDateTime) > new Date() ? 'geplant' : 'läuft';
  }

  return {
    id: String(raw.matchID),
    date: raw.matchDateTime,
    homeTeam: raw.team1.teamName,
    awayTeam: raw.team2.teamName,
    homeScore,
    awayScore,
    matchday: raw.group.groupOrderID,
    status,
    goals,
  };
}

export const fetchBundesligaResults = async (): Promise<MatchdayData[]> => {
  const groupsRes = await fetch(`${OPENLIGADB_BASE}/getavailablegroups/bl1/2024`);
  if (!groupsRes.ok) throw new Error('Konnte Spieltage nicht laden.');
  const groups: { groupOrderID: number }[] = await groupsRes.json();

  const results: MatchdayData[] = [];

  for (const group of groups) {
    const matchesRes = await fetch(
      `${OPENLIGADB_BASE}/getmatchdata/bl1/2024/${group.groupOrderID}`
    );
    if (!matchesRes.ok) continue;

    const rawMatches: OpenLigaMatch[] = await matchesRes.json();
    const matches = rawMatches.map(mapOpenLigaToMatch);

    if (matches.length > 0) {
      results.push({ matchday: group.groupOrderID, matches });
    }
  }

  return results.sort((a, b) => a.matchday - b.matchday);
};
