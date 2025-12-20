import ruleset from './imported/owasp-ruleset.mjs'

import { oas2, oas3_0, oas3_1 } from '@stoplight/spectral-formats' // eslint-disable-line

/**
 * Warning - The block below seems weird and much more cumbersome than a simple
 * "import {DiagnosticSeverity} from '@stoplight/types'" which would be the correct way.
 * Unfortunately the VSCode Spectral plugin fails miserably with the normal import, which
 * is why we end up with this horrible hack. Until this is resolved, we will have to
 * live with that.
 */
let DiagnosticSeverity;
(function (DiagnosticSeverity2) {
  DiagnosticSeverity2[DiagnosticSeverity2.Error = 0] = 'Error'
  DiagnosticSeverity2[DiagnosticSeverity2.Warning = 1] = 'Warning'
  DiagnosticSeverity2[DiagnosticSeverity2.Information = 2] = 'Information'
  DiagnosticSeverity2[DiagnosticSeverity2.Hint = 3] = 'Hint'
})(DiagnosticSeverity || (DiagnosticSeverity = {}))

const overrideBaseRuleset = {
  ...ruleset,
  aliases: {
    ...ruleset.aliases,
    ArrayProperties: {
      targets: [
        {
          formats: [oas2, oas3_0], // eslint-disable-line
          given: [
            // Check for type: 'array'
            '$..[?(@ && @.type=="array" && !@.readOnly==true)]'
          ]
        },
        {
          formats: [oas3_1], // eslint-disable-line
          given: [
            // Still check for type: 'array'
            '$..[?(@ && @.type=="array" && !@.readOnly==true)]',
            // also check for type: ['array', ...]
            '$..[?(@ && @.type && @.type.constructor.name === "Array" && @.type.includes("array"))]'
          ]
        }
      ]
    },
    IntegerProperties: {
      targets: [
        {
          formats: [oas2, oas3_0], // eslint-disable-line
          given: [
            // Check for type: 'string'
            '$..[?(@ && @.type=="integer" && !@.readOnly==true)]'
          ]
        },
        {
          formats: [oas3_1], // eslint-disable-line
          given: [
            // Still check for type: 'integer'
            '$..[?(@ && @.type=="integer" && !@.readOnly==true)]',
            // also check for type: ['integer', ...]
            '$..[?(@ && @.type && @.type.constructor.name === "Array" && @.type.includes("integer"))]'
          ]
        }
      ]
    },
    StringProperties: {
      targets: [
        {
          formats: [oas2, oas3_0], // eslint-disable-line
          given: [
            // Check for type: 'string'
            '$..[?(@ && @.type=="string" && !@.readOnly==true)]'
          ]
        },
        {
          formats: [oas3_1], // eslint-disable-line
          given: [
            // Still check for type: 'string'
            '$..[?(@ && @.type=="string" && !@.readOnly==true)]',
            // also check for type: ['string', ...]
            '$..[?(@ && @.type && @.type.constructor.name === "Array" && @.type.includes("string"))]'
          ]
        }
      ]
    }
  },
  rules: {
    ...ruleset.rules,
    'owasp:api2:2023-no-credentials-in-url': {
      ...ruleset.rules['owasp:api2:2023-no-credentials-in-url'],
      extensions: {
        since: '2024-01-01',
        justification: 'As URL parameters are visible to eavesdroppers, they must never contain security secrets such as client ID, API key, passwords, secrets or tokens.',
        tags: [
          'owasp', 'security'
        ]
      },
      description: 'URL parameters MUST NOT contain credentials such as API key, password, or secret.'
    },
    'owasp:api2:2023-auth-insecure-schemes': {
      ...ruleset.rules['owasp:api2:2023-auth-insecure-schemes'],
      extensions: {
        since: '2024-01-01',
        justification: 'NTLM and OAuth1 are considered unsecure and obsolete. They must NOT be used.',
        tags: [
          'owasp', 'security'
        ]
      },
      description: 'Unsecure protocols like NTLM and OAuth1 must NOT be used.'
    },
    'owasp:api2:2023-write-restricted': {
      ...ruleset.rules['owasp:api2:2023-write-restricted'],
      extensions: {
        since: '2024-01-01',
        justification: 'All write operations - POST, PUT, PATCH, DELETE - must be secured by at least one security scheme. Security schemes are defined in the `securityScheme` section then referenced in the `security` key at the global or operation levels.',
        tags: [
          'owasp', 'security'
        ]
      },
      description: 'All write operations -POST, PUT, PATCH, DELETE- must be secured by at least one security scheme.'
    },
    'owasp:api2:2023-read-restricted': {
      ...ruleset.rules['owasp:api2:2023-read-restricted'],
      extensions: {
        since: '2024-01-01',
        justification: 'All read operations - GET, HEAD - must be secured by at least one security scheme. Security schemes are defined in the `securityScheme` section then referenced in the `security` key at the global or operation levels.',
        tags: [
          'owasp', 'security'
        ]
      },
      description: 'All read operations - GET, HEAD - should be secured by at least one security scheme.'
    },
    'owasp:api5:2023-admin-security-unique': {
      ...ruleset.rules['owasp:api5:2023-admin-security-unique'],
      extensions: {
        since: '2024-01-01',
        justification: 'An /admin endpoint must not be exposed to clients. This is considered a high privilege operation.',
        tags: [
          'owasp', 'security'
        ]
      },
      description: 'Do not expose a /admin endpoint to clients.'
    },
    'owasp:api7:2023-concerning-url-parameter': {
      ...ruleset.rules['owasp:api7:2023-concerning-url-parameter'],
      extensions: {
        since: '2024-01-01',
        justification: 'An /admin endpoint must not be exposed to clients. This is considered a high privilege operation.',
        tags: [
          'owasp', 'security'
        ]
      },
      documentationUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa7-server-side-request-forgery/',
      description: 'Using external resource based on user input for webhooks, file fetching from URLs, custom SSO, URL previews, or redirects, can lead to a wide variety of security issues.'
    },
    'owasp:api8:2023-define-cors-origin': {
      ...ruleset.rules['owasp:api8:2023-define-cors-origin'],
      extensions: {
        since: '2024-01-01',
        justification: 'Cross Origin Resource Sharing is a complex problem that may cause security issues if not managed properly. When in doubt, consult your Security Officer.',
        tags: [
          'owasp', 'security'
        ]
      },
      documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
      description: 'Setting up CORS headers will control which websites can make browser-based HTTP requests to your API, using either the wildcard "*" to allow any origin, or "null" to disable any origin. Alternatively you can use "Access-Control-Allow-Origin: https://example.com" to indicate that only requests originating from the specified domain are allowed to access its resources.'
    },
    'owasp:api8:2023-no-scheme-http': {
      ...ruleset.rules['owasp:api8:2023-no-scheme-http'],
      extensions: {
        since: '2024-01-01',
        justification: 'Public APIs exposed over the internet must never be exposed over unprotected schemes.',
        tags: [
          'owasp', 'security'
        ]
      },
      documentationUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html',
      description: 'Server interactions must use the http protocol as it is inherently insecure and can lead to PII and other sensitive information being leaked through traffic sniffing or man-in-the-middle attacks. Use the https or wss schemes instead.'
    },
    'owasp:api8:2023-no-server-http': {
      ...ruleset.rules['owasp:api8:2023-no-server-http'],
      given: '$.servers.[?(@ && !@["x-internal"])].url',
      extensions: {
        since: '2024-01-01',
        justification: 'Public APIs exposed over the internet must never be exposed over unprotected schemes.',
        tags: [
          'owasp', 'security'
        ]
      },
      documentationUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html',
      description: 'Server interactions must use the http protocol as it is inherently insecure and can lead to PII and other sensitive information being leaked through traffic sniffing or man-in-the-middle attacks. Use the https or wss schemes instead.'
    },
    'owasp:api4:2023-array-limit': {
      ...ruleset.rules['owasp:api4:2023-array-limit'],
      extensions: {
        since: '2024-01-01',
        justification: 'A rule constraining array limit max size is pertinent on security only if the array is not a response, tagged as a readOnly.',
        tags: [
          'owasp', 'security'
        ]
      }
    }
  }
}

export {
  overrideBaseRuleset as default
}
