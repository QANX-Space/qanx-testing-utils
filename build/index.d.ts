type State = {
    [key: string]: string;
};
export interface IProgramInput {
    path: string;
    args: string[];
    readSlots: string[];
}
export interface IProgramOutput {
    writes: number;
    state: State;
    errorMessage: string;
    exitCode: number;
}
export declare const call: (input: IProgramInput, predefinedState: State) => IProgramOutput;
export {};
