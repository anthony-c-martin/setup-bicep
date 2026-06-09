# setup-bicep
GitHub Action to setup the Bicep CLI

## End-to-End Sample Workflows

### Compile a .bicep file and report diagnostics
```yml
on:
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2

      - name: Setup Bicep
        uses: anthony-c-martin/setup-bicep@v0.1

      - name: Build Bicep
        run: bicep build ./path/to/main.bicep
```

### Use a specific version of bicep:
```yml
on:
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2

      - name: Setup Bicep
        uses: anthony-c-martin/setup-bicep@v0.1
        with:
          # must be a version listed under https://github.com/Azure/bicep/releases
          version: v0.2.212

      - name: Build Bicep
        run: bicep build ./path/to/main.bicep
```
