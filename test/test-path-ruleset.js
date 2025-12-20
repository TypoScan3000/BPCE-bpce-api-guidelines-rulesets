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

describe('path', function () {
  linterTestSuite.initialize()

  function checkPathsFound () {
    it('should check paths', function () {
      const document = {
        openapi: '3.0.3',
        paths: {}
      }
      const expectedPaths = [
        ['paths']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('path-no-trailing-slash', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if no path ends with trailing slash', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/valid/path': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a path ends with a trailing slash', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/invalid/path/': {},
          '/': {}
        }
      }
      const errorPaths = [
        ['paths', '/some/invalid/path/'],
        ['paths', '/']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-no-query-parameter', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if no path contains no query parameter', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/valid/path': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a path contains a query parameter', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/invalid/path?with=query': {}
        }
      }
      const errorPaths = ['paths', '/some/invalid/path?with=query']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-lower-camel-case', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if path is lowerCamelCased', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/validPath': {},
          '/someValid/path': {},
          '/someValidPath': {},
          '/some/{someId}/path': {},
          '/v1/some/{someId}/path': {},
          '/v1/someValidPath': {},
          '/v1/deliveryPoints/{deliveryPointId}/departments': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a path is not lowerCamelCased', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some-invalid/path': {},
          '/some/invalid_path': {},
          '/someINVALID/path': {}

        }
      }
      const errorPaths = [
        ['paths', '/some-invalid/path'],
        ['paths', '/some/invalid_path'],
        ['paths', '/someINVALID/path']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-valid-structure', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if path structure is valid', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/resources': {},
          '/pies/{id}': {},
          '/resources/{id}/pies': {},
          '/resources/{id}/books/{id}': {},
          '/users/me': {},
          '/users/me/accounts': {},
          '/users/me/accounts/{id}': {},
          '/users/me/accounts/{id}/subresources': {},
          '/transactions/search': {},
          '/transactions/latest': {},
          '/clients/{clientId}/cards/{cardId}/{expirationDate}': {},
          '/clients/{clientId}/cards/{cardId}/{expirationDate}/cardControls': {},
          '/terms/current': {},
          '/users/{id}/parents/me': {},
          '/users/{id}/parents/ME': {}, // this is not beautiful, but the rule only cares about structure and is case insensitive.
          '/accounts/{accountId}/balances/current': {},
          '/accounts/{id}/transactions/latest': {},
          '/accounts/{id}/transactions/search': {},
          '/v1/customers': {}, // avoiding to trigger error, having basepath in path is checked in basepath ruleset
          '/name/v1/customers': {} // avoiding to trigger error, having basepath in path is checked in basepath ruleset
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if path structure is invalid', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/collection/something': {}, // invalid because resourcename should be plural
          '/collection/something/{id}': {}, // invalid because resourcename still not plural
          '/{id}': {} // invalid because no resourcename to qualify id.
        }
      }
      const errorPaths = [
        ['paths', '/collection/something'],
        ['paths', '/collection/something/{id}'],
        ['paths', '/{id}']]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('path-composite-key', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPathsFound()

    it('should return no error if no composite key is found', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/resources': {},
          '/pies/{id}': {},
          '/resources/{id}/pies': {},
          '/resources/{id}/books/{id}': {},
          '/users/me': {},
          '/users/me/accounts': {},
          '/users/me/accounts/{id}': {},
          '/users/me/accounts/{id}/subresources': {},
          '/transactions/search': {},
          '/transactions/latest': {},
          '/terms/current': {},
          '/users/{id}/parents/me': {},
          '/users/{id}/parents/ME': {}, // this is not beautiful, but the rule only cares about structure and is case insensitive.
          '/accounts/{accountId}/balances/current': {},
          '/accounts/{id}/transactions/latest': {},
          '/accounts/{id}/transactions/search': {},
          '/v1/customers': {}, // avoiding to trigger error, having basepath in path is checked in basepath ruleset
          '/name/v1/customers': {} // avoiding to trigger error, having basepath in path is checked in basepath ruleset
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return a warning if composite key is found', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/clients/{clientId}/cards/{cardId}/{expirationDate}': {},
          '/clients/{clientId}/cards/{cardId}/{expirationDate}/cardControls': {}
        }
      }
      const errorPaths = [
        ['paths', '/clients/{clientId}/cards/{cardId}/{expirationDate}'],
        ['paths', '/clients/{clientId}/cards/{cardId}/{expirationDate}/cardControls']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('request-support-json-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should return no error if there is a json content', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/invalid/path/': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if there is no json content', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          '/some/invalid/path/': {
            post: {
              requestBody: {
                content: {
                  'application/xml': {
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/invalid/path/', 'post', 'requestBody', 'content']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  /*
  * @TODO complete tests to improve coverage
  */
  describe('path-number-of-sub-resource-levels', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('path-number-of-paths', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  linterTestSuite.finalize()
})
