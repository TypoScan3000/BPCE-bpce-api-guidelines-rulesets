# Setting Up a Test Use Case Using Our Test Suite

This guide will help you set up a test use case using our linter test suite.

## Step-by-Step Instructions

1. **Set the Ruleset Name**

   - Open the `test-template-ruleset.js` file.
   - Replace `{ruleset name}` with the name of your ruleset. Ruleset files are located in the `rulesets` folder.

   ```javascript
   describe("{ruleset name}", function () {
     // ...existing code...
   });
   ```

2. **Initialize the Test Suite**

   - Ensure the test suite is initialized by calling `linterTestSuite.initialize()`.

   ```javascript
   linterTestSuite.initialize();
   ```

3. **Add Test Suite for Each Rule**

   - For each rule in your ruleset, add a new `describe` block.
   - Replace `{rule name}` with the rule name as defined in the Spectral ruleset.

   ```javascript
   describe("{rule name}", function () {
     // ...existing code...
   });
   ```

4. **Common Tests**

   - Set the format on which the rule should run (`oas2`, `oas3`, or `all`).

   ```javascript
   linterTestSuite.commonTests(linterTestSuite.FORMATS.xxx); // Replace xxx with the appropriate format
   ```

5. **Verify JSON Paths**

   - Add tests to verify all given JSON paths.
   - Ensure there is at least one "should check ..." and one "should ignore ..." test for each rule's given JSON path.

   ```javascript
   it("should ignore {something}", function () {
     const document = {
       some: {
         path: {}
       }
     };
     const givenIndex = 0;
     this.linterTester.checkGivenNotFound(document, givenIndex);
   });

   it("should check {something}", function () {
     const document = {
       some: {
         path: {}
       }
     };
     const expectedPaths = [["some", "path"]];
     const givenIndex = 0;
     this.linterTester.checkGivenFound(document, expectedPaths, givenIndex);
   });
   ```

6. **Check Rule's "Then"**

   - Add tests to check the rule's "then" condition.
   - Include both OK and KO use cases.

   ```javascript
   it("should return no error if {use case}", async function () {
     const document = {
       paths: {
         "/some/path": {
           anymethod: {
             responses: {
               204: {},
               301: {},
               302: {},
               303: {}
             }
           }
         }
       }
     };
     await this.linterTester.runAndCheckNoError(document);
   });

   it("should return an error if {use case}", async function () {
     const response = {
       schema: {}
     };
     const document = {
       paths: {
         "/some/path": {
           anymethod: {
             responses: {
               204: response,
               301: response,
               302: response,
               303: response
             }
           }
         }
       }
     };
     const errorPaths = [
       ["paths", "/some/path", "anymethod", "responses", "204", "schema"],
       ["paths", "/some/path", "anymethod", "responses", "301", "schema"],
       ["paths", "/some/path", "anymethod", "responses", "302", "schema"],
       ["paths", "/some/path", "anymethod", "responses", "303", "schema"]
     ];
     const errorSeverity = linterTestSuite.SEVERITY.error;
     await this.linterTester.runAndCheckExpectedError(
       document,
       errorPaths,
       errorSeverity
     );
   });
   ```

7. **Finalize the Test Suite**

   - Ensure the test suite is finalized by calling `linterTestSuite.finalize()`.

   ```javascript
   linterTestSuite.finalize();
   ```

By following these steps, you can set up a comprehensive test use case for your ruleset using our linter test suite.
