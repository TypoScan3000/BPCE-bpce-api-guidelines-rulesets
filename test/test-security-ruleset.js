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

describe('security', function () {
  linterTestSuite.initialize()

  describe('security-rules-defined-oas2', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2)

    it('should return no error if securityDefinitions is defined', async function () {
      const document = {
        swagger: '2.0',
        securityDefinitions: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if securityDefinitions is not defined', async function () {
      const document = {
        swagger: '2.0'
      }
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-rules-defined-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should return no error if securitySchemes is defined', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if components is not defined', async function () {
      const document = {
        openapi: '3.0.3'
      }
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if components.securitySchemes is not defined', async function () {
      const document = {
        openapi: '3.0.3',
        components: {}
      }
      const errorPaths = [
        ['components']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-types-authorized', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should check oas2 securityDefinitions', function () {
      const document = {
        swagger: '2.0',
        securityDefinitions: {
          definition: {}
        }
      }
      const expectedPaths = [
        ['securityDefinitions', 'definition']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 securitySchemes', function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {}
          }
        }
      }
      const expectedPaths = [
        ['components', 'securitySchemes', 'scheme']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if security type is oauth2', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            oauthScheme: {
              type: 'oauth2'
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if security type is not oauth2', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {
              type: 'not oauth2'
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'securitySchemes', 'scheme', 'type']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-definitions-oauth-scopes-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore non auth2 oas2 securityDefinitions', function () {
      const document = {
        swagger: '2.0',
        securityDefinitions: {
          definition: {
            type: 'nonOauth'
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non auth2 oas3 securitySchemes', function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {
              type: 'nonOauth'
            }
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check oas2 oauth2 security definitions scopes', function () {
      const document = {
        swagger: '2.0',
        securityDefinitions: {
          definition: {
            type: 'oauth2'
          }
        }
      }
      const expectedPaths = [
        ['securityDefinitions', 'definition']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 oauth2 security definitions scopes', function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {}
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['components', 'securitySchemes', 'scheme', 'flows', 'flow']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if scopes is defined and not empty', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {
                  scopes: {
                    scope: 'description'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if scopes is not defined', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'securitySchemes', 'scheme', 'flows', 'flow']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if scopes is empty', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {
                  scopes: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'securitySchemes', 'scheme', 'flows', 'flow', 'scopes']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-no-api-level', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if API level security is not defined', async function () {
      const document = {
        openapi: '3.0.3'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if API level security is defined', async function () {
      const document = {
        openapi: '3.0.3',
        security: {}
      }
      const errorPaths = [
        ['security']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-operation-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore path parameters and x-tension', function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          path: {
            parameters: [],
            'x-something': {}
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check all HTTP methods', function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          path: {
            get: {},
            post: {},
            put: {},
            patch: {},
            delete: {}
          }
        }
      }
      const expectedPaths = [
        ['paths', 'path', 'get'],
        ['paths', 'path', 'post'],
        ['paths', 'path', 'put'],
        ['paths', 'path', 'patch'],
        ['paths', 'path', 'delete']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if security is defined and not empty at operation level', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          path: {
            get: {
              security: [
                { scheme: [] }
              ]
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if security is not defined at operation level', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          path: {
            get: {}
          }
        }
      }
      const errorPaths = [
        ['paths', 'path', 'get']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if security is defined at operation level but empty', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          path: {
            get: {
              security: []
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'path', 'get', 'security']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  /**
   * TODO complete this -
   */
  describe('owasp:api1:2023-no-numeric-ids', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api2:2023-no-http-basic', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api2:2023-no-api-keys-in-url', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })
  describe('owasp:api2:2023-no-credentials-in-url', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)

    it('should return no error if query or path parameter is safe', async function () {
      const parameters = [
        { in: 'header', name: 'Token' },
        { in: 'query', name: 'something' },
        { in: 'path', name: 'bidule' }
      ]
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            parameters,
            somemethod: {
              parameters
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if query or path parameter contains a secret', async function () {
      const parameters = [
        { in: 'query', name: 'api-key' },
        { in: 'path', name: 'password' },
        { in: 'path', name: 'id_token' },
        { in: 'path', name: 'access_token' },
        { in: 'path', name: 'refresh_token' },
        { in: 'path', name: 'secret' }
      ]
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            parameters,
            somemethod: {
              parameters
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'parameters', '2', 'name'],
        ['paths', 'somepath', 'parameters', '3', 'name'],
        ['paths', 'somepath', 'parameters', '4', 'name'],
        ['paths', 'somepath', 'parameters', '5', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '2', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '3', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '4', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '5', 'name']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('owasp:api2:2023-auth-insecure-schemes', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })
  describe('owasp:api2:2023-short-lived-access-tokens', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api2:2023-write-restricted', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api2:2023-read-restricted', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api3:2023-no-additionalProperties', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas30, true)
  })
  describe('owasp:api3:2023-constrained-additionalProperties', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas30, true)
  })
  describe('owasp:api3:2023-no-unevaluatedProperties', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas31, true)
  })
  describe('owasp:api3:2023-constrained-unevaluatedProperties', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas31, true)
  })
  describe('owasp:api4:2023-array-limit', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return error (warn) if array limit is not set', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'array', schema: { type: 'array' } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array'
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'array'
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            array: {
              type: 'array'
            }
          }
        }
      }

      const errorPaths = [
        ['paths', 'somepath', 'get', 'parameters', '0', 'schema'],
        ['paths', 'somepath', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema'],
        ['components', 'schemas', 'array']
      ]

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, linterTestSuite.SEVERITY.warn)
    })

    it('should return no error if array behavior readOnly equal true', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        readOnly: true
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      readOnly: true
                    }
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if array limit is set', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'array', schema: { type: 'array', maxItems: '1' } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        maxItems: 1
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      maxItems: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if array limit is not set when behavior is "read-only"', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'array', schema: { type: 'array', maxItems: '1' } }
              ]
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('owasp:api4:2023-string-limit', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return error (warn) if string limit is not set', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'string', schema: { type: 'string' } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            string: {
              type: 'string'
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'get', 'parameters', '0', 'schema'],
        ['paths', 'somepath', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema'],
        ['components', 'schemas', 'string']
      ]
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, linterTestSuite.SEVERITY.warn)
    })

    it('should return no error if string limit is set', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'string', schema: { type: 'string', maxLength: '1' } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'string',
                        maxLength: 1
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string',
                      maxLength: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if string limit is not set when behavior is "read-only"', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'string', schema: { type: 'string', readOnly: true } }
              ]
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('owasp:api4:2023-string-restricted', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api4:2023-integer-limit', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas31, true)

    it('should return error (warn) if integer limit is not set', async function () {
      const document = {
        openapi: '3.1.0',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'integer', schema: { type: 'integer' } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'integer'
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'integer'
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            integer: {
              type: 'integer'
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'get', 'parameters', '0', 'schema'],
        ['paths', 'somepath', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema'],
        ['components', 'schemas', 'integer']
      ]
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, linterTestSuite.SEVERITY.error)
    })

    it('should return no error if integer limit is set', async function () {
      const document = {
        openapi: '3.1.0',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'integer', schema: { type: 'integer', minimum: 1, maximum: 10 } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 10
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'integer',
                      minimum: 1,
                      maximum: 10
                    }
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('owasp:api4:2023-integer-limit-legacy', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should return error (warn) if integer limit is not set', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'integer', schema: { type: 'integer' } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'integer'
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'integer'
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            integer: {
              type: 'integer'
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'get', 'parameters', '0', 'schema'],
        ['paths', 'somepath', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema'],
        ['components', 'schemas', 'integer']
      ]
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, linterTestSuite.SEVERITY.warn)
    })

    it('should return no error if integer limit is set', async function () {
      const document = {
        openapi: '3.0.3',
        paths: {
          somepath: {
            get: {
              parameters: [
                { in: 'query', name: 'integer', schema: { type: 'integer', minimum: 1, maximum: 10 } }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 10
                      }
                    }
                  }
                }
              }
            },
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'integer',
                      minimum: 1,
                      maximum: 10
                    }
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('owasp:api5:2023-admin-security-unique', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api7:2023-concerning-url-parameter', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('owasp:api8:2023-no-scheme-http', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2, true)
  })
  describe('owasp:api8:2023-no-server-http', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)

    it('should return no error if server url is https', async function () {
      const document = {
        openapi: '3.0.3',
        servers: [
          { url: 'https://example.com' }
        ]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if server url is http', async function () {
      const document = {
        openapi: '3.0.3',
        servers: [
          { url: 'http://example.com' }
        ]
      }
      const errorPaths = [
        ['servers', '0', 'url']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return no error if http url and x-internal present', async function () {
      const document = {
        openapi: '3.0.3',
        servers: [
          { url: 'http://example.com', 'x-internal': true }
        ]
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('owasp:api9:2023-inventory-environment', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, true)
  })
  describe('security-oauth2-scope-missing-reference-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)
  })
  describe('security-oauth2-toomany-schemes-defined-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)
  })
  describe('security-oauth2-types-authorized', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  linterTestSuite.finalize()
})
