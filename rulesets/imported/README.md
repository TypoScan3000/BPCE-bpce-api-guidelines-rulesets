# Imported Spectral Rulesets

## Content

| Ruleset Name                       | Description                                                                                                                                         | Source                                                                                  | Code                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Spectral OWASP API Security**    | Scan an OpenAPI document to detect security issues.                                                                                                 | [Spectral OWASP API Security](https://github.com/stoplightio/spectral-owasp-ruleset)    | [CDN](https://unpkg.com/@stoplight/spectral-owasp-ruleset@2.0.1/dist/ruleset.mjs) |
| **Spectral Documentation Ruleset** | Scan an OpenAPI description to ensure you're leveraging enough features to help documentation tools like Stoplight Elements, ReDoc, and Swagger UI. | [Spectral Documentation Ruleset](https://github.com/stoplightio/spectral-documentation) | [CDN](https://unpkg.com/@stoplight/spectral-documentation@1.3.1/dist/ruleset.mjs) |

## Usage

To use these rulesets, include them in your Spectral configuration file:

```yaml
extends:
  - spectral:oas
  - ./path/to/custom-ruleset.yaml
```

> **Important Note**
> Please do not modify the imported files directly (e.g., spectral-owasp-ruleset.mjs, spectral-documentation-ruleset.mjs).
> This is to ensure consistency with the versions available online.
> Instead, if you need to make customizations, prefer to use an extended version like `spectral-documentation-ruleset-extended.mjs`.
> This way, you can maintain your custom rules while keeping the base ruleset up-to-date with the latest changes.
