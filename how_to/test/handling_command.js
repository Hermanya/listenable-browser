let options = {
    commands: {
        'do -something': jest.fn(),
        'do': jest.fn()
    },
    if_not_recognized: jest.fn(() => Promise.resolve()),
    after_help: jest.fn()
}
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
jest.unmock('../handle_command.js')
const handle_command = require('../handle_command.js')

describe('handling a command', () => {
    it('handles simple commands', () => {
        handle_command('do', options)
        expect(options.commands['do']).toBeCalled()
    })
    it('handles commands with a parameter', () => {
        handle_command('do work', options)
        expect(options.commands['do (something)']).toBeCalledWith('work')
    })
    it('provides help', () => {
        return handle_command('help', options).then(() => {
            expect(options.if_not_recognized).not.toBeCalled()
            expect(options.after_help).toBeCalled()
        })
    })
    it('handles unrecognized input', () => {
        return handle_command(Date.now().toString(), options).then(() => {
            expect(options.if_not_recognized).toBeCalled()
        })
    })
})
