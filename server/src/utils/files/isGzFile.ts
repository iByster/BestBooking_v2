export const isGzFile = (filename: string): boolean => {
    if (filename.includes('.gz')) {
        return true;
    }

    return false;
}