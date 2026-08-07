resource "cloudflare_worker" "ingestion" {
  account_id = var.cloudflare_account_id
  name       = "movie-ingestion-worker"

  subdomain = {
    enabled = true
  }

  observability = {
    enabled = true
  }
}