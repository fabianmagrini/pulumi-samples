import * as azure from "@pulumi/azure";
import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as azuread from "@pulumi/azuread";

// Step 1: Parse and export configuration variables for the AKS stack.
const config = new pulumi.Config();
export const password = config.require("password");
export const location = config.get("location") || "australiaeast";
export const nodeCount = config.getNumber("nodeCount") || 2;
export const nodeSize = config.get("nodeSize") || "Standard_D2_v2";

export const sshPublicKey = config.require("sshPublicKey");
export const resourceGroup = new azure.core.ResourceGroup("aks", { location });
export const loganalytics = new azure.operationalinsights.AnalyticsWorkspace("aksloganalytics", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: "PerGB2018",
    retentionInDays: 30,
})

// Step 2: Create the AD service principal for the k8s cluster.
let adApp = new azuread.Application("aks");
let adSp = new azuread.ServicePrincipal("aksSp", { applicationId: adApp.applicationId });
let adSpPassword = new azuread.ServicePrincipalPassword("aksSpPassword", {
    servicePrincipalId: adSp.id,
    value: password,
    endDate: "2099-01-01T00:00:00Z",
});

// Step 3: This step creates an AKS cluster.
export const k8sCluster = new azure.containerservice.KubernetesCluster("aksCluster", {
        resourceGroupName: resourceGroup.name,
        location: location,
        agentPoolProfiles: [{
            name: "aksagentpool",
            count: nodeCount,
            vmSize: nodeSize,
        }],
        dnsPrefix: `${pulumi.getStack()}-kube`,
        linuxProfile: {
            adminUsername: "aksuser", 
            sshKey: { keyData: sshPublicKey, }
        },
        servicePrincipal: {
            clientId: adApp.applicationId,
            clientSecret: adSpPassword.value,
        },
       addonProfile: {
            omsAgent: {
                enabled: true,
                logAnalyticsWorkspaceId: loganalytics.id,
            },
        },
    }); 

// Step 4: Enables the Monitoring Diagonostic control plane component logs and AllMetrics   
export const azMonitoringDiagnostic = new azure.monitoring.DiagnosticSetting("aks", {
       logAnalyticsWorkspaceId: loganalytics.id,
       targetResourceId: k8sCluster.id,
        logs:  [{
           category: "kube-apiserver",
           enabled : true,
        
           retentionPolicy: {
           enabled: true,
            }
        },
       ],
       metrics: [{
           category: "AllMetrics",
        
           retentionPolicy: {
           enabled: true,
           }
        }],
   })

// Step 5: Expose a k8s provider instance using our custom cluster instance.
export const k8sProvider = new k8s.Provider("aksK8s", {
        kubeconfig: k8sCluster.kubeConfigRaw,
    });

// Export the kubeconfig
export const kubeconfig = k8sCluster.kubeConfigRaw