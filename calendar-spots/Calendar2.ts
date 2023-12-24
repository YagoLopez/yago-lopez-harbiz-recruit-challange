import moment from 'moment'
import { TCalendar, Duration } from './types'

export default class Calendar2 {
  calendarData: TCalendar

  constructor () {
    // Calendar Data can not be emply. Load calendar 1 by default
    this.calendarData = this.loadCalendar(1)
  }

  loadCalendar (calendarId: number): TCalendar {
    return require(`./calendars/calendar.${calendarId}.json`)
  }

  getSlots (date: string): Duration[] {
    const slots = this.calendarData.slots[date]
    if (!slots) return []
    return slots
  }

  getSessions (date: string): Duration[] {
    const sessions = this.calendarData.sessions[date]
    if (!sessions) return []
    return sessions
  }

  getTotalDurationUserRequest (calendarData: TCalendar, userRequestDuration: number): number {
    const { durationBefore, durationAfter } = calendarData
    return durationBefore + durationAfter + userRequestDuration
  }

  isValidEventDuration (calendarData: TCalendar, eventDuration: Duration, userRequestedDuration: number, userRequestDate: string) {
    const totalUserDuration = this.getTotalDurationUserRequest(calendarData, userRequestedDuration)
    const dateISO = moment(userRequestDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { start, end } = eventDuration
    const startHour = moment(`${dateISO}T${start}`)
    const endHour = moment(`${dateISO}T${end}`)
    const slotDuration = endHour.diff(startHour, 'minutes')
    return slotDuration >= totalUserDuration
  }

  getPossibleSlots (calendarData: TCalendar, slots: Duration[], date: string, duration: number): Duration[] {
    const possibleSlots: Duration[] = []
    slots.forEach((slot: Duration) => {
      if (this.isValidEventDuration(calendarData, slot, duration, date)) {
        possibleSlots.push(slot)
      }
    })
    return possibleSlots
  }

  isValidSlot (slot: Duration, sessions: Duration[]): boolean {
    let result = true
    for (const session of sessions) {
      if (slot.start === session.start && slot.end === session.end) {
        result = false
      }
    }
    return result
  }

  getValidSlot (possibleSlots: Duration[], sessions: Duration[]): Duration | undefined {
    const result = undefined
    for (const slot of possibleSlots) {
      const isValid = this.isValidSlot(slot, sessions)
      if (isValid) {
        return slot
      }
    }
    return result
  }

  getStartHourValidSlot (dateISO: string, slotStart: string | undefined) {
    return moment.utc(`${dateISO} ${slotStart}`).toDate()
  }

  getEndHourValidSlot (dateISO: string, slotStart: string | undefined, duration: number) {
    const startHour = moment.utc(`${dateISO} ${slotStart}`)
    return moment(startHour).add(duration, 'minutes').toDate()
  }

  getAvailableSpots (calendarId: number, date: string, duration: number) {
    this.calendarData = this.loadCalendar(calendarId)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { durationBefore, durationAfter } = this.calendarData
    const slots = this.getSlots(date)
    if (slots.length === 0) return []

    const sessions = this.getSessions(date)
    const possibleSlots = this.getPossibleSlots(this.calendarData, slots, date, duration)
    const validSlot = this.getValidSlot(possibleSlots, sessions)
    const totalDuration = durationBefore + durationAfter + duration

    const objSlot = {
      startHour: this.getStartHourValidSlot(dateISO, validSlot?.start),
      endHour: this.getEndHourValidSlot(dateISO, validSlot?.start, totalDuration)
    }

    return [objSlot]
  }
}
