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

describe('model', function () {
  linterTestSuite.initialize()

  function checkSchemasDefinitionsFound () {
    it('should check oas2 definitions', function () {
      const document = {
        swagger: '2.0',
        definitions: {}
      }
      const expectedPaths = [
        ['definitions']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 components.schemas', function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {}
        }
      }
      const expectedPaths = [
        ['components', 'schemas']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  function checkPropertiesFound () {
    it('should check oas2 definitions properties', function () {
      const document = {
        swagger: '2.0',
        definitions: {
          SomeDefinition: {
            properties: {}
          }
        }
      }
      const expectedPaths = [
        ['definitions', 'SomeDefinition', 'properties']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 components.schemas properties', function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            SomeDefinition: {
              properties: {}
            }
          }
        }
      }
      const expectedPaths = [
        ['components', 'schemas', 'SomeDefinition', 'properties']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check inner properties', function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeDefinition: {
            properties: {
              aProperty: {
                properties: {}
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['definitions', 'SomeDefinition', 'properties'],
        ['definitions', 'SomeDefinition', 'properties', 'aProperty', 'properties']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('schema-name-uppercamelcase', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkSchemasDefinitionsFound()

    it('should return no error if schema name is UpperCamelCased', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if schema name is not UpperCamelCased', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          someSchema: {},
          SOmeSchema: {},
          some_schema: {},
          SOMESCHEMA: {}
        }
      }
      const errorPaths = [
        ['definitions', 'someSchema'],
        ['definitions', 'SOmeSchema'],
        ['definitions', 'some_schema'],
        ['definitions', 'SOMESCHEMA']
      ]
      // Note: you can check multiple paths with const errorsPaths = [ ["one", "path"], ["another", "path"] ]
      // TODO The expected severity
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('schema-name-no-number', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkSchemasDefinitionsFound()

    it('should return no error if schema name contains no number', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if schema name contains a number', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {}, // no error
          Some1Schema: {}, // error
          SomeSchema1: {} // error
        }
      }
      const errorPaths = [
        ['definitions', 'Some1Schema'],
        ['definitions', 'SomeSchema1']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('schema-name-no-technical-prefix-suffix', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkSchemasDefinitionsFound()

    it('should return no error if model name contains no technical suffix or prefix', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if model name contains technical suffix or prefix', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchemaDto: {},
          SomeSchemaDTO: {},
          SomeSchemaDtos: {},
          DtoExample: {},
          DtosExample: {}
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchemaDto'],
        ['definitions', 'SomeSchemaDTO'],
        ['definitions', 'SomeSchemaDtos'],
        ['definitions', 'DtoExample'],
        ['definitions', 'DtosExample']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('schema-no-type-declaration', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if schema contains a type', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            type: 'object'
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if schema has no type', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          someSchema: {}
        }
      }
      const errorPaths = [
        ['definitions', 'someSchema']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-name-lowercamelcase', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPropertiesFound()

    it('should return no error if property name is lowerCamelCased or is _links', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {},
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if property name is not lowerCamelCased', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              SomeProperty: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  AnotherProperty: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'SomeProperty'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'AnotherProperty']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-name-no-number', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPropertiesFound()

    it('should return no error if property name contains no number', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {},
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if property name contains a number', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              someProperty1: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'someProperty1'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'another1Property']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return test', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeDefinition: {
            properties: {
              aProperty: {
                properties: {
                  notional2: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeDefinition', 'properties', 'aProperty', 'properties', 'notional2']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-bad-ref', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if property is a $ref', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {
                $ref: '#/definitions/AnotherSchema'
              },
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if property has a ref definition', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {
                ref: '#/definitions/AnotherSchema'
              }
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'someProperty', 'ref']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-name-no-technical-prefix-suffix', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkPropertiesFound()

    it('should return no error if property name contains no technical suffix or prefix', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {},
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if property name technical suffix or prefix', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            properties: {
              somePropertyDto: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  dtoAnotherProperty: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'somePropertyDto'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'dtoAnotherProperty']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('model-empty-required', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should check oas2 definitions', function () {
      const document = {
        swagger: '2.0',
        definitions: {
          SomeDefinition: {
            type: 'object'
          }
        }
      }
      const expectedPaths = [
        ['definitions', 'SomeDefinition']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 components.schemas', function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            SomeDefinition: {
              type: 'object'
            }
          }
        }
      }
      const expectedPaths = [
        ['components', 'schemas', 'SomeDefinition']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if model has required properties, is of type string or array', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            type: 'object',
            required: [
              'someRequiredProperty'
            ]
          },
          SomeOtherSchema: {
            type: 'object',
            allOf: [

            ]
          },
          SomeArray: {
            type: 'array'
          },
          SomeElementaryType: {
            type: 'string'
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an info if model has empty required or no required', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SchemaWithoutRequired: {
            type: 'object'
          },
          SchemaWithEmptyRequired: {
            type: 'object',
            required: []
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SchemaWithoutRequired'],
        ['definitions', 'SchemaWithEmptyRequired', 'required']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('model-integrity-bad-required-attribute', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if no required tag is found', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            type: 'object'
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should not complain if a required tag can be found amongst the properties of an object or an array', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            SomeSchema: {
              type: 'object',
              properties: {
                p1: {},
                p2: {}
              },
              required: ['p1']
            },
            SomeArray: {
              type: 'array',
              items: {},
              required: [
                'items'
              ]
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should complain if required field does not exist in the list of declared properties', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          SomeSchema: {
            type: 'object',
            properties: {
              p1: {},
              p2: {}
            },
            required: ['p3']
          },
          SomeArray: {
            type: 'array',
            items: {},
            required: [
              'item'
            ]
          }
        },
        components: {
          schemas: {
            SomeSchema: {
              type: 'object',
              properties: {
                p1: {},
                p2: {}
              },
              required: ['p1']
            },
            SomeArray: {
              type: 'array',
              items: {},
              required: [
                'items'
              ]
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema'],
        ['definitions', 'SomeArray']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should complain when exploring nested definitions that have a bad required field', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            SomeSchema: {
              type: 'object',
              properties: {
                p1: {},
                p2: {
                  properties: {
                    p3: {},
                    p4: {}
                  },
                  required: ['p5']
                }
              }
            },
            SomeArray: {
              type: 'array',
              items: {
                properties: {
                  p6: {},
                  p7: {}
                },
                required: ['p8']
              }
            },
            required: [
              'items'
            ]
          }
        }
      }
      const errorPaths = [
        ['components', 'schemas', 'SomeSchema', 'properties', 'p2'],
        ['components', 'schemas', 'SomeArray', 'items']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('model-remove-composition-operator-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should return no error if a oneOf/allOf/anyOf has more than one entry', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            SomeSchema: {
              properties: {
                someProperty: {
                  oneOf: [
                    {
                      type: 'string'
                    },
                    {
                      type: 'number'
                    }
                  ]
                },
                anotherProperty: {
                  anyOf: [
                    {

                    },
                    {

                    }
                  ]
                }
              }
            },
            AnotherSchema: {
              allOf: [{
                properties: {
                  someProperty: {
                    type: 'object',
                    properties: {
                      anotherProperty: {},
                      _links: {}
                    }
                  }
                }
              },
              {
                properties: {
                  somethingElse: {}
                }
              }]
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if there is a allOf/oneOf/anyOf with just one entry', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            SomeSchema: {
              properties: {
                someProperty: {
                  oneOf: [
                    {
                      type: 'string'
                    }
                  ]
                },
                anotherProperty: {
                  anyOf: [
                    {

                    }
                  ]
                }
              }
            },
            AnotherSchema: {
              allOf: [{
                properties: {
                  someProperty: {
                    type: 'object',
                    properties: {
                      anotherProperty: {},
                      _links: {}
                    }
                  }
                }
              }]
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'schemas', 'SomeSchema', 'properties', 'someProperty', 'oneOf'],
        ['components', 'schemas', 'SomeSchema', 'properties', 'anotherProperty', 'anyOf'],
        ['components', 'schemas', 'AnotherSchema', 'allOf']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
