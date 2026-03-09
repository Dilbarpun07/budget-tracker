variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "devops-project-rg"
}

variable "location" {
  description = "Azure region where resources will be created"
  type        = string
  default     = "Australia East"
}

variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "dilbarregistryterraform"
}

