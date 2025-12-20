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

/**
 * There is no need to repeat all the tests that are already performed one level
 * below with all the included files - what is important however is that the main-businessapi-release file
 * remains a consolidating file, without any actual rule declaration : just some extends and overrides, nothing else.
 */
describe('public-api', function () {
  linterTestSuite.initialize()

  describe('public-basepath-pattern-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should return no error if servers url is defined and follows the pattern', async function () {
      const document = {
        openapi: '3.0.3',
        servers: [
          { url: 'https://api{environment}groupebpce.com/{domain}{brand}machinTruc/v1' },
          { url: 'https://api{environment}groupebpce.com/{domain}machinTruc/v1' }
        ]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if servers url is not compliant', async function () {
      const document = {
        openapi: '3.0.3',
        servers: [
          { url: 'https://api.groupebpce.com/{domain}/{brand}machinTruc/v1' },
          { url: 'https://api{environment}groupebpce.com/{domain}{brand}machinTruc/v1' },
          { url: 'http://api.groupebpce.com/machinTruc/v1' },
          { url: 'https://api.groupebpce.com/{domain}/{brand}machinTruc' }
        ]
      }
      const errorPaths = [
        ['servers', '0', 'url'],
        ['servers', '2', 'url'],
        ['servers', '3', 'url']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })
})
