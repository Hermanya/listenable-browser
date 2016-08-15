jest.unmock('../say_something.js')
const say = require('../say_something.js')
const sayUtil = require('say')
sayUtil.speak = jest.fn((_, _1, _2, callback) => callback())
describe('how to say', () => {
  it('says something', () => {
      return say('something').then(() => expect(sayUtil.speak).toBeCalled())
  })
  it('does not say nothing', () => {
      sayUtil.speak.mockClear()
      return say('').then(() => {
          expect(sayUtil.speak).not.toBeCalled()
      })
  })
  it('stops speaking', () => {
      say.no_more()
      expect(sayUtil.stop).toBeCalled()
  })
})
