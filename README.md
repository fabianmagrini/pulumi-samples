# Pulumi Samples

Various samples for building infra in Azure using Pulumi.

## References

* <https://www.pulumi.com/docs/get-started/azure/>

## Prerequisites

* Pulumi
* Azure CLI. Pulumi will use your azure configuration settings.
* Node.js. Generally the samples use Typescript.

### Install Pulumi

Install Pulumi on macOS through Homebrew:

```sh
brew install pulumi
```

## New project

```sh
mkdir <project-name> && cd <project-name>
pulumi new azure-typescript
```

## Deploy the stack

```sh
pulumi up
```

## Destroy the stack

```sh
pulumi destroy
```
