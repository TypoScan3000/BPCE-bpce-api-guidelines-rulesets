/*
 * Copyright 2019-2022 Groupe BPCE
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const linterTestSuite = require('./common/linter-test-suite.js')

describe('documentation', function () {
  linterTestSuite.initialize()

  describe('no-eval-in-markdown', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('no-script-tags-in-markdown', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('oas3-valid-media-example', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })
  describe('oas3-examples-value-or-externalValue', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })

  describe('oas3-valid-schema-example', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })
  describe('oas3-unused-component', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })

  describe('docs-api-host', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2, true)
  })
  describe('docs-api-schemes', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2, true)
  })

  describe('docs-api-servers', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })

  describe('docs-description', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should return error if description field have less than 3 characters', async function () {
      const document = {
        openapi: '3.0.1',
        paths: {
          '/some/path': {
            get: {
              description: 'OK',
              responses: {
                200: {
                  description: 'OK'
                }
              }
            }
          }
        }
      }

      const errorPaths = [
        ['paths', '/some/path', 'get', 'description'],
        ['paths', '/some/path', 'get', 'responses', '200', 'description']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return no error if description field have more than 3 characters', async function () {
      const document = {
        openapi: '3.0.1',
        paths: {
          '/some/path': {
            get: {
              description: 'Sho',
              responses: {
                200: {
                  description: 'Short'
                }
              }
            }
          }
        }
      }

      await this.linterTester.runAndCheckNoError(document)
    })
    it('should return an error if description field doesnt start with uppercase letter', async function () {
      const document = {
        openapi: '3.0.1',
        paths: {
          '/some/path': {
            get: {
              description: 'without upper letter',
              responses: {
                200: {
                  description: 'without upper letter'
                }
              }
            }
          }
        }
      }

      const errorPaths = [
        ['paths', '/some/path', 'get', 'description'],
        ['paths', '/some/path', 'get', 'responses', '200', 'description']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('docs-description-length', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('docs-info-contact', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('docs-parameters-anything-useful', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2, true)
  })

  describe('docs-parameter-examples-or-schema', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })

  describe('docs-media-type-examples-or-schema', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })

  describe('docs-operationId-valid-in-url', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('docs-tags', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('docs-operation-tags', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('contact-properties', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('docs-model-example', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  linterTestSuite.finalize()
})
