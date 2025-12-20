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

describe('extensions', function () {
  linterTestSuite.initialize()

  describe('extensions-authorized', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when encountering an extension that is allowed', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-id': 'AOO3',
          'x-business-exposure': true,
          'x-interop-exposure': true,
          'x-internal-exposure': true,
          'x-business-keywords': ['Something', 'SomethingElse']
        },
        paths: {
          'x-public': true,
          somePath: {
            get: {
              'x-internal': true,
              parameters: {
                'X-Correlation-Id': {
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if an unexpected extension is present', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-id': 'AOO3'
        },
        paths: {
          'x-biniou': {

          },
          somePath: {
            get: {
              parameters: {
                'X-Correlation-Id': {

                }
              },
              'x-restlab-machin': ['a', 'b']
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'x-biniou'],
        ['paths', 'somePath', 'get', 'x-restlab-machin']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-unique-id-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when encountering the unique ID', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-id': 'AOO3'
        },
        paths: {
          'x-public': true,
          somePath: {
            get: {
              'x-internal': true,
              parameters: {
                'X-Correlation-Id': {
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if no internal id is present', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0'
        }
      }
      const errorPaths = [
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if internal id format is bad', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-id': '$*8888888888888'
        }
      }
      const errorPaths = [
        ['info', 'x-internal-id']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-exposure-type', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when exposure tags are boolean', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-exposure': true,
          'x-interop-exposure': true,
          'x-internal-exposure': true
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if an exposure tag is not typed correctly', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-id': 'AOO3',
          'x-business-exposure': 'true',
          'x-interop-exposure': 1,
          'x-internal-exposure': false
        }
      }
      const errorPaths = [
        ['info', 'x-business-exposure'],
        ['info', 'x-interop-exposure'],
        ['info', 'x-internal-exposure']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-exposure-required', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when one of the three exposure tags is present', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-exposure': true
        },
        paths: {
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error when one or more of the three exposure tags is present (double-exposure case)', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-exposure': true,
          'x-interop-exposure': true
        },
        paths: {
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if no exposure tag is present', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-id': 'AOO3'
        },
        paths: {
        }
      }
      const errorPaths = [
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-interop-requires-xtitle', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when x-title is present on an interop API', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': true,
          'x-title': 'something'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if x-title is absent on an interop API', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': 1
        }
      }
      const errorPaths = [
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-xtitle-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when x-title content is ok', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': true,
          'x-title': 'something'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if x-title format is bad', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': true,
          'x-title': 'Something With Spaces, over the limit'
        }
      }
      const errorPaths = [
        ['info', 'x-title']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-business-keywords', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when x-business-keywords content is ok', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-keywords': ['Word', 'AnotherWord']
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if x-business-keywords is empty', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-keywords': []
        }
      }
      const errorPaths = [
        ['info', 'x-business-keywords']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if x-business-keywords format is not array', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-keywords': 'Word'
        }
      }
      const errorPaths = [
        ['info', 'x-business-keywords']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if x-business-keywords array items are not string', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-keywords': [true]
        }
      }
      const errorPaths = [
        ['info', 'x-business-keywords', '0']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if x-business-keywords array items are not string', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-business-keywords': ['Word', 134]
        }
      }
      const errorPaths = [
        ['info', 'x-business-keywords', '1']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-domain', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when x-domain is ok', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-domain': 'retail'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if x-domain is not a recognized value', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': true,
          'x-domain': 'biniou'
        }
      }
      const errorPaths = [
        ['info', 'x-domain']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-domain-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when encountering the x-domain tag', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-domain': 'retail'
        },
        paths: {
          'x-public': true,
          somePath: {
            get: {
              'x-domain': true,
              parameters: {
                'X-Correlation-Id': {
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return a warning if no domain is present', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0'
        }
      }
      const errorPaths = [
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-internal-access-level', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when x-internal-access-level content is ok', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-access-level': 'SOMETHING'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if x-internal-access-level format is bad', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': true,
          'x-internal-access-level': 'Something With Spaces, over the limit'
        }
      }
      const errorPaths = [
        ['info', 'x-internal-access-level']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('extensions-internal-access-level-implies-internal', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error when x-internal-exposure is present', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-internal-exposure': true,
          'x-internal-access-level': 'SOMETHING'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if x-internal-exposure is missing', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0',
          'x-interop-exposure': true,
          'x-internal-access-level': 'SOMETHING'
        }
      }
      const errorPaths = [
        ['info']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
