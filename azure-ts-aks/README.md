# Azure AKS

Create an AKS Cluster.

Reference: <https://www.pulumi.com/blog/create-aks-clusters-with-monitoring-and-logging-with-pulumi-azure-open-source-sdks/>

## Running the App

Create a new stack:

```sh
pulumi stack init
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
# This generates a passphrase with 128 bits of entropy
clusterPassword=$(dd if=/dev/urandom bs=16 count=1 2>/dev/null | base64 | sed 's/=//g')
pulumi config set azure:environment public
pulumi config set azure:location "Australia East"
pulumi config set password --secret $clusterPassword
ssh-keygen -t rsa -f key.rsa
pulumi config set sshPublicKey < key.rsa.pub
```

Run pulumi up to preview and deploy changes:

```sh
pulumi up
```

## Destroy the stack

```sh
pulumi destroy
```
