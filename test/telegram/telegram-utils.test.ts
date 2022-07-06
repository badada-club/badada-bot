import { getCommand } from '../../src/telegram/telegram-utils';

describe('getCommand', () => {
    describe('On non-command', () => {
        it('Should return nothing', () => {
            expect(getCommand('123')).not.toBeDefined();
        });
    });
    describe('On command', () => {
        it('Should extract the command', () => {
            const parseResult = getCommand('/command');
            expect(parseResult).toBeDefined();
            expect(parseResult?.command).toStrictEqual('command');
            expect(parseResult?.botName).not.toBeDefined();
            expect(parseResult?.commandArg).not.toBeDefined();
        });
    });
    describe('On command with arg', () => {
        it('Should extract the command and the arg', () => {
            const parseResult = getCommand('/command 123@123 sdf');
            expect(parseResult).toBeDefined();
            expect(parseResult?.command).toStrictEqual('command');
            expect(parseResult?.botName).not.toBeDefined();
            expect(parseResult?.commandArg).toStrictEqual('123@123 sdf');
        });
    });
    describe('On command with bot name', () => {
        it('Should extract the command and the bot name', () => {
            const parseResult = getCommand('/command@s_99');
            expect(parseResult).toBeDefined();
            expect(parseResult?.command).toStrictEqual('command');
            expect(parseResult?.botName).toStrictEqual('s_99');
            expect(parseResult?.commandArg).not.toBeDefined();
        });
    });
    describe('On command with bot name and arg', () => {
        it('Should extract the command, the bot name and the arg', () => {
            const parseResult = getCommand('/command@s_99 #  00shd');
            expect(parseResult).toBeDefined();
            expect(parseResult?.command).toStrictEqual('command');
            expect(parseResult?.botName).toStrictEqual('s_99');
            expect(parseResult?.commandArg).toStrictEqual('#  00shd');
        });
    });
});