
export interface LeagueTableEntry {
  teamName: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  opponentGoals: number;
  goalDifference: number;
  points: number;
  iconUrl: string;
}

export interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchday: number;
  status: 'beendet' | 'läuft' | 'geplant';
  goals: Goal[];
}

export interface Goal {
  minute: number;
  player: string;
  team: string;
}

export interface MatchdayData {
  matchday: number;
  matches: Match[];
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
