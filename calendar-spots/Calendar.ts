import moment from 'moment'
import { TCalendar, Event } from './types'

/**
 * @Notes: calendar data can not be empty (Typescript strict flag enabled)
 * Load calendar 1 by default
 */
export default class Calendar {
  calendarData: TCalendar

  constructor () {
    this.calendarData = require('./calendars/calendar.1.json')
  }

  loadCalendar (calendarId: number) {
    const calendarPath = `./calendars/calendar.${calendarId}.json`
    try {
      this.calendarData = require(calendarPath)
    } catch (error) {
      console.log(`⛔ Error loading calendar: ${calendarPath}`)
    }
  }

  getSlots (date: string): Event[] {
    const slots = this.calendarData.slots[date]
    if (!slots) return []
    return slots
  }

  getSessions (date: string): Event[] {
    const sessions = this.calendarData.sessions[date]
    if (!sessions) return []
    return sessions
  }

  getTotalDuration (calendar: TCalendar, duration: number): number {
    const { durationBefore, durationAfter } = calendar
    return durationBefore + durationAfter + duration
  }

  isValidDuration (calendar: TCalendar, eventDuration: Event, userRequestedDuration: number, userRequestDate: string):boolean {
    const totalUserDuration = this.getTotalDuration(calendar, userRequestedDuration)
    const dateISO = moment(userRequestDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { start, end } = eventDuration
    const startHour = moment(`${dateISO}T${start}`)
    const endHour = moment(`${dateISO}T${end}`)
    const slotDuration = endHour.diff(startHour, 'minutes')
    return slotDuration >= totalUserDuration
  }

  getPossibleSlots (calendar: TCalendar, slots: Event[], date: string, duration: number): Event[] {
    const possibleSlots: Event[] = []
    slots.forEach((slot: Event) => {
      if (this.isValidDuration(calendar, slot, duration, date)) {
        possibleSlots.push(slot)
      }
    })
    return possibleSlots
  }

  isValidSlot (slot: Event, sessions: Event[]): boolean {
    let result = true
    for (const session of sessions) {
      if (slot.start === session.start && slot.end === session.end) {
        result = false
      }
    }
    return result
  }

  getValidSlot (possibleSlots: Event[], sessions: Event[]): Event | undefined {
    const result = undefined
    for (const slot of possibleSlots) {
      const isValid = this.isValidSlot(slot, sessions)
      if (isValid) {
        return slot
      }
    }
    return result
  }

  getStartHour (date: string, slotStart: string | undefined): Date {
    return moment.utc(`${date} ${slotStart}`).toDate()
  }

  getEndHour (date: string, slotStart: string | undefined, duration: number): Date {
    const startHour = moment.utc(`${date} ${slotStart}`)
    return moment(startHour).add(duration, 'minutes').toDate()
  }

  getAvailableSpots (calendarId: number, date: string, duration: number) {
    this.loadCalendar(calendarId)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const slots = this.getSlots(date)
    if (slots.length === 0) return []

    const sessions = this.getSessions(date)
    const possibleSlots = this.getPossibleSlots(this.calendarData, slots, date, duration)
    const validSlot = this.getValidSlot(possibleSlots, sessions)
    const totalDuration = this.getTotalDuration(this.calendarData, duration)

    const objSlot = {
      startHour: this.getStartHour(dateISO, validSlot?.start),
      endHour: this.getEndHour(dateISO, validSlot?.start, totalDuration)
    }

    return [objSlot]
  }
}
