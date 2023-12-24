import moment from 'moment'
import { TCalendar, Duration } from './types'

export default class Calendar2 {
  static loadCalendarData (calendarId: number): TCalendar {
    return require(`./calendars/calendar.${calendarId}.json`)
  }

  static getSlots (calendarData: TCalendar, date: string): Duration[] {
    const slots = calendarData.slots[date]
    if (!slots) return []
    return slots
  }

  static getSessions (calendarData: TCalendar, date: string): Duration[] {
    const sessions = calendarData.sessions[date]
    if (!sessions) return []
    return sessions
  }

  static getTotalDurationUserRequest (calendarData: TCalendar, userRequestDuration: number): number {
    const { durationBefore, durationAfter } = calendarData
    return durationBefore + durationAfter + userRequestDuration
  }

  static isValidEventDuration (calendarData: TCalendar, eventDuration: Duration, userRequestedDuration: number, userRequestDate: string) {
    const totalUserDuration = Calendar2.getTotalDurationUserRequest(calendarData, userRequestedDuration)
    const dateISO = moment(userRequestDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { start, end } = eventDuration
    const startHour = moment(`${dateISO}T${start}`)
    const endHour = moment(`${dateISO}T${end}`)
    const slotDuration = endHour.diff(startHour, 'minutes')
    return slotDuration >= totalUserDuration
  }

  static getPossibleSlots (calendarData: TCalendar, slots: Duration[], date: string, duration: number): Duration[] {
    const possibleSlots: Duration[] = []
    slots.forEach((slot: Duration) => {
      if (Calendar2.isValidEventDuration(calendarData, slot, duration, date)) {
        possibleSlots.push(slot)
      }
    })
    return possibleSlots
  }

  static isValidSlot (slot: Duration, sessions: Duration[]): boolean {
    let result = true
    for (const session of sessions) {
      if (slot.start === session.start && slot.end === session.end) {
        result = false
      }
    }
    return result
  }

  static getValidSlot (calendarData: TCalendar, possibleSlots: Duration[], sessions: Duration[]): Duration | undefined {
    const result = undefined
    for (const slot of possibleSlots) {
      const isValid = this.isValidSlot(slot, sessions)
      if (isValid) {
        return slot
      }
    }
    return result
  }

  static getEndHourValidSlot (dateISO: string, slotStart: string | undefined, duration: number) {
    const startHour = moment.utc(`${dateISO} ${slotStart}`)
    return moment(startHour).add(duration, 'minutes').toDate()
  }

  static getStartHourValidSlot (dateISO: string, slotStart: string | undefined) {
    return moment.utc(`${dateISO} ${slotStart}`).toDate()
  }

  static getAvailableSpots (calendarId: number, date: string, duration: number) {
    const calendarData = this.loadCalendarData(calendarId)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { durationBefore, durationAfter } = calendarData
    const slots = Calendar2.getSlots(calendarData, date)
    if (slots.length === 0) return []

    const sessions = Calendar2.getSessions(calendarData, date)
    const possibleSlots = Calendar2.getPossibleSlots(calendarData, slots, date, duration)
    const validSlot = this.getValidSlot(calendarData, possibleSlots, sessions)
    const totalDuration = durationBefore + durationAfter + duration

    const objSlot = {
      startHour: this.getStartHourValidSlot(dateISO, validSlot?.start),
      endHour: this.getEndHourValidSlot(dateISO, validSlot?.start, totalDuration)
    }

    return [objSlot]
  }
}
