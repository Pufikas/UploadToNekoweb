# Simple deploy script
Zip all your repository and upload it to your nekoweb dashboard

## Using this script
Create a workflow inside your repository
`.github/workflows/deploy.yml`

**example deploy.yml**
Replace `nekoweb-domain` and `nekoweb-username` with your own values
```yml 
name: Build and Deploy to NekoWeb

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy
        uses: Pufikas/deploytonekoweb@main
        with:
          nekoweb-api-key: ${{ secrets.NEKOWEB_API_KEY }}
          nekoweb-domain: "pufikas.nekoweb.org"
          nekoweb-username: "pufikas"
```

# Setting your **NEKOWEB_API_KEY**
Get api key from https://nekoweb.org/api

Add your API key to your repository secrets:
![api_key_example](https://raw.githubusercontent.com/Pufikas/deploytonekoweb/main/assets/api_key.png)

**Settings -> Secrets and variables -> Actions -> New repository secret**

**Name `NEKOWEB_API_KEY`**
**Secret `yourapikey`**

## Required inputs
```yml
inputs:
  nekoweb-api-key:
    description: "Your NekoWeb API key."
    required: true
  nekoweb-domain:
    description: "Your NekoWeb domain to deploy to."
    required: true
  nekoweb-username:
    description: "Your NekoWeb username."
    required: true
    ...
```

### Having issues?
**Open an issue in this repository and describe your problem**