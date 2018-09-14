/*
url types:
type: /producttype:muizen,gaming-muizen
misc: /producttype:laptops/top-10, /merk:sonos, /laptops/model-laptop:2-in-1
visueel: /computer-onderdelen/visueel
actie: /actie/hoesjes-samsung.html
// /zoeken/tweedekans, /klantenservice/232/alle-informatie-over/tweedekans.html
*/

// data = ...;

objectify = (k) => R.pipe(
  R.map(o => [o.name, o[k]]),
  R.fromPairs,
);

renameKeys = R.curry((keysMap, obj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
);

R.pipe(
  R.prop('cat1'),
  //objectify('cat2'),
  //R.map(objectify('catpage')),
  //R.map(R.map(objectify('url'))),
  R.map(renameKeys({ name: 'cat1' })),
  R.chain(o => R.map(R.merge(R.dissoc('cat2', o)))(o.cat2)),
  R.map(renameKeys({ name: 'cat2' })),
  R.chain(o => R.map(R.merge(R.dissoc('catpage', o)))(o.catpage)),
  R.filter(o => o.url.match(/producttype:/g)),
  R.map(R.pipe(R.evolve({ url: R.pipe(
    R.replace('https://www.coolblue.nl/', ''),
    R.replace(/^producttype:/, ''),
    R.replace(/\/.*/, ''),
    R.replace(/\?.*/, ''),
    R.split(/,/g),
  ) }),
  )),
  R.chain(o => R.map(url => R.merge({ url }, R.dissoc('url', o)))(o.url)),
  R.uniqBy(R.prop('url')),
  R.map(R.evolve({ url: (producttype) => `https://www.coolblue.nl/producttype:${producttype}` })),
  R.pluck('url'),
  JSON.stringify,
  //R.join('\n'),
)(data);


/////////////////////////

//jl = ...;
json = jl.split('\n');
o = R.pipe(R.dropLast(1), R.map(JSON.parse))(json);
// filter out second-hand, ditch category info
R.pipe(
  R.chain(R.prop('products')),
  R.filter(s=>s.match(/^\/product\//)),
  R.map(R.replace(/^\/product\//, '')),
  R.uniq,
  JSON.stringify,
)(o)


