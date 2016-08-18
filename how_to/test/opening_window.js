const current_window = {
    loadURL: jest.fn(),
    close: jest.fn(),
    webContents: {
        on: jest.fn(),
        send: jest.fn(),
        getTitle: jest.fn(),
        getURL: jest.fn()
    }
}
const BrowserWindow = jest.fn(() => {
    return current_window
})
jest.setMock('electron', {BrowserWindow, ipcMain: {on: jest.fn()}})
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
jest.unmock('../open_window.js')
const open_window = require('../open_window.js')

describe('opening window', () => {
    it('opens windows', () => {
        open_window('opening_window.com')
        expect(current_window.loadURL).toBeCalledWith('opening_window.com')
        expect(current_window.webContents.on).toBeCalled() // with 'did-fail-load' and some callback
        current_window.loadURL.mockClear()
        open_window('opening_window.com')
        expect(current_window.loadURL).not.toBeCalled()
    })
    it('has title', () => {
        expect(() => open_window.title()).not.toThrow()
    })
    it('has url', () => {
        expect(() => open_window.url()).not.toThrow()
    })
    it('fails to load gracefully', () => {
        current_window.webContents.on = (event_name, callback) => callback()
        open_window('some_nonexisting_website.com')
        expect(open_window.url()).not.toBe('some_nonexisting_website.com')
        expect(open_window.title()).toBe(undefined)
        open_window.send('stuff')
        expect(current_window.webContents.send).not.toBeCalled()
        current_window.webContents.on = jest.fn()
    })
    it('fails to load gracefully even if it is no longer current window', () => {
        let resolve, promise = new Promise(_ => {resolve = _})
        current_window.webContents.on = (event_name, callback) => promise.then(callback)
        open_window('some_nonexisting_website.com')
        current_window.webContents.on = () => {}
        open_window('some_existing_website.com')
        current_window.webContents.on = jest.fn()
        resolve()
        return promise.then(() => expect(open_window.url()).toBe('some_existing_website.com'));
    })
    it('can send', () => {
        open_window('example.com')
        open_window.send('event_name', 'data')
        expect(current_window.webContents.send).toBeCalledWith('event_name', 'data')
    })
})
