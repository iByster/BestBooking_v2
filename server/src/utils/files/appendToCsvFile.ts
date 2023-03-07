import fs from 'fs';

export default function appendToCSVFile(filePath: string, record: string) {
    fs.appendFileSync(filePath, record);
}