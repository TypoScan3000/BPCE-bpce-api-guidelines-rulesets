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

describe('datatypes', function () {
  linterTestSuite.initialize()

  /**
   * TODO complete these unit tests
   */
  describe('datatypes-upper-case-enums', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if enum is uppercase', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'string',
                    enum: [
                      'SOMETHING_ELSE1',
                      'ENUM_VAL'
                    ]
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if enum is not uppercase', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'string',
                    enum: [
                      'something',
                      'ENUM_VAL'
                    ]
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'another1Property', 'enum', '0']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('duplicated-entry-in-enum', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain in absence of duplicate values', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'string',
                    enum: [
                      'SOMETHING_ELSE1',
                      'ENUM_VAL'
                    ]
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if duplicate enum value is found', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'string',
                    enum: [
                      'SEE_ME',
                      'ENUM_VAL',
                      'SEE_ME'
                    ]
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'another1Property', 'enum']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })
  describe('typed-enum', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })
  describe('datatypes-boolean-must-not-be-nullable', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain with a normal boolean declaration', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'boolean'
                  },
                  yetAnotherProperty: {
                    type: 'boolean',
                    nullable: false
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if nullable is set to true for a boolean', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'boolean',
                    nullable: true
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'another1Property', 'nullable']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })
  describe('datatypes-boolean-must-begin-with-is', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain with a well-named boolean declaration or a non-boolean', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  isProperty: {
                    type: 'boolean'
                  },
                  hasProperty: {
                    type: 'boolean'
                  },
                  canDoSomething: {
                    type: 'boolean'
                  },
                  issuer: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if boolean is badly named', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {
                    type: 'boolean'
                  },
                  isbadlyCapitalized: {
                    type: 'boolean'
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'another1Property'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'isbadlyCapitalized']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-datetype-must-end-with-date', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain with a well-named date declaration', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  someDate: {
                    type: 'string',
                    format: 'date'
                  },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date'
                  },
                  date: {
                    type: 'string',
                    format: 'date'
                  },
                  dateless: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if date is badly named', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  dateDeDebut: {
                    type: 'string',
                    format: 'date'
                  },
                  propertyDatetime: {
                    type: 'string',
                    format: 'date'
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'dateDeDebut'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'propertyDatetime']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-datetype-must-have-date-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain with a well-named date declaration', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  someDate: {
                    type: 'string',
                    format: 'date',
                    example: '2024-07-30'
                  },
                  someRandomAttributeThatMayLookLikeADateButIsNot: {
                    type: 'string',
                    example: '2024073009'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if example is typical of a date format, either in natural form or in ISO8601', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  dateDeDebut: {
                    type: 'string',
                    example: '2024-07-20'
                  },
                  propertyWithWrongFormat: {
                    type: 'string',
                    example: '20/07/2024'
                  },
                  anotherHiddenDateWithWrongFormat: {
                    type: 'string',
                    example: '20240720'
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'dateDeDebut', 'example'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'propertyWithWrongFormat', 'example'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anotherHiddenDateWithWrongFormat', 'example']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-datetimetype-must-end-with-datetime', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain with a well-named datetime declaration', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  someDateTime: {
                    type: 'string',
                    format: 'date-time'
                  },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date'
                  },
                  dateTime: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if datetime is badly named', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  dateDeDebut: {
                    type: 'string',
                    format: 'date-time'
                  },
                  propertyDateTime: {
                    type: 'string',
                    format: 'date'
                  },
                  propertyDatetime: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'dateDeDebut'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'propertyDatetime']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-boolean-must-not-end-with-indicator', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
    it('should not complain with a boolean declaration that does not end with indicator', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  someboolean: {
                    type: 'boolean'
                  },
                  isActive: {
                    type: 'boolean'
                  },
                  somethingNotBooleanCalledIndicator: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if boolean ends with indicator', async function () {
      const document = {
        openapi: '3.0.3',
        definitions: {
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  isBooleanIndicator: {
                    type: 'boolean'
                  },
                  indicator: {
                    type: 'boolean'
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'isBooleanIndicator'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'indicator']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-missing-integer-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if an integer has a format', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someIntegerProperty: {
                  type: 'integer',
                  format: 'biniou'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })

  describe('datatypes-missing-number-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if a number has a format', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someNumberProperty: {
                  type: 'number',
                  format: 'biniou'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('datatypes-incorrect-integer-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if an integer has a valid format', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someIntegerProperty: {
                  type: 'integer',
                  format: 'int32'
                },
                someHugeIntegerProperty: {
                  type: 'integer',
                  format: 'int64'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })
  describe('datatypes-incorrect-number-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if a number has a valid format', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someNumberProperty: {
                  type: 'number',
                  format: 'float'
                },
                someHugeNumberProperty: {
                  type: 'number',
                  format: 'double'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })

  describe('datatypes-incorrect-string-format', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain if a string has a recognized format', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someDate: {
                  type: 'string',
                  format: 'date'
                },
                someDateTime: {
                  type: 'string',
                  format: 'date-time'
                },
                someTime: {
                  type: 'string',
                  format: 'time'
                },
                aDuration: {
                  type: 'string',
                  format: 'duration'
                },
                anEmail: {
                  type: 'string',
                  format: 'email'
                },
                anUuid: {
                  type: 'string',
                  format: 'uuid'
                },
                anUri: {
                  type: 'string',
                  format: 'uri'
                },
                aPassword: {
                  type: 'string',
                  format: 'password'
                },
                aBinaryStruct: {
                  type: 'string',
                  format: 'binary'
                },
                aBase64EncodedThing: {
                  type: 'string',
                  format: 'byte'
                },
                aUriReference: {
                  type: 'string',
                  format: 'uri-reference'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })
  })

  describe('datatypes-illegal-numeric-qualifier', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain with any of the legal qualifiers for a number/integer', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someIntegerProperty: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 100,
                  exclusiveMinimum: true,
                  exclusiveMaximum: true
                },
                someNumberProperty: {
                  type: 'number',
                  minimum: -1.0,
                  maximum: 100.0,
                  exclusiveMinimum: true,
                  exclusiveMaximum: true
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a string or an array declares minimum, maximum, exclusiveMinimum, exclusiveMaximim', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          parameters: {
            aParam: {
              schema: {
                type: 'string',
                minimum: 'A'
              }
            }
          },
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'object',
                  properties: {
                    anArray: {
                      type: 'array',
                      minimum: 1,
                      maximum: 10
                    },
                    aString: {
                      type: 'string',
                      minimum: 'A',
                      exclusiveMinimum: true
                    },
                    aSecondString: {
                      type: 'string',
                      maximum: 'Z',
                      exclusiveMaximum: true
                    }
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'parameters', 'aParam', 'schema', 'minimum'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anArray', 'minimum'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anArray', 'maximum'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aString', 'minimum'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aString', 'exclusiveMinimum'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aSecondString', 'maximum'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aSecondString', 'exclusiveMaximum']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-illegal-string-qualifier', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain with any of the legal qualifiers for a string', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'string',
                  format: 'uri',
                  minLength: 1,
                  maxLength: 20,
                  pattern: '^[a-zA-Z0-9]+$',
                  default: 'https://localhost'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a number, integer or an array declares minLength, maxLength or pattern', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          parameters: {
            aParam: {
              schema: {
                type: 'integer',
                minLength: 1,
                maxLength: 10
              }
            }
          },
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'object',
                  properties: {
                    anArray: {
                      type: 'array',
                      minLength: 1,
                      maxLength: 10
                    },
                    aNumber: {
                      type: 'number',
                      minLength: 1,
                      maxLength: 8,
                      pattern: '0000.00'
                    },
                    anInteger: {
                      type: 'integer',
                      minLength: 1,
                      maxLength: 8,
                      pattern: '0000'
                    }
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'parameters', 'aParam', 'schema', 'minLength'],
        ['components', 'parameters', 'aParam', 'schema', 'maxLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anArray', 'minLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anArray', 'maxLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aNumber', 'minLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aNumber', 'maxLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aNumber', 'pattern'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anInteger', 'minLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anInteger', 'maxLength'],
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'anInteger', 'pattern']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })
  describe('datatypes-illegal-array-qualifier', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('datatypes-illegal-array-decoration', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)
  })

  describe('datatypes-invalid-array-declaration', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not complain with a valid array declaration', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should trigger an error if an array declaration does not have the proper items declaration', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'array'
                },
                items: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-illegal-string-decoration-oas2', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2)

    it('should not complain with any of the legal qualifiers for a string', async function () {
      const document = {
        swagger: '2.0',
        definitions: {
          parameters: {
            aParam: {
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                minLength: 1,
                maxLength: 10
              }
            },
            anotherParam: {
              in: 'query',
              required: false,
              type: 'string'
            }
          },
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'string',
                  format: 'uri',
                  minLength: 1,
                  maxLength: 20,
                  pattern: '^[a-zA-Z0-9]+$',
                  default: 'https://localhost'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a string property declares a required array (yes, weve seen such cases)', async function () {
      const document = {
        swagger: '2.0',
        components: {
          parameters: {
            aParam: {
              type: 'string',
              required: true,
              in: 'path'
            }
          },
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'object',
                  properties: {
                    aString: {
                      type: 'string',
                      required: [
                        -'aString'
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aString']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('datatypes-illegal-string-decoration-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should not complain with any of the legal qualifiers for a string', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          parameters: {
            aParam: {
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                minLength: 1,
                maxLength: 10
              }
            }
          },
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'string',
                  format: 'uri',
                  minLength: 1,
                  maxLength: 20,
                  pattern: '^[a-zA-Z0-9]+$',
                  default: 'https://localhost'
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a string property declares a required array (yes, it happened)', async function () {
      const document = {
        openapi: '3.0.3',
        components: {
          parameters: {
            aParam: {
              required: true,
              in: 'path',
              schema: {
                type: 'string'
              }
            }
          },
          schemas: {
            AnotherSchema: {
              properties: {
                someProperty: {
                  type: 'object',
                  properties: {
                    aString: {
                      type: 'string',
                      required: [
                        -'aString'
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'schemas', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'aString', 'required']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
