import Calendar from './Calendar'
import { Event } from './types'
const calendarData1 = require('./calendars/calendar.1.json')
const calendarData2 = require('./calendars/calendar.2.json')
const calendarData3 = require('./calendars/calendar.3.json')

const calendar = new Calendar()

describe('isValidDuration()', () => {
  it('Should return that event duration is valid for user request duration (1)', () => {
    const calendarEventDuration = { start: '16:00', end: '17:15' }
    const res = calendar.isValidDuration(calendarData1, calendarEventDuration, 30, '10-04-2023')
    expect(res).toBe(true)
  })

  it('Should return that event duration is valid for user request duration (2)', () => {
    const calendarEventDuration = { start: '11:15', end: '13:15' }
    const res = calendar.isValidDuration(calendarData1, calendarEventDuration, 30, '10-04-2023')
    expect(res).toBe(true)
  })

  it('Should return that event duration is invalid for user request duration (3)', () => {
    const calendarEventDuration = { start: '10:00', end: '10:15' }
    const res = calendar.isValidDuration(calendarData1, calendarEventDuration, 30, '10-04-2023')
    expect(res).toBe(false)
  })
})

describe('getPossibleSlots()', () => {
  it('Calendar 1', () => {
    const slots = [
      { start: '10:00', end: '10:15' },
      { start: '11:15', end: '13:15' },
      { start: '16:00', end: '17:15' }
    ]
    const res = calendar.getPossibleSlots(calendarData1, slots, '10-04-2023', 30)
    const expected = [
      { start: '11:15', end: '13:15' },
      { start: '16:00', end: '17:15' }
    ]
    expect(res).toStrictEqual(expected)
  })

  it('Calendar 2', () => {
    const slots = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' },
      { start: '18:00', end: '18:25' }
    ]
    const res = calendar.getPossibleSlots(calendarData2, slots, '13-04-2023', 25)
    const expected = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' },
      { start: '18:00', end: '18:25' }
    ]
    expect(res).toStrictEqual(expected)
  })

  it('Calendar 3', () => {
    const slots: Event[] = []
    const res = calendar.getPossibleSlots(calendarData3, slots, '16-04-2023', 25)
    expect(res).toStrictEqual([])
  })
})

describe('getValidSlots()', () => {
  it('Should get valid slot for calendar 1', () => {
    const possibleSlots = [
      { start: '11:15', end: '13:15' },
      { start: '16:00', end: '17:15' }
    ]
    const sessions = [
      { start: '11:15', end: '13:15' }
    ]
    const res = calendar.getValidSlot(possibleSlots, sessions)
    expect(res).toStrictEqual(possibleSlots[1])
  })

  it('Should get valid slot for calendar 2', () => {
    const possibleSlots = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' },
      { start: '18:00', end: '18:25' }
    ]
    const sessions = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' }
    ]
    const res = calendar.getValidSlot(possibleSlots, sessions)
    expect(res).toStrictEqual(possibleSlots[2])
  })

  it('Should return valid slot', () => {
    const slot = { start: '18:00', end: '18:25' }
    const sessions = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' }
    ]
    const res = calendar.isValidSlot(slot, sessions)
    expect(res).toBe(true)
  })

  it('Should return invalid slot', () => {
    const slot = { start: '12:00', end: '12:45' }
    const sessions = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' }
    ]
    const res = calendar.isValidSlot(slot, sessions)
    expect(res).toBe(false)
  })
})

describe('loadCalendar', () => {
  it('Should load calendar if it exists', () => {
    const calendar3 = {
      durationBefore: 15,
      durationAfter: 0,
      slots: {
        '10-04-2023': [
          { start: '10:00', end: '10:15' },
          { start: '11:15', end: '11:25' },
          { start: '22:00', end: '22:45' }
        ],
        '16-04-2023': []
      },
      sessions: []
    }

    calendar.loadCalendar(3)
    expect(calendar.calendarData).toStrictEqual(calendar3)
  })

  it('Should not throw if calendar does not exists', () => {
    calendar.loadCalendar(4)
    expect(calendar).toBeDefined()
  })
})
