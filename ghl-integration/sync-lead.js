const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

// Configuration
const API_KEY = process.env.GHL_API_KEY || 'pit-60eefe1e-4c23-4c63-a3a8-82d77dac050c';
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'PvyvSAbJ5bJWe7LadYX4';

async function ghlRequest(endpoint, options = {}) {
  const url = `${GHL_API_BASE}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Version': GHL_API_VERSION,
    'Location-Id': LOCATION_ID,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`GHL API Error: ${response.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function syncLead(leadData) {
  console.log(`Syncing lead: ${leadData.email}...`);

  // Hardcoded IDs for the current Social Linus GHL setup
  const PIPELINE_ID = 'tpFymaPJZlMgt5d8RrAd';
  const STAGE_ID = '8bdb09ad-86d4-4bd1-829e-52daa933d294'; // "New Leads" stage

  // 1. Fetch Custom Fields to get IDs
  console.log('Fetching custom fields...');
  const customFieldsData = await ghlRequest(`/locations/${LOCATION_ID}/customFields`);
  const findFieldId = (key) => customFieldsData.customFields.find(f => f.fieldKey === key || f.name === key)?.id;

  const urlFieldId = findFieldId('url_audited');
  const gradeFieldId = findFieldId('audit_grade');
  const leakFieldId = findFieldId('revenue_leak_estimate');
  const nicheFieldId = findFieldId('business_niche');
  const sourceFieldId = findFieldId('contact.lead_source') || findFieldId('Lead Source');
  const valueFieldId = findFieldId('contact.estimated_deal_value') || findFieldId('Estimated Deal Value');

  // 2. Create/Update Contact
  console.log('Creating/Updating contact...');
  const customFields = [];
  if (urlFieldId) customFields.push({ id: urlFieldId, value: leadData.url });
  if (gradeFieldId) customFields.push({ id: gradeFieldId, value: leadData.grade });
  if (leakFieldId) customFields.push({ id: leakFieldId, value: leadData.leakEstimate });
  if (nicheFieldId) customFields.push({ id: nicheFieldId, value: leadData.niche });
  if (sourceFieldId && leadData.source) customFields.push({ id: sourceFieldId, value: leadData.source });
  if (valueFieldId && leadData.value) customFields.push({ id: valueFieldId, value: leadData.value });

  const contactPayload = {
    locationId: LOCATION_ID,
    email: leadData.email,
    firstName: leadData.name?.split(' ')[0] || 'Auditor',
    lastName: leadData.name?.split(' ').slice(1).join(' ') || 'Lead',
    phone: leadData.phone,
    source: leadData.source || 'Website Auditor',
    customFields
  };

  // Check if contact exists
  const searchResult = await ghlRequest(`/contacts/?locationId=${LOCATION_ID}&query=${encodeURIComponent(leadData.email)}`);
  let contactId;
  if (searchResult.contacts?.length > 0) {
    contactId = searchResult.contacts[0].id;
    await ghlRequest(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contactPayload)
    });
    console.log(`Updated contact: ${contactId}`);
  } else {
    const createdContact = await ghlRequest(`/contacts/`, {
      method: 'POST',
      body: JSON.stringify(contactPayload)
    });
    contactId = createdContact.contact.id;
    console.log(`Created contact: ${contactId}`);
  }

  // 3. Create Opportunity
  console.log('Creating opportunity...');
  const opp = await ghlRequest(`/opportunities/`, {
    method: 'POST',
    body: JSON.stringify({
      pipelineId: PIPELINE_ID,
      locationId: LOCATION_ID,
      contactId: contactId,
      name: `${leadData.niche || 'Business'} Audit - ${leadData.url}`,
      status: 'open',
      pipelineStageId: STAGE_ID,
      monetaryValue: leadData.value
    })
  });

  console.log(`Successfully synced lead! Opportunity ID: ${opp.opportunity.id}`);
  return opp;
}

// Example usage:
// syncLead({
//   email: 'test@example.com',
//   url: 'https://example.com',
//   grade: 'F',
//   leakEstimate: 5000,
//   niche: 'Dental'
// }).catch(console.error);

module.exports = { syncLead };
