// todo: function to get calendar data

import moment from 'moment'
import { TCalendar, Duration } from './types'
// import * as data from './calendars/calendar.1.json'

/*
export default class Calendar2 {

  static getAvailableSpots (calendar: number, date: string, duration: number) {
    const data = require(`./calendars/calendar.${calendar}.json`)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const durationBefore = data.durationBefore
    const durationAfter = data.durationAfter

    const daySlots = data.slots[date]

    if (!daySlots) return []

    const realSpots: any[] = []
    daySlots.forEach((daySlot: any) => {
      if (data.sessions && data.sessions[date]) {
        let noConflicts = true
        data.sessions[date].forEach((sessionSlot: any) => {
          const sessionStart = moment(dateISO + ' ' + sessionSlot.start).valueOf()
          const sessionEnd = moment(dateISO + ' ' + sessionSlot.end).valueOf()
          const start = moment(dateISO + ' ' + daySlot.start).valueOf()
          const end = moment(dateISO + ' ' + daySlot.end).valueOf()
          if (sessionStart > start && sessionEnd < end) {
            realSpots.push({ start: daySlot.start, end: sessionSlot.start })
            realSpots.push({ start: sessionSlot.end, end: daySlot.end })
            noConflicts = false
          } else if (sessionStart === start && sessionEnd < end) {
            realSpots.push({ start: sessionSlot.end, end: daySlot.end })
            noConflicts = false
          } else if (sessionStart > start && sessionEnd === end) {
            realSpots.push({ start: daySlot.start, end: sessionSlot.start })
            noConflicts = false
          } else if (sessionStart === start && sessionEnd === end) {
            noConflicts = false
          }
        })
        if (noConflicts) {
          realSpots.push(daySlot)
        }
      } else {
        realSpots.push(daySlot)
      }
    })

    const arrSlot: any[] = []
    realSpots.forEach(function (slot) {
      let init = 0
      let startHour
      let endHour
      let clientStartHour
      let clientEndHour

      function getMomentHour (hour: any) {
        const finalHourForAdd = moment(dateISO + ' ' + hour)
        return finalHourForAdd
      }

      function addMinutes (hour: any, minutes: any) {
        const result = moment(hour)
          .add(minutes, 'minutes')
          .format('HH:mm')
        return result
      }

      function getOneMiniSlot (startSlot: any, endSlot: any) {
        const startHourFirst = getMomentHour(startSlot)

        startHour = startHourFirst.format('HH:mm')
        endHour = addMinutes(
          startHourFirst,
          durationBefore + duration + durationAfter
        )
        clientStartHour = addMinutes(startHourFirst, durationBefore)
        clientEndHour = addMinutes(startHourFirst, duration)

        if (
          moment.utc(endHour, 'HH:mm').valueOf() >
          moment.utc(endSlot, 'HH:mm').valueOf()
        ) {
          return null
        }
        const objSlot = {
          startHour: moment.utc(dateISO + ' ' + startHour).toDate(),
          endHour: moment.utc(dateISO + ' ' + endHour).toDate(),
          clientStartHour: moment.utc(dateISO + ' ' + clientStartHour).toDate(),
          clientEndHour: moment.utc(dateISO + ' ' + clientEndHour).toDate()
        }
        init += 1
        return objSlot
      }

      let start = slot.start
      let resultSlot
      do {
        resultSlot = getOneMiniSlot(start, slot.end)
        if (resultSlot) {
          arrSlot.push(resultSlot)
          start = moment.utc(resultSlot.endHour).format('HH:mm')
        }
      } while (resultSlot)

      return arrSlot
    })
    console.log('arrSlot', arrSlot)
    return arrSlot

  }
}
*/

export default class Calendar2 {
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

  static getAvailableSpots (calendar: number, date: string, duration: number) {
    const calendarData = require(`./calendars/calendar.${calendar}.json`)
    const dateISO = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    const { durationBefore, durationAfter } = calendarData

    const slots = Calendar2.getSlots(calendarData, date)

    if (slots.length === 0) return []

    const sessions = Calendar2.getSessions(calendarData, date)

    const possibleSlots = Calendar2.getPossibleSlots(calendarData, slots, date, duration)

    const validSlot = this.getValidSlot(calendarData, possibleSlots, sessions)

    const totalDuration = durationBefore + durationAfter + duration

    // todo: use string interp
    const objSlot = {
      startHour: moment.utc(dateISO + ' ' + validSlot?.start).toDate(),
      endHour: (this.getEndHourValidSlot(dateISO, validSlot?.start, totalDuration))
      // clientStartHour: moment.utc(dateISO + ' ' + clientStartHour).toDate(),
      // clientEndHour: moment.utc(dateISO + ' ' + clientEndHour).toDate()
    }
    console.log('objSlot', objSlot)

    return [objSlot]
  }
}
