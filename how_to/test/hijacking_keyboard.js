const globalShortcut = {register: jest.fn((key, callback) => callback())}
jest.setMock('electron', {globalShortcut, ipcMain: {on: jest.fn()}})
const player = {play: jest.fn((_, callback) => callback && callback())}
jest.setMock('play-sound', () => player)
jest.unmock('../hijack_keyboard.js')
const hijack_keyboard = require('../hijack_keyboard.js')
describe('hijacking keyboard', () => {
    it('registers a lot of shortcuts', () => {
        hijack_keyboard()
        expect(globalShortcut.register.mock.calls.length).toBeGreaterThan(120)
        expect(player.play).toBeCalled()
    })
})
