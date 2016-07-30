const currentWindow = {
    loadURL: jest.fn(),
    destroy: jest.fn(),
    webContents: {
        send: jest.fn()
    }
}
const app = {
    quit: jest.fn()
}
const BrowserWindow = jest.fn(() => {
    return currentWindow
})
jest.setMock('electron', {BrowserWindow, app})
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
jest.unmock('../handle_user_input.js')
const handle_user_input = require('../handle_user_input.js')

const electron = require('electron')

describe('how to handle user input', () => {
    it('handles openning links', () => {
        handle_user_input('open example.com')
        expect(BrowserWindow).toBeCalled()
        expect(currentWindow.loadURL).toBeCalled()
        handle_user_input('open example.org')
        expect(currentWindow.destroy).toBeCalled()
    })
    it('quits', () => {
        return handle_user_input('quit').then(() => expect(app.quit).toBeCalled())
    })
    it('handles passing user input through', () => {
        handle_user_input('some random input')
        expect(currentWindow.webContents.send).toBeCalled()
    })
})
