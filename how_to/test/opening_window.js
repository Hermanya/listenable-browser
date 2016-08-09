const current_window = {
    loadURL: jest.fn(),
    destroy: jest.fn(),
    webContents: {
        send: jest.fn(),
        getTitle: jest.fn(),
        getUrl: jest.fn()
    }
}
const BrowserWindow = jest.fn(() => {
    return current_window
})
jest.setMock('electron', {BrowserWindow})
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
jest.unmock('../open_window.js')
const open_window = require('../open_window.js')

describe('opening window', () => {
    it('opens windows', () => {
        open_window('example.com')
        expect(current_window.loadURL).toBeCalledWith('example.com')
        open_window('example.org')
        expect(current_window.destroy).toBeCalled()
    })
    it('has title', () => {
        expect(() => open_window.title()).not.toThrow()
    })
    it('can send', () => {
        open_window.send('event-name', 'data')
        expect(current_window.webContents.send).toBeCalledWith('event-name', 'data')
    })
})
