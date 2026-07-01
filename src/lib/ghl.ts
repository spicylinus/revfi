const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const DEFAULT_GHL_VERSION = '2021-07-28';

export interface GHLLeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  url_audited: string;
  audit_grade?: string;
  revenue_leak_estimate?: number;
  primary_leak?: string;
  lead_impact?: string;
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

  /**
   * Normalize a phone number to E.164 format for GHL
   * e.g. "(512) 555-1234" → "+15125551234"
   */
  normalizePhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    // Already E.164
    if (digits.startsWith('1') && digits.length === 11) {
      return `+${digits}`;
    }
    // US 10-digit
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    // Already has country code
    if (digits.length > 10) {
      return `+${digits}`;
    }
    return phone;
  }

  async getPipelines() {
    return this.request(`/opportunities/pipelines?locationId=${this.locationId}`);
  }

  async getCustomFields() {
    return this.request(`/locations/${this.locationId}/customFields`);
  }

  async getWorkflows() {
    return this.request(`/workflows/?locationId=${this.locationId}`);
  }

  async createOrUpdateContact(data: GHLLeadData) {
    // 1. Fetch Custom Fields to get IDs
    const customFieldsData = await this.getCustomFields();
    const findFieldId = (keyOrName: string) =>
      customFieldsData.customFields.find((f: any) => f.fieldKey === keyOrName || f.name === keyOrName)?.id;

    const urlFieldId = findFieldId('url_audited');
    const gradeFieldId = findFieldId('audit_grade');
    const leakFieldId = findFieldId('revenue_leak_estimate');
    const primaryLeakFieldId = findFieldId('primary_leak');
    const leadImpactFieldId = findFieldId('lead_impact');
    const nicheFieldId = findFieldId('business_niche');
    const sourceFieldId = findFieldId('contact.lead_source') || findFieldId('Lead Source');
    const valueFieldId = findFieldId('contact.estimated_deal_value') || findFieldId('Estimated Deal Value');

    const customFields = [];
    if (urlFieldId) customFields.push({ id: urlFieldId, value: data.url_audited });
    if (gradeFieldId && data.audit_grade) customFields.push({ id: gradeFieldId, value: data.audit_grade });
    if (leakFieldId && data.revenue_leak_estimate) customFields.push({ id: leakFieldId, value: data.revenue_leak_estimate });
    if (primaryLeakFieldId && data.primary_leak) customFields.push({ id: primaryLeakFieldId, value: data.primary_leak });
    if (leadImpactFieldId && data.lead_impact) customFields.push({ id: leadImpactFieldId, value: data.lead_impact });
    if (nicheFieldId && data.business_niche) customFields.push({ id: nicheFieldId, value: data.business_niche });
    if (sourceFieldId && data.source) customFields.push({ id: sourceFieldId, value: data.source });
    if (valueFieldId && data.value) customFields.push({ id: valueFieldId, value: data.value });

    // 2. Normalize phone to E.164 format
    const normalizedPhone = this.normalizePhone(data.phone || '');

    // 3. Search for existing contact by email
    const searchResult = await this.request(
      `/contacts/?locationId=${this.locationId}&query=${encodeURIComponent(data.email)}`
    );

    let contactId: string;
    const existingContact = searchResult.contacts?.[0];

    const contactPayload: Record<string, any> = {
      locationId: this.locationId,
      email: data.email,
      firstName: data.firstName || data.name?.split(' ')[0] || '',
      lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
      phone: normalizedPhone || undefined,
      source: data.source || 'Website Auditor',
      customFields: customFields.length > 0 ? customFields : undefined,
    };

    // Remove undefined fields
    Object.keys(contactPayload).forEach(k => contactPayload[k] === undefined && delete contactPayload[k]);

    if (existingContact) {
      contactId = existingContact.id;
      await this.request(`/contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(contactPayload),
      });
    } else {
      const created = await this.request(`/contacts/`, {
        method: 'POST',
        body: JSON.stringify(contactPayload),
      });
      contactId = created.contact?.id;
      if (!contactId) throw new Error(`Contact creation failed: ${JSON.stringify(created)}`);
    }

    return contactId;
  }

  async addTags(contactId: string, tags: string[]): Promise<void> {
    try {
      await this.request(`/contacts/${contactId}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags }),
      });
    } catch (err) {
      // Non-fatal: log but don't throw
      console.warn(`Failed to add tags [${tags.join(', ')}] to contact ${contactId}:`, err);
    }
  }

  async enrollInWorkflow(contactId: string, workflowId: string): Promise<void> {
    try {
      await this.request(`/workflows/${workflowId}/enrollments`, {
        method: 'POST',
        body: JSON.stringify({ contactId }),
      });
    } catch (err) {
      console.warn(`Failed to enroll contact ${contactId} in workflow ${workflowId}:`, err);
    }
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
        monetaryValue,
      }),
    });
  }

  async syncLeadToPipeline(data: GHLLeadData, pipelineName = 'Sales Pipeline', stageName = 'New Leads') {
    // Hardcoded IDs for the Social Linus GHL setup
    const PIPELINE_IDS: Record<string, string> = {
      'Sales Pipeline': 'tpFymaPJZlMgt5d8RrAd',
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
      'Lost/Abandoned': '558c00a3-b9b0-47e5-933f-d8fc4ef8b08a',
    };

    let pipelineId = PIPELINE_IDS[pipelineName];
    let stageId = STAGE_IDS[stageName];

    // 1. Create/update contact (includes phone normalization + custom fields)
    const contactId = await this.createOrUpdateContact(data);

    // 2. Add tags — GHL AI agent watches for 'ai-outbound-call' tag
    await this.addTags(contactId, ['ai-outbound-call', 'social-linus-audit', 'fresh-lead']);

    // 3. Try to enroll in AI Outbound workflow if we can find it
    try {
      const workflows = await this.getWorkflows();
      const aiWorkflow = workflows?.workflows?.find(
        (w: any) => w.name?.toLowerCase().includes('outbound') || w.name?.toLowerCase().includes('ai call')
      );
      if (aiWorkflow?.id) {
        await this.enrollInWorkflow(contactId, aiWorkflow.id);
      }
    } catch {
      // Workflows may not be accessible — AI agent tag is the fallback trigger
    }

    // 4. Create opportunity
    let opportunityId: string | undefined = undefined;
    if (pipelineId && stageId) {
      const opp = await this.createOpportunity(
        contactId,
        pipelineId,
        stageId,
        `${data.business_niche || 'Business'} Audit - ${data.url_audited}`,
        data.value
      );
      opportunityId = opp.opportunity?.id;
    }

    return { contact: { id: contactId }, opportunity: { id: opportunityId } };
  }
}
