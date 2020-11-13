## Tippecanoe

This is a trivial shell around Mapbox's [Tippecanoe](https://github.com/mapbox/tippecanoe), a command-line tool for generating vector tiles from geometry files such as GeoJSON.

You must install Tippecanoe separately. It must be on the PATH.

### Usage

```js
const tippecanoe = require('tippecanoe');
tippecanoe([ inputFile1, inputFile2, ...], { parameters }, { options });

const tippecanoe = require('tippecanoe').tippecanoeAsync;
tippecanoe([ inputFile1, inputFile2, ...], { parameters }, { options }).then(...);

const tilejoin = require('tippecanoe').tilejoin;
tilejoin([ inputFile1, inputFile2, ...], { parameters }, { options });

const tilejoin = require('tippecanoe').tilejoinAsync;
tilejoin([ inputFile1, inputFile2, ...], { parameters }, { options }).then(...);
```



* `inputFile1` etc: names of input files
* `parameters`: an object consisting of camelCase keys passed to Tippecanoe as kebab-case. Each key should be in one of these formats:
  * `zg: true`: passed as `-zg`
  * `maximumZoom: 'g'`: passed as `--maximum-zoom=g`
  * `include: ['name', 'id']`: passed as `--include=name --include=id`
  * `namedLayer: { file: 'towns20.geojson', name: 'towns' }`: passed as `--named-layer='{"file":"towns20.geojson","name:"towns"}'`
* `options`: an object containing options for this library itself. Currently supports:
  * `echo: true`, to print out the command line as it is called.

### Example

```js
tippecanoe(['buildings-50k.json'], {
    zg: true,
    readParallel: true,
    simplification: 10,
    layer: 'buildings',
    output: 'buildings.mbtiles',
    description: 'Building footprints in the municipality of Hobbiton.'
}, { echo: true });
```

