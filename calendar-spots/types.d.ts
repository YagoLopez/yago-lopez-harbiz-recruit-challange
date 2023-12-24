export interface Event {
  start: string;
  end: string;
}

type EventList = { [key: string]: Event[] }

export interface TCalendar {
  durationBefore: number;
  durationAfter: number;
  slots: EventList;
  sessions: EventList;
}
