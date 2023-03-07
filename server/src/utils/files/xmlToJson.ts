import * as parse from 'xml-js'

export default function parseXmlString(xmlString: string): any {
    // Convert the XML string to a JavaScript object using the xml-js library
    const options = { compact: true, ignoreDeclaration: true };
    const xmlJson = parse.xml2json(xmlString, options);

    return JSON.parse(xmlJson);
  }