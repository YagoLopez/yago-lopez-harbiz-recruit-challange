import { prueba, prueba2, Test2 } from './prueba'

it('aaaa', () => {
  expect(prueba).toBe('prueba')
})

it('ccc', () => {
  expect(prueba2()).toBe('prueba2')
})

it('bbbb', () => {
  const test2 = new Test2()
  expect(test2.method1()).toBe('method1')
})
