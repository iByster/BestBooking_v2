export type StringColor = 'blue' | 'red' | 'light-blue' | 'yellow' | 'green' | 'purple';

export const colorizeString = (str: string, color: StringColor) => {
    const mapColor = {
        blue: '\x1b[34m',
        red: '\x1b[31m',
        'light-blue': '\x1b[36m',
        'yellow': '\x1b[33m',
        'green': '\x1b[32m',
        'purple': '\x1b[35m'
    }

    return `${mapColor[color]}${str}${'\x1b[0m'}`
}

export const colorizeStringByNumber = (str: string, nr: number) => {
    const colorArr = [
        '\x1b[94m',
        '\x1b[95m',
        '\x1b[96m',
        '\x1b[97m',
        '\x1b[31;1m',
        '\x1b[32;1m',
        '\x1b[33;1m',
        '\x1b[34;1m',
        '\x1b[35;1m',
        '\x1b[36;1m',
        '\x1b[37;1m',
        '\x1b[38;5;208m',
        '\x1b[38;5;45m',
        '\x1b[38;5;88m',
        '\x1b[38;5;136m',
        '\x1b[38;5;183m',
        '\x1b[38;5;130m',
        '\x1b[38;5;142m',
        '\x1b[38;5;203m',
        '\x1b[38;5;208m',
        '\x1b[38;5;80m',
        '\x1b[38;5;228m'
    ]

    return `${colorArr[nr % 22]}${str}${'\x1b[0m'}`
}