# Azure VM Scale Sets

This example provisions a Scale Set of Linux servers with nginx deployed, configured the auto-scaling based on CPU load, puts a Load Balancer in front of them, and gives it a public IP address. Based on <https://github.com/pulumi/examples/tree/master/azure-ts-vm-scaleset>.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Download and install the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Connect Pulumi with your Azure account](https://www.pulumi.com/docs/intro/cloud-providers/azure/setup/)

## Running the App

Create a new stack:

```sh
pulumi stack init dev
```

Configure the app deployment.

```sh
pulumi config set azure:location australiaeast
```

Optionally, configure the username and password for the admin user.

```sh
pulumi config set adminUser azureuser
pulumi config set adminPassword <your-password> --secret
```

Login to Azure CLI:

```sh
az login
```

Restore NPM dependencies:

```sh
npm install
```

Run `pulumi up` to preview and deploy changes:

```sh
pulumi up
```

Check the domain name of the public address:

```sh
pulumi stack output publicAddress
curl http://$(pulumi stack output publicAddress)
#nginx welcome screen HTML is returned
```

Destroy the stack

```sh
pulumi destroy
```
