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

### Deploy a .bicep file to an Azure subscription
```yml
on:
  push:
    branches: [ main ]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2

      - name: Setup Bicep
        uses: anthony-c-martin/setup-bicep@v0.1

      - name: Azure CLI Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Build Bicep
        # path to your checked-in .bicep file to deploy
        run: bicep build ./path/to/main.bicep

      - uses: azure/arm-deploy@v1
        with:
          # set to your subscriptionId
          subscriptionId: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
          # set to your resource group name
          resourceGroupName: my-rg
          # should match the .bicep file path but with .json extension
          template: ./path/to/main.json
          # path to your checked-in parameters file to deploy
          parameters: ./path/to/parameters.json
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
