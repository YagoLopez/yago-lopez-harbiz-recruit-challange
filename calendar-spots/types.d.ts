export interface Duration {
  start: string;
  end: string;
}

type TimeData = { [key: string]: Duration[] }

export interface TCalendar {
  durationBefore: number;
  durationAfter: number;
  slots: TimeData;
  sessions: TimeData;
}
