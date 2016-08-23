const globalShortcut = {
    register: jest.fn((key, callback) => callback()),
    unregisterAll: jest.fn()
}
jest.setMock('electron', {globalShortcut, ipcMain: {on: jest.fn()}})
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
const player = {play: jest.fn((_, callback) => callback && callback())}
jest.setMock('play-sound', () => player)
jest.unmock('../hijack_keyboard.js')
const hijack_keyboard = require('../hijack_keyboard.js')
describe('hijacking keyboard', () => {
    it('registers a lot of shortcuts', () => {
        hijack_keyboard()
        expect(globalShortcut.register.mock.calls.length).toBeGreaterThan(120)
    })
})
