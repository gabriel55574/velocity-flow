/**
 * Dialogs Index
 * 
 * Central export for all CRUD dialogs
 * Epic 0: US 0.2 - Dialogs CRUD
 */

// ========== P0 Dialogs (Critical) ==========

// Client Dialogs
export { CreateClientDialog } from './clients/CreateClientDialog';
export { EditClientDialog } from './clients/EditClientDialog';

// Task Dialogs
export { CreateTaskDialog } from './tasks/CreateTaskDialog';
export { EditTaskDialog } from './tasks/EditTaskDialog';

// Lead Dialogs (CRM)
export { CreateLeadDialog } from './leads/CreateLeadDialog';
export { EditLeadDialog } from './leads/EditLeadDialog';

// Approval Dialogs
export { CreateApprovalDialog } from './approvals/CreateApprovalDialog';
export { EditApprovalDialog } from './approvals/EditApprovalDialog';

// Asset Dialogs
export { CreateAssetDialog } from './assets/CreateAssetDialog';
export { EditAssetDialog } from './assets/EditAssetDialog';

// ========== P1 Dialogs (Important) ==========

// Creative Dialogs
export { CreateCreativeDialog } from './creatives/CreateCreativeDialog';
export { EditCreativeDialog } from './creatives/EditCreativeDialog';

// Campaign Dialogs
export { CreateCampaignDialog } from './campaigns/CreateCampaignDialog';
export { EditCampaignDialog } from './campaigns/EditCampaignDialog';

// Template Dialogs (Message Templates)
export { CreateTemplateDialog } from './templates/CreateTemplateDialog';
export { EditTemplateDialog } from './templates/EditTemplateDialog';

// Workflow Dialogs
export { CreateWorkflowDialog } from './workflows/CreateWorkflowDialog';

// Module Dialogs
export { CreateModuleDialog } from './modules/CreateModuleDialog';

// Step Dialogs
export { CreateStepDialog } from './steps/CreateStepDialog';

// User Dialogs
export { CreateUserDialog } from './users/CreateUserDialog';
export { EditUserDialog } from './users/EditUserDialog';
