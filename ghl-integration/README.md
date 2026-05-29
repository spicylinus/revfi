# GHL Lead Sync Integration

This module provides a way to sync auditor leads directly into Go High Level (GHL) CRM.

## Configuration

Set the following environment variables:
- `GHL_API_KEY`: Your GHL Bearer token (OAuth access token)
- `GHL_LOCATION_ID`: Your GHL Location ID

## Files
- `sync-lead.js`: Core logic for syncing contacts and opportunities.
- `test-sync.js`: Test script to verify the integration.

## API Integration

The auditor backend uses the `src/lib/ghl.ts` client and the `src/app/api/ghl/sync-lead/route.ts` endpoint to capture leads.

## Pipeline Mapping
The integration maps leads to:
- **Pipeline**: "Sales Pipeline"
- **Stage**: "New Leads"

## Custom Fields
The following custom fields must be created in GHL for the mapping to work:
- `url_audited` (Text)
- `audit_grade` (Text)
- `revenue_leak_estimate` (Number)
- `business_niche` (Text)
- `lead_source` (Text)
- `estimated_deal_value` (Numeric)
