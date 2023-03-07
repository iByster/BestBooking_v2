import { stringify } from 'csv-stringify/sync';

export default function jsObjectToCsvRecord(jsObject: any, columnsOrder: string[]) {
    return stringify([jsObject], { columns: columnsOrder });
}