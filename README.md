<!--
 Copyright 2019-2022 Groupe BPCE

 Licensed under the Apache License, Version 2.0 (the License);
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an AS IS BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

# BPCE Business API Design Guidelines Rulesets :white_check_mark: :vs: :warning:

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Using Stoplight's Spectral and the BPCE API Design Guidelines Rulesets, you can ensure that an API design (provided as an OpenAPI 3 specification, in JSON or YAML format) is compliant with the BPCE Business API Design Guidelines.
These rulesets are constantly evolving to improve the coverage, their practicality or their documentation.

> :red_circle: **Linting an API description only ensures that the form of the API complies with our automated rules but cannot ensure that it is accurate, consistent and developer-friendly.**  
> **That's why, even linted, an API design must always be reviewed by the Design Authority.**

---

## Usage :on:

### Spectral

#### Description

Spectral is a JSON/YAML linter with out of the box support for [OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3.html) & 2.0, [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v3.0.0) and [Arazzo](https://spec.openapis.org/arazzo/latest.html).

#### Installation

Open a terminal and launch the following command line to install the spectral command line tool:

```sh
npm install -g @stoplight/spectral-cli@6.13.1
```

or

```sh
yarn global add @stoplight/spectral-cli@6.13.1
```

See [Spectral documentation](https://meta.stoplight.io/docs/spectral/docs/getting-started/2-installation.md) for more information and other installation options.

### Linting a file

Checking compliance with the BPCE Business API Design guidelines in development stages is done using the `rulesets/main-ruleset.yaml` ruleset file.

> spectral lint `<path to Swagger or OpenAPI file in JSON or YAML format>` -r `<path to ruleset>`

```sh
spectral lint samples/example-swagger.yaml -r rulesets/main-ruleset.yaml
```

Output can be turned into JSON or HTML using the -f flag:

```sh
spectral lint samples/example-swagger.yaml -f json -r rulesets/main-ruleset.yaml
```

Checking compliance with the BPCE Business API Design guidelines before publication is done using the `rulesets/main-businessapi-release-ruleset.yaml` ruleset file. No API may be released into the BPCE Portal or to the Apigee gateway if it contains errors:

```sh
spectral lint samples/example-swagger.yaml -r rulesets/main-businessapi-release-ruleset.yaml -D error
```

In case of a false positive on one of the Spectral rules, an exception may be granted by the Design Authority to downgrade the rule to `warning` level solely for the API and recorded directly into the `main-businessapi-release-ruleset.yaml` file.

> <font color="orange">To ensure compatibility with Stoplight Studio, which uses an older Spectral runtime and does not support Arazzo instructions, the Arazzo ruleset is excluded from `main-businessapi-release-ruleset.yaml`. For teams able to migrate, a new `main-businessapi-ruleset.yaml` is provided, which includes the Arazzo ruleset.</font>

---

## Development :construction_worker:

In order to add new rules or rulesets, we have a test suite to ensure the Spectral rules are working as intending by providing a testing framework.

### Requirements

- NodeJs >= v18.20.7

### Setting up development environment

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard) [![JavaScript Style Guide](https://avatars.githubusercontent.com/u/1165674?s=55&v=4)](http://editorconfig.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This project uses `mocha` for testing rules, `standard` to lint the JS code, `EditorConfig` for coding styles, and `Prettier` to ensure consistent formatting across our multiple files structure.

Download dependencies using the following commands in a terminal:

```sh
npm install -g mocha
npm install -g standard
npm install -g prettier
npm install
```

### Source organization

- `rulesets`: available rulesets, where `main-ruleset.yaml` is the top level ruleset usable in development mode, and `main-businessapi-release-ruleset.yaml` is the most extensive ruleset which must be used before any publication of an OpenAPI specification to the BPCE portal or to the Apigee gateway.
- `samples`: sample Swagger 2.0 and OpenAPI 3 files to test with spectral cli
- `test`: tests for rulesets (one js mocha test file for each ruleset)

### Modifying rules

[Spectral documentation](https://meta.stoplight.io/docs/spectral/docs/guides/4-custom-rulesets.md) describes anything you need to define your rulesets, rules and function.
What follows only explains how this repo works.

### Adding a ruleset

- Create a new `<ruleset name>-ruleset.yaml` file in the `rulesets` folder
- Add the matching `test-<ruleset name>-ruleset.js` test file in the `tests` folder

### Adding or modifying a rule

- Add or modify rule in the adequate ruleset file
- Add all needed tests to the adequate test file

### Testing :passport_control:

[![JavaScript Mocha Test](https://raw.githubusercontent.com/mochajs/mocha/master/assets/mocha-logo-64.png)](https://github.com/mochajs/mocha)
Run the following command to check that everything is ok

```sh
npm run-script alltests
```

You can also run a specific test file using:

> mocha **`test/<filename>`**

```sh
mocha test/test-info-ruleset.js
```

## Questions & Comments

Please contact <bpce-api-design-authority@bpce.fr> if you have any questions.
