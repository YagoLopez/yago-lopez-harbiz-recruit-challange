import Calendar2 from './Calendar2'
import { Duration } from './types'
const calendarData1 = require('./calendars/calendar.1.json')
const calendarData2 = require('./calendars/calendar.2.json')
const calendarData3 = require('./calendars/calendar.3.json')

const calendar2 = new Calendar2()

describe('isValidEventDuration()', () => {
  it('Should return that event duration is valid for user request duration (1)', () => {
    const calendarEventDuration = { start: '16:00', end: '17:15' }
    const res = calendar2.isValidEventDuration(calendarData1, calendarEventDuration, 30, '10-04-2023')
    expect(res).toBe(true)
  })

  it('Should return that event duration is valid for user request duration (2)', () => {
    const calendarEventDuration = { start: '11:15', end: '13:15' }
    const res = calendar2.isValidEventDuration(calendarData1, calendarEventDuration, 30, '10-04-2023')
    expect(res).toBe(true)
  })

  it('Should return that event duration is invalid for user request duration', () => {
    const calendarEventDuration = { start: '10:00', end: '10:15' }
    const res = calendar2.isValidEventDuration(calendarData1, calendarEventDuration, 30, '10-04-2023')
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
    const res = calendar2.getPossibleSlots(calendarData1, slots, '10-04-2023', 30)
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
    const res = calendar2.getPossibleSlots(calendarData2, slots, '13-04-2023', 25)
    const expected = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' },
      { start: '18:00', end: '18:25' }
    ]
    expect(res).toStrictEqual(expected)
  })

  it('Calendar 3', () => {
    const slots: Duration[] = []
    const res = calendar2.getPossibleSlots(calendarData3, slots, '16-04-2023', 25)
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
    const res = calendar2.getValidSlot(calendarData1, possibleSlots, sessions)
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
    const res = calendar2.getValidSlot(calendarData2, possibleSlots, sessions)
    expect(res).toStrictEqual(possibleSlots[2])
  })

  it('Should return valid slot', () => {
    const slot = { start: '18:00', end: '18:25' }
    const sessions = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' }
    ]
    const res = calendar2.isValidSlot(slot, sessions)
    expect(res).toBe(true)
  })

  it('Should return invalid slot', () => {
    const slot = { start: '12:00', end: '12:45' }
    const sessions = [
      { start: '12:00', end: '12:45' },
      { start: '16:15', end: '17:45' }
    ]
    const res = calendar2.isValidSlot(slot, sessions)
    expect(res).toBe(false)
  })

  // todo: remove comments
  // it('Should get end hour for valid slot (1)', () => {
  //   const dateISO = '2023-04-10'
  //   const res = calendar2.getEndHourValidSlot(dateISO, '16:00', 30)
  //   console.log('res', res)
  // })

  // it.skip('Should get end hour for valid slot (2)', () => {
  //   const dateISO = '2023-04-10T16:00:00.000Z'
  //   const res = calendar2.getEndHourValidSlot(dateISO, 75)
  //   console.log('res', JSON.stringify(res))
  //   expect((res)).toStrictEqual('2023-04-10T17:15:00.000Z')
  // })
})
