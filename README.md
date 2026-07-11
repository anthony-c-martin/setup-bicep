# setup-bicep

A GitHub Action that installs the [Bicep CLI](https://github.com/Azure/bicep) and adds it to `PATH`, so you can run `bicep` in subsequent workflow steps.

## Features

- Installs the latest Bicep release by default, or pin to a specific version.
- Cross-platform — works on Linux, macOS, and Windows runners.
- Caches the download via the runner tool cache.
- Registers a [problem matcher](https://github.com/actions/toolkit/blob/main/docs/problem-matchers.md) so Bicep warnings and errors surface as inline annotations on your workflow runs and pull requests.

## Usage

See [action.yml](./action.yml) for the supported inputs.

### Basic:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: anthony-c-martin/setup-bicep@v1
  - run: bicep lint --pattern './infra/**/*.bicep'
```

### Pin to a specific version:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: anthony-c-martin/setup-bicep@v1
    with:
      version: v0.45.6
  - run: bicep lint --pattern './infra/**/*.bicep'
```

Any warnings or errors emitted are annotated directly on the changed lines thanks to the bundled problem matcher.

## License

[MIT](./LICENSE)
