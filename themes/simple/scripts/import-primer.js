const path = require('path');
const fs = require('fs');

fs.copyFileSync(
  path.resolve(__dirname, '../../../node_modules/@primer/css/dist/primer.css'),
  path.resolve(__dirname, '../source/primer.css')
);
