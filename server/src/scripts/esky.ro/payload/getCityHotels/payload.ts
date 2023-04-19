export const constructQueryStringPayload = (
    pageNumber: number,
    cityCode: string,
    limit?: number,
) => {
    return `code=${cityCode}&type=0&rooms%5B0%5D%5Badults%5D=2&rooms%5B0%5D%5Bchildren%5D=0&page=${pageNumber}&limit=${limit ? limit : '35'}&sort%5Bpopularity%5D=desc`
};