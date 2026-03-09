output "resource_group_name" {
  description = "The name of the Azure Resource Group"
  value       = azurerm_resource_group.devops_rg.name
}

output "acr_name" {
  description = "The name of the Azure Container Registry"
  value       = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  description = "The login server URL of the Azure Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

