const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const DEFAULT_GHL_VERSION = '2021-07-28';

export interface GHLLeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  url_audited: string;
  audit_grade: string;
  revenue_leak_estimate: number;
  business_niche?: string;
  source?: string;
  value?: number;
}

export class GHLClient {
  private apiKey: string;
  private locationId: string;
  private version: string;

  constructor(apiKey: string, locationId: string, version = DEFAULT_GHL_VERSION) {
    this.apiKey = apiKey;
    this.locationId = locationId;
    this.version = version;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${GHL_API_BASE}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Version': this.version,
      'Location-Id': this.locationId,
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

  async getPipelines() {
    return this.request(`/opportunities/pipelines?locationId=${this.locationId}`);
  }

  async getCustomFields() {
    return this.request(`/locations/${this.locationId}/customFields`);
  }

  async createOrUpdateContact(data: GHLLeadData) {
    // 1. Fetch Custom Fields to get IDs
    const customFieldsData = await this.getCustomFields();
    const findFieldId = (keyOrName: string) => 
      customFieldsData.customFields.find((f: any) => f.fieldKey === keyOrName || f.name === keyOrName)?.id;

    const urlFieldId = findFieldId('url_audited');
    const gradeFieldId = findFieldId('audit_grade');
    const leakFieldId = findFieldId('revenue_leak_estimate');
    const nicheFieldId = findFieldId('business_niche');
    const sourceFieldId = findFieldId('contact.lead_source') || findFieldId('Lead Source');
    const valueFieldId = findFieldId('contact.estimated_deal_value') || findFieldId('Estimated Deal Value');

    const customFields = [];
    if (urlFieldId) customFields.push({ id: urlFieldId, value: data.url_audited });
    if (gradeFieldId) customFields.push({ id: gradeFieldId, value: data.audit_grade });
    if (leakFieldId) customFields.push({ id: leakFieldId, value: data.revenue_leak_estimate });
    if (nicheFieldId) customFields.push({ id: nicheFieldId, value: data.business_niche });
    if (sourceFieldId && data.source) customFields.push({ id: sourceFieldId, value: data.source });
    if (valueFieldId && data.value) customFields.push({ id: valueFieldId, value: data.value });

    // 2. Search for existing contact by email
    const searchResult = await this.request(`/contacts/?locationId=${this.locationId}&query=${encodeURIComponent(data.email)}`);
    
    let contactId: string;
    const existingContact = searchResult.contacts?.[0];

    const contactPayload = {
      locationId: this.locationId,
      email: data.email,
      firstName: data.firstName || data.name?.split(' ')[0],
      lastName: data.lastName || data.name?.split(' ').slice(1).join(' '),
      phone: data.phone,
      source: data.source || 'Website Auditor',
      customFields
    };

    if (existingContact) {
      contactId = existingContact.id;
      await this.request(`/contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(contactPayload)
      });
    } else {
      const createdContact = await this.request(`/contacts/`, {
        method: 'POST',
        body: JSON.stringify(contactPayload)
      });
      contactId = createdContact.contact.id;
    }

    return contactId;
  }

  async createOpportunity(contactId: string, pipelineId: string, stageId: string, title: string, monetaryValue?: number) {
    return this.request(`/opportunities/`, {
      method: 'POST',
      body: JSON.stringify({
        pipelineId,
        locationId: this.locationId,
        contactId,
        name: title,
        status: 'open',
        pipelineStageId: stageId,
        monetaryValue
      })
    });
  }

  async syncLeadToPipeline(data: GHLLeadData, pipelineName = 'Sales Pipeline', stageName = 'New Leads') {
    // Hardcoded IDs for the current Social Linus GHL setup
    const PIPELINE_IDS: Record<string, string> = {
      'Sales Pipeline': 'tpFymaPJZlMgt5d8RrAd'
    };

    const STAGE_IDS: Record<string, string> = {
      'New Leads': '8bdb09ad-86d4-4bd1-829e-52daa933d294',
      'Hot Leads': '4ce1679b-e6eb-4925-9748-5e1d79be0cb4',
      'Appointment Booked': '65641408-4a19-4aaf-ae7d-5caa4c350cae',
      'No Show': 'c748bf6f-a793-4ff1-b676-ed784efb8e02',
      'Follow Up to Close': '41d38f44-bd09-4ed2-b6b4-e00885512603',
      'Won': 'f70949eb-2dda-44eb-9f61-d191b0154efc',
      'Pending Service Completion': '92ee3ec4-1f60-4247-9678-36b50798226b',
      'Service Completed': '1ab67d0f-3510-4e34-b7d0-993207fbe675',
      'Lost/Abandoned': '558c00a3-b9b0-47e5-933f-d8fc4ef8b08a'
    };

    let pipelineId = PIPELINE_IDS[pipelineName];
    let stageId = STAGE_IDS[stageName];

    // Fallback to dynamic lookup if hardcoded IDs don't match or names differ
    if (!pipelineId || !stageId) {
      console.log(`Hardcoded IDs not found for ${pipelineName}/${stageName}. Falling back to dynamic lookup...`);
      // 1. Get Pipelines to find the ID
      const pipelinesData = await this.getPipelines();
      const pipeline = pipelinesData.pipelines.find((p: any) => p.name === pipelineName);
      
      if (!pipeline) {
        throw new Error(`Pipeline not found: ${pipelineName}`);
      }
      pipelineId = pipeline.id;

      // 2. Find the stage ID
      const stage = pipeline.stages.find((s: any) => s.name === stageName);
      if (!stage) {
        throw new Error(`Stage not found: ${stageName} in pipeline ${pipelineName}`);
      }
      stageId = stage.id;
    }

    // 3. Create/Update Contact
    const contactId = await this.createOrUpdateContact(data);

    // 4. Create Opportunity
    return await this.createOpportunity(contactId, pipelineId, stageId, `${data.business_niche || 'Business'} Audit - ${data.url_audited}`, data.value);
  }
}
