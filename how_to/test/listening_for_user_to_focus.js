const globalShortcut = {register: jest.fn()}
jest.setMock('electron', {globalShortcut})
const hijack_keyboard = jest.fn()
const {focus_shortcut} = require('../../package.json').config
jest.setMock('../hijack_keyboard.js', hijack_keyboard)
jest.unmock('../listen_for_user_to_focus.js')
const listen_for_user_to_focus = require('../listen_for_user_to_focus.js')

describe('waiting for user attention', () => {
    it('starts waiting for a shortcut', () => {
        listen_for_user_to_focus()
        expect(globalShortcut.register).toBeCalledWith(focus_shortcut, hijack_keyboard)
    })
})
