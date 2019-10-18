# Azure Storage

A minimal Azure TypeScript Pulumi program

## Running the App

Create a new stack:

```sh
pulumi stack init azure-ts-storage
```

Login to Azure CLI:

```sh
az login
```

Restore NPM dependencies:

```sh
npm install
```

Set the azure location in which to run the deploy:

```sh
pulumi config set azure:location australiaeast
```

Run pulumi up to preview and deploy changes:

```sh
pulumi up
```

## Destroy the stack

```sh
pulumi destroy
```
