import moment from 'moment'
import assert from 'assert'
import Calendar2, { Calendar3 } from './Calendar2'

describe('getAvailableSpot', function () {
  it('Should get 1 available spots of calendar 1 a', function () {
    const result = Calendar2.getAvailableSpots(1, '10-04-2023', 30)
    assert.ok(result)
    assert.equal(result.length, 1)
    assert.equal(
      result[0].startHour.valueOf(),
      moment.utc('2023-04-10T16:00:00.000Z').valueOf()
    )
    assert.equal(
      result[0].endHour.valueOf(),
      moment.utc('2023-04-10T16:50:00.000Z').valueOf()
    )
  })
})

describe('getAvailableSpot', function () {
  it('Should get 1 available spots of calendar 2 b', function () {
    const result = Calendar2.getAvailableSpots(2, '13-04-2023', 25)
    assert.ok(result)
    assert.equal(result.length, 1)
    assert.equal(
      result[0].startHour.valueOf(),
      moment.utc('2023-04-13T18:00:00.000Z').valueOf()
    )
    assert.equal(
      result[0].endHour.valueOf(),
      moment.utc('2023-04-13T18:25:00.000Z').valueOf()
    )
  })
})

describe('getAvailableSpot', function () {
  it('Should get no available spots of calendar 2', function () {
    const result = Calendar2.getAvailableSpots(2, '16-04-2023', 25)
    assert.ok(result)
    assert.equal(result.length, 0)
  })
})

describe('getAvailableSpot Calendar3', function () {
  it('Should calculate time diff in minutes correctly', () => {
    const calendarData = require('./calendars/calendar.1.json')
    const calendarEventDuration = { start: '16:00', end: '17:15' }
    const res = Calendar3.isValidEventDuration(calendarData, calendarEventDuration, 30, '10-04-2023')
    expect(res).toBe(true)
  })
})
