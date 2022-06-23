export function toMocked<TFunction extends (...args: any[]) => any>(func: TFunction): jest.MockedFunction<TFunction> {
    return func as unknown as jest.MockedFunction<TFunction>;
}