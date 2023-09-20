/* eslint-disable @typescript-eslint/no-var-requires */
const replace = require('replace-in-file');
const replaceString = [
  ['color-interpolation-filters', 'colorInterpolationFilters'],
  ['flood-opacity', 'floodOpacity'],
  ['clip-path', 'clipPath'],
  ['stop-color', 'stopColor'],
  ['clip-rule', 'clipRule'],
  ['fill-rule', 'fillRule'],
  ['stroke-width', 'strokeWidth'],
  ['fill-opacity', 'fillOpacity'],
];
const options = {
  files: ['./src/components/Svg/**.tsx', './src/components/Svg/**/**.tsx'],
  from: replaceString.map((x) => new RegExp(x[0], 'g')),
  to: replaceString.map((x) => x[1]),
};

async function run() {
  try {
    const results = await replace(options);
    console.log('Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

run();
