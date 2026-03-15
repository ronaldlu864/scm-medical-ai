export type Module = 'sales' | 'compliance' | 'database' | 'history';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  citations?: Citation[];
}

export interface Citation {
  id: string;
  type: 'product' | 'document' | 'certificate' | 'regulation' | 'competitor';
  name: string;
  reference: string;
  page?: number;
  url?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  category: string;
  description?: string;
  specifications: Record<string, string>;
  certifications: string[];
  needleSize?: string;
  connection?: string;
  packaging?: string;
  equivalentTo?: string[];
  applications?: string[];
  materials?: string[];
  sterility?: string;
  standards?: string[];
  images?: string[];
}

export interface Certification {
  id: string;
  productId: string;
  productName?: string;
  type: 'CE' | 'FDA' | 'ISO13485' | 'MDD' | 'MDR';
  number: string;
  issuedBy: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'pending';
  documentUrl?: string;
  scope?: string;
}

export interface Regulation {
  id: string;
  region: string;
  regulation: string;
  deviceClass: string;
  requirements: string[];
  documents: string[];
}

export interface TechnicalDocument {
  id: string;
  productId: string;
  productName?: string;
  name: string;
  type: 'datasheet' | 'ifu' | 'certificate' | 'doc' | 'label' | 'other';
  size: string;
  pages?: number;
  uploadDate: Date;
  url?: string;
  parsedContent?: ParsedDocumentContent;
  status: 'pending' | 'parsed' | 'error';
}

export interface ParsedDocumentContent {
  specifications?: string[];
  materials?: string[];
  sterility?: string;
  standards?: string[];
  warnings?: string[];
  instructions?: string[];
  fullText: string;
  extractedAt: Date;
}

export interface CompetitorProduct {
  id: string;
  competitorName: string;
  productName: string;
  model: string;
  category: string;
  specifications: Record<string, string>;
  equivalentModel?: string;
  equivalentProductId?: string;
  differences?: string[];
  advantages?: string[];
  disadvantages?: string[];
}

export interface MarketRegistration {
  id: string;
  productId: string;
  productName?: string;
  productModel?: string;
  region: string;
  country: string;
  status: 'registered' | 'pending' | 'not_required' | 'blocked';
  registrationNumber?: string;
  registrationDate?: Date;
  expiryDate?: Date;
  requirements: string[];
  requiredDocuments: string[];
  distributor?: string;
  distributorContact?: string;
  notes?: string;
  timeline?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

export interface ComplianceCheck {
  id: string;
  fileName: string;
  status: 'passed' | 'failed' | 'warning';
  issues: ComplianceIssue[];
  checkedAt: Date;
}

export interface ComplianceIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestion?: string;
}
