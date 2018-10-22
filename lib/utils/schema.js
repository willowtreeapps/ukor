/* eslint no-useless-escape: 0 */
module.exports = {
  properties: {
    rokus: {
      type: 'object',
      default: {},
      patternProperties: {
        '\S*': {
          type: 'object',
          properties: {
            serial: {
              type: 'string',
              pattern: '^[A-Za-z0-9]{12}$'
            },
            auth: {
              type: 'object',
              properties: {
                user: { type: 'string' },
                pass: { type: 'string' },
              },
              required: ['user', 'pass']
            }
          },
          required: ['serial', 'auth']
        }
      }
    },
    flavors: {
      type: 'object',
      default: {},
      patternProperties: {
        '\S*': {
          type: 'object',
          properties: {
            base: {
              type: 'string',
              default: ''
            },
            src: {
              type: 'array',
              default: []
            }
          },
          required: ['src']
        }
      }
    },
    defaults: {
      type: 'object',
      default: {},
      properties: {
        flavor: {
          type: 'string',
          pattern: '\S*'
        },
        roku: {
          type: 'string',
          pattern: '\S*'
        }
      }
    },
    buildDir: {
      type: 'string',
      pattern: '\S*',
      default: 'build'
    },
    sourceDir: {
      type: 'string',
      pattern: '\S*',
      default: 'src'
    },
    mainFlavor: {
      type: 'string',
      pattern: '\S*',
      default: 'main'
    },
    name: {
      type: 'string',
      pattern: '\S*',
    },
    preBuild: {
      type: 'string',
      pattern: '\S*',
    },
    version: {
      type: 'string',
      pattern: '^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:[\+][0-9A-Za-z-]+)?$',
    },
    author: {
      type: 'string',
      pattern: '\S*',
    },
    packageKey: {
      type: 'string',
      pattern: '\S*',
    },
    packageReference: {
      type: 'string',
      pattern: '\S*',
    }
  }
}
