function assert<T>(value: T, message: string, ... args: unknown[]): T {
    if (!value) {
        console.error(message, value, ... args);
        throw message;
    }
    return value;
}

function nonNull(value: string, message: string, ... args: unknown[]): string {
    if (value === null || value === undefined) {
        console.error(message, value, ... args);
        throw message;
    }
    return value;
}


function nonNullNotEmpty(value: string, message: string, ... args: unknown[]): string {
    if (!value || !value.trim().length) {
        console.error(message, value, ... args);
        throw message;
    }
    return value;
}

module.exports = { assert, nonNull, nonNullNotEmpty };
