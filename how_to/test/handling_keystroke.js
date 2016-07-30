const globalShortcut = {unregisterAll: jest.fn()}
jest.setMock('electron', {globalShortcut})
jest.unmock('../handle_keystroke.js')
const handle_keystroke = require('../handle_keystroke.js')
const handle_user_input = require('../handle_user_input.js')
const listen_for_user_to_focus = require('../listen_for_user_to_focus.js')

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
      handle_keystroke('Shift+i')
      handle_keystroke('Space')
      handle_keystroke('h')
      handle_keystroke('m')
      handle_keystroke('Backspace')
      handle_keystroke('a')
      handle_keystroke('m')
      handle_keystroke('Enter')
      expect(handle_user_input).toBeCalledWith('I am')
  })
  it('handles blur', () => {
      handle_keystroke('Escape')
      expect(listen_for_user_to_focus).toBeCalled()
      expect(globalShortcut.unregisterAll).toBeCalled()
  })
})
