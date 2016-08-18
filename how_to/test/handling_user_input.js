const app = {
    quit: jest.fn()
}
const clipboard = {
    writeText: jest.fn()
}
jest.setMock('electron', {app, clipboard, ipcMain: {on: jest.fn()}})
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
jest.unmock('../handle_command.js')
jest.unmock('../handle_user_input.js')
const handle_user_input = require('../handle_user_input.js')
const open_window = require('../open_window.js')

describe('how to handle user input', () => {
    it('handles openning links', () => {
        handle_user_input('open example.com')
        expect(open_window).toBeCalled()
    })
    it('handles openning links', () => {
        handle_user_input('open http://example.com')
        expect(open_window).toBeCalled()
    })
    it('quits', () => {
        return handle_user_input('quit').then(() => expect(app.quit).toBeCalled())
    })
    it('handles passing user input through', () => {
        handle_user_input('some random input')
        expect(open_window.send).toBeCalled()
    })
    it('copies link', () => {
        handle_user_input('copy link')
        expect(clipboard.writeText).toBeCalled()
    })
    it('passes help through', () => {
        handle_user_input('help').then(() => {
            expect(open_window.send).toBeCalledWith('user-input', 'help')
        })
    })
})
