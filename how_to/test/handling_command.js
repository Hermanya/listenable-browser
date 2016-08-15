let options = {
    commands: {
        'do -something': jest.fn(),
        'do': jest.fn()
    },
    if_not_recognized: jest.fn(() => Promise.resolve()),
    after_help: jest.fn()
}
jest.setMock('../say_something.js', jest.fn(() => Promise.resolve()))
const say = require('../say_something.js')
jest.unmock('../handle_command.js')
const handle_command = require('../handle_command.js')

describe('handling a command', () => {
    it('handles simple commands', () => {
        handle_command('do', options)
        expect(options.commands['do']).toBeCalled()
    })
    it('handles commands with a parameter', () => {
        handle_command('do work', options)
        expect(options.commands['do -something']).toBeCalledWith('work')
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
    it('has default handling of unrecognized input', () => {
        let test = () => handle_command(Date.now().toString(), Object.assign({}, options, {if_not_recognized: undefined}))
        expect(test).not.toThrow()
    })
    it('provides proper help when no commands available', () => {
        say.mockClear()
        return handle_command('help', Object.assign({}, options, {commands: {}, after_help: undefined})).then(() => {
            expect(say).toBeCalledWith('There are no commands.')
        })
    })
    it('provides proper help when one command available', () => {
        say.mockClear()
        return handle_command('help', Object.assign({}, options, {commands: {test: jest.fn()}})).then(() => {
            expect(say).toBeCalledWith('You can only test.')
        })
    })
    it('handles unrecognized empty input', () => {
        say.mockClear()
        return handle_command('', Object.assign({}, options, {if_not_recognized: undefined})).then(() => {
            expect(say).toBeCalledWith('Not sure what that means.')
        })
    })
})
