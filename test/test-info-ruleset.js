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

describe('info', function () {
  linterTestSuite.initialize()

  describe('info-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if info is defined', async function () {
      const document = {
        openapi: '3.0.3',
        info: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if info is not defined', async function () {
      const document = {
        openapi: '3.0.3'
      }
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-name-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if API name is defined in info', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'some API name'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if no API name is not defined in info', async function () {
      const document = {
        openapi: '3.0.3',
        info: {}
      }
      const errorPaths = ['info']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-version', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if the version tag is SemVer compliant', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3.0'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if the version tag is not SemVer compliant', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          version: '1.3'
        }
      }
      const errorPaths = ['info', 'version']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-contact', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if contact structure is defined', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          contact: {}

        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if no contact structure is defined in info', async function () {
      const document = {
        openapi: '3.0.3',
        info: {}
      }
      const errorPaths = ['info']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('contact-properties', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if the contact structure is present and contains name url email', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          contact: {
            name: 'something',
            url: 'http://adopt-an-api.com/',
            email: 'inyourdreams@apis.com'
          }

        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if the contact structure is empty in info', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          contact: {}
        }
      }
      const errorPaths = ['info', 'contact']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-name-not-contain-api', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if the API name does not contain api', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'some name'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if the API name contains API', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Some API name'
        }
      }
      const errorPaths = ['info', 'title']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API name contains Api', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Some Api name'
        }
      }
      const errorPaths = ['info', 'title']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API name is API', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'API'
        }
      }
      const errorPaths = ['info', 'title']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-description-provided', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if API description is provided', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          description: 'some description'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if the API description is not provided', async function () {
      const document = {
        openapi: '3.0.3',
        info: {}
      }
      const errorPaths = ['info']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description is empty', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          description: ''
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-description-valid-content', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return an error if the API description starts with "this API"', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          description: 'this API allows to do something'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description starts with "cette API"', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          description: 'Cette API permet de faire des choses'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description starts contains "web service"', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          description: 'Some description talking about web services and a few other things'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description starts contains "API"', async function () {
      const document = {
        openapi: '3.0.3',
        info: {
          description: 'Some description talking about API and a few other things'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
