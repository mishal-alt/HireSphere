const pdf = require('pdf-parse');
console.log('PDF module keys:', Object.keys(pdf));
console.log('PDF module:', pdf);
if (pdf.PDFParse) console.log('PDFParse class found');
