import { as } from "src/utils/utils";

export interface Check {
    nonNull: <T>(value: T, message: string) => T;
    nonNullNotZero: (value: number, message: string) => number;
    stringNonNullNotEmpty: (value: string, message: string) => string;
    arrayNonNullNotEmpty: <T> (value: T[], message: string) => T[];
    error: <T extends Error>(error: T) => T;
}

function nonNull<T>(value: T, message: string): T {
    if (value === null || value === undefined) {
        const err = new Error(`nonNull ${message}: ${value}`);
        console.error(err);
        throw err;
    }
    return value;
}

function nonNullNotZero(value: number, message: string): number {
    if (value === null || value === undefined || value === 0) {
        const err = new Error(`nonNullNotZero ${message}: ${value}`);
        console.error(err);
        throw err;
    }
    return value;
}

function stringNonNullNotEmpty(value: string, message: string, ... args: unknown[]): string {
    if (!value || !value.trim().length) {
        console.error(message, value, ... args);
        throw message;
    }
    return value;
}

function arrayNonNullNotEmpty<T>(value: T[], message: string, ... args: unknown[]): T[] {
    if (!value || !value.length) {
        console.error(message, value, ... args);
        throw message;
    }
    return value;
}

function error<T extends Error>(error: T): T {
    console.error(error);
    return error;
}

module.exports = as<Check>({ nonNull, nonNullNotZero, stringNonNullNotEmpty, arrayNonNullNotEmpty, error });
