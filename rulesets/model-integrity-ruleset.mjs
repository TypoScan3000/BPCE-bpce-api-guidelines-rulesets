import { oas2, oas3 } from '@stoplight/spectral-formats'

import {
  createRulesetFunction
} from '@stoplight/spectral-core'

let DiagnosticSeverity;
(function (DiagnosticSeverity2) {
  DiagnosticSeverity2[DiagnosticSeverity2.Error = 0] = 'Error'
  DiagnosticSeverity2[DiagnosticSeverity2.Warning = 1] = 'Warning'
  DiagnosticSeverity2[DiagnosticSeverity2.Information = 2] = 'Information'
  DiagnosticSeverity2[DiagnosticSeverity2.Hint = 3] = 'Hint'
})(DiagnosticSeverity || (DiagnosticSeverity = {}))

/**
 * Recursive Function - pass a JSON subschema, and pick up all the declared
 * properties we can find directly under a tag called 'properties'. We need
 * to recurse from the root into anyOf, allOf, oneOf
 * @param {*} obj a Schema object or fragment in the OAS file
 * @param {*} array the array which gets recursively filled with property names
 * @returns
 */
function getAllPropNames (obj, array) {
  array = array || []
  if (typeof obj === 'object') {
    // Tail recursion: if it is a schema containing 'properties' we are good.
    if (obj.properties != null) {
      Object.keys(obj.properties).forEach(element => {
        array.push(element)
      })
    } else
    // or if the schema is of type array and contains an 'items' property, the tag can be declared as mandatory
      if (obj.items != null) {
        array.push('items')
      } else {
        if (obj.allOf != null) {
          obj.allOf.forEach(sub => {
            getAllPropNames(sub, array)
          })
        }
        if (obj.anyOf != null) {
          obj.anyOf.forEach(sub => {
            getAllPropNames(sub, array)
          })
        }
        if (obj.oneOf != null) {
          obj.oneOf.forEach(sub => {
            getAllPropNames(sub, array)
          })
        }
      }
    return array
  }
}

const checkInvalidRequired = createRulesetFunction(
  {
    input: {
      type: 'object'
    },
    options: null
  },
  function checkInvalidRequired (input, _options, context) {
    const path = context.path
    let results

    // Only inspect schema objects containing a required field array
    // We have been confused once by an API which was defining a real schema containing properties names "properties"
    // and "required", which caused the function to go crazy thinking it was dealing with a schema object.
    if (input.required != null && Array.isArray(input.required)) {
      // Capture all the properties defined in a table - there should be some properties avail
      // but we need to find them recursively
      const props = []
      getAllPropNames(input, props)

      // Now iterate over the required fields array
      for (const requiredProp of input.required) {
        if (props.indexOf(requiredProp) === -1) {
          results ??= []
          results.push({
            message: 'Bugger. Field not found',
            path: [...path, requiredProp]
          })
        }
      }
      return results
    }
  }
)

// src/ruleset.ts
const rulesetDefault = {
  formats: [oas2, oas3],

  aliases: {
    SchemaObjects: [
      '$..properties^',
      '$.components.schemas[*]',
      '$.definitions[*]',
      '$..anyOf[*]',
      '$..oneOf[*]',
      '$..allOf[*]'
    ]
  },
  rules: {

    /**
     * Problem Statement:
     *
     */
    'model-integrity-bad-required-attribute': {
      description: 'One of the required fields cannot be found in the list of declared properties. ',
      message: '{{description}}, {{path}}',
      severity: DiagnosticSeverity.Error,
      given: ['#SchemaObjects'],
      extensions: {
        since: '2024-12-15',
        justification: 'This is an integrity issue in the contract : One of the declared required fields does not exist, so the spec leads to an inconsistent construct.',
        tags: ['model', 'integrity']
      },
      then: [
        {
          function: checkInvalidRequired
        }
      ]
    }
  }
}
export {
  rulesetDefault as default
}
