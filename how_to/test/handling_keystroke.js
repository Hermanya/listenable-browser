const globalShortcut = {unregisterAll: jest.fn()}
jest.setMock('electron', {globalShortcut})

const player = {play: jest.fn((_, callback) => callback && callback())}
jest.setMock('play-sound', () => player)

jest.unmock('../handle_keystroke.js')
const handle_keystroke = require('../handle_keystroke.js')
const handle_user_input = require('../handle_user_input.js')
const say = require('../say_something.js')

describe('handling keystroke', () => {
  beforeEach(() => handle_user_input.mockClear())
  it('is empty in the beginning', () => {
      handle_keystroke('Enter')
      expect(handle_user_input).toBeCalledWith('')
  })
  it('handles plus sign', () => {
      handle_keystroke('Plus')
      handle_keystroke('Enter')
      expect(handle_user_input).toBeCalledWith('+')
  })
  it('handles backspace', () => {
      handle_keystroke('Space')
      handle_keystroke('Shift+i')
      handle_keystroke('Space')
      handle_keystroke('h')
      handle_keystroke('m')
      handle_keystroke('Backspace')
      handle_keystroke('a')
      handle_keystroke('m')
      handle_keystroke('Enter')
      expect(handle_user_input).toBeCalledWith('I am')
      say.mockClear()
      handle_keystroke('Backspace')
      expect(say).toBeCalledWith('Nothing to scratch.')
  })
  it('handles blur', () => {
      handle_keystroke('Escape')
      expect(player.play).toBeCalled()
      expect(globalShortcut.unregisterAll).toBeCalled()
  })
  it('handles media keys', () => {
      handle_keystroke('MediaNextTrack')
      expect(handle_user_input).toBeCalledWith('MediaNextTrack')
  })
})
