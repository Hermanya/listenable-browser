jest.unmock('../say_something.js')
const say = require('../say_something.js')
const sayUtil = require('say')
describe('how to say', () => {
  it('says something', () => {
      let result = say('something')
      expect(result.then).toBeTruthy()
      expect(sayUtil.speak).toBeCalled()
  });
  it('stops speaking', () => {
      say.no_more()
      expect(sayUtil.stop).toBeCalled()
  })
})
