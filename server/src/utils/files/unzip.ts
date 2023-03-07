import * as zlib from 'zlib';

const unzipFile = (file: any) => {
    const xml = zlib.gunzipSync(file);
    return xml.toString();
}

export default unzipFile;