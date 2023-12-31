import moment from 'moment'
import { TCalendar, Event } from './types'

/**
 * @Note: calendar data can not be empty (Typescript strict flag enabled)
 * Load calendar 1 by default
 */
export default class Calendar {
  calendarData: TCalendar = require('./calendars/calendar.1.json')

  loadCalendar (calendarId: number) {
    const calendarPath = `./calendars/calendar.${calendarId}.json`
    try {
      this.calendarData = require(calendarPath)
    } catch (error) {
      console.log(`⚠️ Error loading calendar: ${calendarPath}`)
    }
  }

  getEvents (type: 'slots' | 'sessions', date: string): Event[] {
    const events = this.calendarData[type][date]
    if (!events) return []
    return events
  }

  getTotalDuration (duration: number): number {
    const { durationBefore, durationAfter } = this.calendarData
    return durationBefore + durationAfter + duration
  }

  isValidDuration (event: Event, duration: number, date: string):boolean {
    const totalDuration = this.getTotalDuration(duration)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { start, end } = event
    const startHour = moment(`${dateISO}T${start}`)
    const endHour = moment(`${dateISO}T${end}`)
    const slotDuration = endHour.diff(startHour, 'minutes')
    return slotDuration >= totalDuration
  }

  getPossibleSlots (slots: Event[], date: string, duration: number): Event[] {
    const possibleSlots: Event[] = []
    slots.forEach((slot: Event) => {
      if (this.isValidDuration(slot, duration, date)) {
        possibleSlots.push(slot)
      }
    })
    return possibleSlots
  }

  happensIn (event: Event, hour: string): boolean {
    const moment1 = moment(hour, 'HH:mm')
    const eventStart = moment(event.start, 'HH:mm')
    const eventEnd = moment(event.end, 'HH:mm')
    return (moment1.isSameOrAfter(eventStart) && moment1.isSameOrBefore(eventEnd))
  }

  isValidSlot (slot: Event, sessions: Event[]): boolean {
    let result = true
    for (const session of sessions) {
      if (this.happensIn(session, slot.start) || this.happensIn(session, slot.end)) {
        result = false
      }
    }
    return result
  }

  getValidSlot (possibleSlots: Event[], sessions: Event[]): Event | undefined {
    for (const slot of possibleSlots) {
      if (this.isValidSlot(slot, sessions)) { return slot }
    }
  }

  getStartHour (date: string, eventStart: string | undefined): Date {
    return moment.utc(`${date} ${eventStart}`).toDate()
  }

  getEndHour (date: string, eventStart: string | undefined, duration: number): Date {
    const startHour = moment.utc(`${date} ${eventStart}`)
    return moment(startHour).add(duration, 'minutes').toDate()
  }

  getAvailableSpots (calendarId: number, date: string, duration: number) {
    this.loadCalendar(calendarId)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const slots = this.getEvents('slots', date)
    if (slots.length === 0) return []

    const sessions = this.getEvents('sessions', date)
    const possibleSlots = this.getPossibleSlots(slots, date, duration)
    const validSlot = this.getValidSlot(possibleSlots, sessions)
    const totalDuration = this.getTotalDuration(duration)

    return [{
      startHour: this.getStartHour(dateISO, validSlot?.start),
      endHour: this.getEndHour(dateISO, validSlot?.start, totalDuration)
    }]
  }
}
