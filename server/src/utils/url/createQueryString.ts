export const createQueryString = (data: any) => {
    return Object.keys(data).map(key => {
      let val = data[key]
      if (val !== null && typeof val === 'object') val = createQueryString(val)
      return `${key}=${encodeURIComponent(`${val}`.replace(/\s/g, '_'))}`
    }).join('&')
}
