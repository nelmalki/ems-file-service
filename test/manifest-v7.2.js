/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

const tap = require('tap').test;
const { generateCatalogueManifest, generateVectorManifest } = require('../scripts/generate-manifest');

const sources = require('./fixtures/valid-sources/sources.json');
const duplicateNames = require('./fixtures/valid-sources/duplicateNames.json');
const weightedSources = require('./fixtures/valid-sources/weighted-sources.json');
const fieldInfo = require('./fixtures/fieldInfo.json');

const dataDir = 'test/fixtures/data';

const stagingExpected = {
  'version': '7.2',
  'layers': [
    {
      'layer_id': 'gondor',
      'created_at': '1200-02-28T17:13:39.288909',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
          'fr': 'Le Silmarillion',
        },
        'url': {
          'en': 'https://en.wikipedia.org/wiki/The_Silmarillion',
          'fr': 'https://fr.wikipedia.org/wiki/Le_Silmarillion',
        },
      }, {
        'label': {
          'en': 'Elastic Maps Service',
        },
        'url': {
          'en': 'https://www.elastic.co/elastic-maps-service',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector-staging.maps.elastic.co/files/gondor_v3.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'de': 'name (en)',
            'en': 'name (en)',
            'zh': '名称 (en)',
          },
        },
      ],
      'legacy_ids': [
        'Gondor',
        'Gondor Kingdoms',
      ],
      'layer_name': {
        'en': 'Gondor Kingdoms',
        'de': 'Gondor',
        'zh': '魔多',
      },
    }, {
      'layer_id': 'rohan',
      'created_at': '1200-02-28T17:13:39.456456',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector-staging.maps.elastic.co/files/rohan_v2.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': false,
        },
        {
          'type': 'topojson',
          'url': 'https://vector-staging.maps.elastic.co/files/rohan_v2.topo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
          'meta': {
            'feature_collection_path': 'regions',
          },
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'de': 'name (en)',
            'en': 'name (en)',
            'zh': '名称 (en)',
          },
        },
      ],
      'legacy_ids': [
        'Rohan',
        'Rohan Kingdoms',
      ],
      'layer_name': {
        'en': 'Rohan Kingdoms',
        'de': 'Rohan',
        'zh': '洛汗',
      },
    }, {
      'layer_id': 'shire',
      'created_at': '1532-12-25T18:45:32.389979',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': `https://vector-staging.maps.elastic.co/files/shire_v2.geo.json?elastic_tile_service_tos=agree`,
          'legacy_default': true,
        },
        {
          'type': 'topojson',
          'url': 'https://vector-staging.maps.elastic.co/files/shire_v2.topo.json?elastic_tile_service_tos=agree',
          'legacy_default': false,

        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'de': 'name (en)',
            'en': 'name (en)',
            'zh': '名称 (en)',
          },
        },
        {
          'type': 'property',
          'id': 'label_ws',
          'label': {
            'de': 'name (ws)',
            'en': 'name (ws)',
            'zh': '名称 (ws)',
          },
        },
      ],
      'legacy_ids': [
        'Shire',
        'Shire regions',
        'Shire Regions',
      ],
      'layer_name': {
        'en': 'Shire regions',
        'de': 'Auenland',
        'zh': '夏爾',
      },
    },
  ],
};

const prodExpected = {
  'version': '7.2',
  'layers': [
    {
      'layer_id': 'gondor',
      'created_at': '1200-02-28T17:13:39.288909',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
          'fr': 'Le Silmarillion',
        },
        'url': {
          'en': 'https://en.wikipedia.org/wiki/The_Silmarillion',
          'fr': 'https://fr.wikipedia.org/wiki/Le_Silmarillion',
        },
      }, {
        'label': {
          'en': 'Elastic Maps Service',
        },
        'url': {
          'en': 'https://www.elastic.co/elastic-maps-service',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector.maps.elastic.co/files/gondor_v3.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'de': 'name (en)',
            'en': 'name (en)',
            'zh': '名称 (en)',
          },
        },
      ],
      'legacy_ids': [
        'Gondor',
        'Gondor Kingdoms',
      ],
      'layer_name': {
        'en': 'Gondor Kingdoms',
        'de': 'Gondor',
        'zh': '魔多',
      },
    }, {
      'layer_id': 'rohan',
      'created_at': '1200-02-28T17:13:39.456456',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector.maps.elastic.co/files/rohan_v2.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': false,
        },
        {
          'type': 'topojson',
          'url': 'https://vector.maps.elastic.co/files/rohan_v2.topo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
          'meta': {
            'feature_collection_path': 'regions',
          },
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'de': 'name (en)',
            'en': 'name (en)',
            'zh': '名称 (en)',
          },
        },
      ],
      'legacy_ids': [
        'Rohan',
        'Rohan Kingdoms',
      ],
      'layer_name': {
        'en': 'Rohan Kingdoms',
        'de': 'Rohan',
        'zh': '洛汗',
      },
    },
  ],
};

const fieldInfoFallbackExpected = {
  'version': '7.2',
  'layers': [
    {
      'layer_id': 'gondor',
      'created_at': '1200-02-28T17:13:39.288909',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
          'fr': 'Le Silmarillion',
        },
        'url': {
          'en': 'https://en.wikipedia.org/wiki/The_Silmarillion',
          'fr': 'https://fr.wikipedia.org/wiki/Le_Silmarillion',
        },
      }, {
        'label': {
          'en': 'Elastic Maps Service',
        },
        'url': {
          'en': 'https://www.elastic.co/elastic-maps-service',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector-staging.maps.elastic.co/files/gondor_v3.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'en': 'Wikidata identifier',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'en': 'Kingdom name (English)',
          },
        },
      ],
      'legacy_ids': [
        'Gondor',
        'Gondor Kingdoms',
      ],
      'layer_name': {
        'en': 'Gondor Kingdoms',
        'de': 'Gondor',
        'zh': '魔多',
      },
    },
    {
      'layer_id': 'rohan',
      'created_at': '1200-02-28T17:13:39.456456',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector-staging.maps.elastic.co/files/rohan_v2.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': false,
        },
        {
          'type': 'topojson',
          'url': 'https://vector-staging.maps.elastic.co/files/rohan_v2.topo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
          'meta': {
            'feature_collection_path': 'regions',
          },
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'en': 'Wikidata identifier',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'en': 'Kingdom name (English)',
          },
        },
      ],
      'legacy_ids': [
        'Rohan',
        'Rohan Kingdoms',
      ],
      'layer_name': {
        'en': 'Rohan Kingdoms',
        'de': 'Rohan',
        'zh': '洛汗',
      },
    },
  ],
};

const fieldInfoMissingNameExpected = {
  'version': '7.2',
  'layers': [
    {
      'layer_id': 'gondor',
      'created_at': '1200-02-28T17:13:39.288909',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
          'fr': 'Le Silmarillion',
        },
        'url': {
          'en': 'https://en.wikipedia.org/wiki/The_Silmarillion',
          'fr': 'https://fr.wikipedia.org/wiki/Le_Silmarillion',
        },
      }, {
        'label': {
          'en': 'Elastic Maps Service',
        },
        'url': {
          'en': 'https://www.elastic.co/elastic-maps-service',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector-staging.maps.elastic.co/files/gondor_v3.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'en': 'Kingdom name (English)',
          },
        },
      ],
      'legacy_ids': [
        'Gondor',
        'Gondor Kingdoms',
      ],
      'layer_name': {
        'en': 'Gondor Kingdoms',
        'de': 'Gondor',
        'zh': '魔多',
      },
    },
    {
      'layer_id': 'rohan',
      'created_at': '1200-02-28T17:13:39.456456',
      'attribution': [{
        'label': {
          'en': 'The Silmarillion',
        },
      }],
      'formats': [
        {
          'type': 'geojson',
          'url': 'https://vector-staging.maps.elastic.co/files/rohan_v2.geo.json?elastic_tile_service_tos=agree',
          'legacy_default': false,
        },
        {
          'type': 'topojson',
          'url': 'https://vector-staging.maps.elastic.co/files/rohan_v2.topo.json?elastic_tile_service_tos=agree',
          'legacy_default': true,
          'meta': {
            'feature_collection_path': 'regions',
          },
        },
      ],
      'fields': [
        {
          'type': 'id',
          'id': 'wikidata',
          'label': {
            'de': 'Wikidata-Kennung',
            'en': 'Wikidata identifier',
            'zh': '维基数据标识符',
          },
        },
        {
          'type': 'property',
          'id': 'label_en',
          'label': {
            'en': 'Kingdom name (English)',
          },
        },
      ],
      'legacy_ids': [
        'Rohan',
        'Rohan Kingdoms',
      ],
      'layer_name': {
        'en': 'Rohan Kingdoms',
        'de': 'Rohan',
        'zh': '洛汗',
      },
    },
  ],
};

tap('vector manifest tests <=7.2', t => {
  const staging = generateVectorManifest(sources, {
    version: 'v7.2',
    hostname: 'vector-staging.maps.elastic.co',
    fieldInfo: fieldInfo,
    dataDir,
  });
  t.same(staging, stagingExpected, 'v7.2');

  const prod = generateVectorManifest(sources, {
    version: 'v7.2',
    production: true,
    hostname: 'vector.maps.elastic.co',
    fieldInfo: fieldInfo,
    dataDir,
  });
  t.same(prod, prodExpected, 'production');

  const unsafeDuplicateNames = function () {
    return generateVectorManifest(duplicateNames, {
      version: 'v7.2',
      hostname: 'vector-staging.maps.elastic.co',
      fieldInfo: fieldInfo,
      dataDir,
    });
  };
  t.throws(unsafeDuplicateNames, 'Source names cannot be duplicate in manifests');

  const weightedOrder = generateVectorManifest(weightedSources, {
    version: 'v7.2',
    dataDir,
  }).layers.map(layer => layer.layer_id);
  t.same(weightedOrder, ['rohan', 'gondor', 'mordor_regions', 'shire']);


  const fieldInfoFallback = generateVectorManifest(sources, {
    version: 'v7.2',
    hostname: 'vector-staging.maps.elastic.co',
    production: true,
    dataDir,
  });
  t.same(fieldInfoFallback, fieldInfoFallbackExpected,
    'should fallback to source field `desc` if fieldInfos is not available');

  const fieldInfoMissingName = generateVectorManifest(sources, {
    version: 'v7.2',
    hostname: 'vector-staging.maps.elastic.co',
    production: true,
    fieldInfo: {
      'wikidata': {
        'wikidata': 'Q43649390',
        'i18n': {
          'de': 'Wikidata-Kennung',
          'en': 'Wikidata identifier',
          'zh': '维基数据标识符',
        },
      },
    },
    dataDir,
  });
  t.same(fieldInfoMissingName, fieldInfoMissingNameExpected,
    'should fallback to source field `desc` if `fieldInfo.name.i18n` is not available');
  t.end();

});

tap('catalogue tests <=7.2', t => {
  const stagingCatalogue = generateCatalogueManifest({
    version: 'v7.2',
    tileHostname: 'tiles.maps.elstc.co',
    vectorHostname: 'vector-staging.maps.elastic.co',
  });
  t.same(stagingCatalogue, {
    version: '7.2',
    services: [{
      id: 'tiles',
      name: 'Elastic Maps Tile Service',
      manifest: 'https://tiles.maps.elstc.co/v7.2/manifest',
      type: 'tms',
    }, {
      id: 'geo_layers',
      name: 'Elastic Maps Vector Service',
      manifest: 'https://vector-staging.maps.elastic.co/v7.2/manifest',
      type: 'file',
    }],
  }, '7.2 staging catalogue should exist');

  const prodCatalogue = generateCatalogueManifest({
    version: 'v7.2',
    tileHostname: 'tiles.maps.elastic.co',
    vectorHostname: 'vector.maps.elastic.co',
  });
  t.same(prodCatalogue, {
    version: '7.2',
    services: [{
      id: 'tiles',
      name: 'Elastic Maps Tile Service',
      manifest: 'https://tiles.maps.elastic.co/v7.2/manifest',
      type: 'tms',
    }, {
      id: 'geo_layers',
      name: 'Elastic Maps Vector Service',
      manifest: 'https://vector.maps.elastic.co/v7.2/manifest',
      type: 'file',
    }],
  }, '7.2 production catalogue should exist');
  t.end();
});


