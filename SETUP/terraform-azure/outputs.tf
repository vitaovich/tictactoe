output "resource_group_id" {
  value = azurerm_resource_group.rg.id
}

output "site_url" {
  value = azurerm_static_site.mysite.default_host_name
}