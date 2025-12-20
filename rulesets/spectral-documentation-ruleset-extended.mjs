import ruleset from './imported/spectral-documentation-ruleset.mjs'
import {
  pattern,
  schema,
  truthy,
  length
} from '@stoplight/spectral-functions'
import { oas2, oas3 } from '@stoplight/spectral-formats'

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
    DescribableObjects: {
      description: 'All objects that should be described.',
      /**
       * WARNING : The DescribableObjects alias is slightly modified from the original to incorporate
       * '$.components.schemas[*].properties[*]' as an additional JSONPath in the OAS3 format.
       */
      targets: [
        {
          formats: [oas2],
          given: [
            '$.info',
            '$.tags[*]',
            '#OperationObject',
            '#OperationObject.responses[*]',
            '#PathItem.parameters[?(@ && @.in)]',
            '#OperationObject.parameters[?(@ && @.in)]',
            '$.definitions[*]'
          ]
        },
        {
          formats: [oas3],
          given: [
            '$.info',
            '$.tags[*]',
            '#OperationObject',
            '#OperationObject.responses[*]',
            '#PathItem.parameters[?(@ && @.in)]',
            '#OperationObject.parameters[?(@ && @.in)]',
            '$.components.schemas[*]',
            '$.components.schemas[*].properties[*]'
          ]
        }
      ]
    }
  },
  rules: {
    ...ruleset.rules,
    'docs-tags': {
      ...ruleset.rules['docs-tags'],
      formats: [oas2, oas3],
      severity: DiagnosticSeverity.Error
    },
    'docs-info-contact': {
      ...ruleset.rules['docs-info-contact'],
      formats: [oas2, oas3],
      severity: DiagnosticSeverity.Error
    },
    'docs-description': {
      ...ruleset.rules['docs-description'],
      severity: DiagnosticSeverity.Error,
      extensions: {
        since: '2024-01-01',
        justification: 'Providing meaningful information about an API in a very synthetic way is crucial. Each describable object must have a description with more than 3 characters, starting with an UpperCase and ending with a period.',
        tags: [
          'info', 'documentation'
        ]
      },
      then: [
        {
          field: 'description',
          function: truthy
        },
        {
          field: 'description',
          function: length,
          functionOptions: {
            min: 3
          }
        },
        {
          field: 'description',
          function: pattern,
          functionOptions: {
            match: '^(#+ )?[A-Z]'
          }
        },
        {
          field: 'description',
          function: pattern,
          functionOptions: {
            match: '\\.$ || |$'
          }
        }
      ]
    },
    'docs-description-length': {
      message: '{{error}}.',
      description: 'Please make an effort to provide a description that is a bit more complete.',
      severity: DiagnosticSeverity.Warning,
      extensions: {
        since: '2024-01-01',
        justification: 'While we may accept that on some descriptions, like trivial HTTP responses, a short description could suffice, we consider that 10 chars is the bare acceptable minimum in general situations.',
        tags: [
          'info', 'documentation'
        ]
      },
      given: '#DescribableObjects',
      then: [
        {
          field: 'description',
          function: length,
          functionOptions: {
            min: 10
          }
        }
      ]
    },
    'docs-model-example': {
      message: 'No example provided for {{property}}.',
      description: 'Without providing an example for each property, an API consumer will have a hard time knowing how to interact with this API.',
      severity: DiagnosticSeverity.Error,
      formats: [oas3],
      given: '$.components.schemas[*].properties[*]',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            anyOf: [
              { required: ['example'] },
              { required: ['examples'] },
              { required: ['enum'] }
            ]
          }
        }
      }
    }
  }
}

export {
  overrideBaseRuleset as default
}
