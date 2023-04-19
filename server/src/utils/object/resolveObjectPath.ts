function resolveObjectPath(path: string, obj: any) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

export default resolveObjectPath;