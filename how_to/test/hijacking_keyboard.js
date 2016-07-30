const globalShortcut = {register: jest.fn()}
jest.setMock('electron', {globalShortcut})
jest.unmock('../hijack_keyboard.js')
const hijack_keyboard = require('../hijack_keyboard.js')
describe('hijacking keyboard', () => {
    it('registers a lot of shortcuts', () => {
        hijack_keyboard()
        expect(globalShortcut.register.mock.calls.length).toBeGreaterThan(120)
    })
})
