/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

const tap = require('tap').test;
const { generateCatalogueManifest, generateVectorManifest } = require('../scripts/generate-manifest');

const sources = require('./fixtures/valid-sources/sources.json');
const duplicateIds = require('./fixtures/valid-sources/duplicateIds.json');
const duplicateHumanNames = require('./fixtures/valid-sources/duplicateHumanNames.json');
const weightedSources = require('./fixtures/valid-sources/weighted-sources.json');
const fieldInfo = require('./fixtures/fieldInfo.json');

const v1Expected = {
  'version': '1.0',
  'layers': [{
    'attribution': '[The Silmarillion](https://en.wikipedia.org/wiki/The_Silmarillion)|[Elastic Maps Service](https://www.elastic.co/elastic-maps-service)',
    'weight': 0,
    'name': 'Gondor Kingdoms',
    'url': `https://vector-staging.maps.elastic.co/blob/222222222222?elastic_tile_service_tos=agree`,
    'format': 'geojson',
    'fields': [
      {
        'name': 'wikidata',
        'description': 'Wikidata identifier',
      },
      {
        'name': 'label_en',
        'description': 'Kingdom name (English)',
      },
    ],
    'created_at': '1200-02-28T17:13:39.288909',
    'tags': [],
    'id': 222222222222,
  }, {
    'attribution': 'The Silmarillion',
    'weight': 0,
    'name': 'Mordor Regions',
    'url': `https://vector-staging.maps.elastic.co/blob/111111111111?elastic_tile_service_tos=agree`,
    'format': 'geojson',
    'fields': [
      {
        'name': 'wikidata',
        'description': 'Wikidata identifier',
      },
      {
        'name': 'label_en',
        'description': 'Region name (English)',
      },
    ],
    'created_at': '1000-01-02T17:12:15.978370',
    'tags': [],
    'id': 111111111111,
  }],
};

const prodExpected = {
  'version': '1.0',
  'layers': [
    {
      'attribution': '[The Silmarillion](https://en.wikipedia.org/wiki/The_Silmarillion)|[Elastic Maps Service](https://www.elastic.co/elastic-maps-service)',
      'weight': 0,
      'name': 'Gondor Kingdoms',
      'url': `https://vector.maps.elastic.co/blob/222222222222?elastic_tile_service_tos=agree`,
      'format': 'geojson',
      'fields': [
        {
          'name': 'wikidata',
          'description': 'Wikidata identifier',
        },
        {
          'name': 'label_en',
          'description': 'Kingdom name (English)',
        },
      ],
      'created_at': '1200-02-28T17:13:39.288909',
      'tags': [],
      'id': 222222222222,
    },
  ],
};

const safeDuplicatesExpected = {
  'version': '1.0',
  'layers': [{
    'attribution': 'The Silmarillion',
    'weight': 0,
    'name': 'Isengard Regions',
    'url': 'https://vector-staging.maps.elastic.co/blob/111111111111?elastic_tile_service_tos=agree',
    'format': 'geojson',
    'fields': [
      {
        'name': 'wikidata',
        'description': 'Wikidata identifier',
      },
      {
        'name': 'label_en',
        'description': 'Region name (English)',
      },
    ],
    'created_at': '1000-01-02T17:12:15.978370',
    'tags': [],
    'id': 111111111111,
  }],
};

tap('v1 tests', t => {
  const v1 = generateVectorManifest(sources, {
    version: 'v1',
    hostname: 'vector-staging.maps.elastic.co',
  });
  t.same(v1, v1Expected, 'v1');

  const prod = generateVectorManifest(sources, {
    version: 'v1',
    production: true,
    hostname: 'vector.maps.elastic.co',
  });
  t.same(prod, prodExpected, 'production');

  const fieldInfoTest = generateVectorManifest(sources, {
    version: 'v1',
    hostname: 'vector-staging.maps.elastic.co',
    opts: { fieldInfo: fieldInfo },
  });
  t.same(fieldInfoTest, v1Expected, 'fieldInfos not used in v1');

  const weightedOrder = generateVectorManifest(weightedSources, {
    version: 'v1',
  }).layers.map(layer => layer.name);
  t.same(weightedOrder, ['Rohan Kingdoms', 'Gondor Kingdoms', 'Mordor Regions', 'Shire regions']);

  const safeDuplicateIds = function () {
    return generateVectorManifest(duplicateIds, {
      version: 'v1',
      hostname: 'vector-staging.maps.elastic.co',
    });
  };

  const safeDuplicateHumanNames = function () {
    return generateVectorManifest(duplicateHumanNames, {
      version: 'v1',
      hostname: 'vector-staging.maps.elastic.co',
    });
  };

  t.same(safeDuplicateIds(), safeDuplicatesExpected, 'Source ids can be duplicate in non-intersecting versions');
  t.same(safeDuplicateHumanNames(), safeDuplicatesExpected, 'Source human names can be duplicate in non-intersecting versions');

  const v1Catalogue = generateCatalogueManifest({
    version: 'v1',
    tileHostname: 'tiles.maps.elstc.co',
    vectorHostname: 'vector-staging.maps.elastic.co',
  });
  t.same(v1Catalogue, {
    version: '1.0',
    services: [{
      id: 'tiles_v2',
      name: 'Elastic Maps Tile Service',
      manifest: 'https://tiles.maps.elstc.co/v2/manifest',
      type: 'tms',
    }, {
      id: 'geo_layers',
      name: 'Elastic Maps Vector Service',
      manifest: 'https://vector-staging.maps.elastic.co/v1/manifest',
      type: 'file',
    }],
  });

  const prodCatalogue = generateCatalogueManifest({
    version: 'v1',
    tileHostname: 'tiles.maps.elastic.co',
    vectorHostname: 'vector.maps.elastic.co',
  });
  t.same(prodCatalogue, {
    version: '1.0',
    services: [{
      id: 'tiles_v2',
      name: 'Elastic Maps Tile Service',
      manifest: 'https://tiles.maps.elastic.co/v2/manifest',
      type: 'tms',
    }, {
      id: 'geo_layers',
      name: 'Elastic Maps Vector Service',
      manifest: 'https://vector.maps.elastic.co/v1/manifest',
      type: 'file',
    }],
  });
  t.end();
});
