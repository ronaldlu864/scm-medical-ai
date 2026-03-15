import { useState, useRef } from 'react';
import { 
  Send, 
  Upload, 
  FileCheck, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Sparkles,
  FileText,
  Shield,
  Search,
  Download,
  Copy,
  Check,
  Clock,
  Calendar,
  Building2,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { Message, ComplianceCheck, Certification, Citation } from '@/types';

const complianceQuickActions = [
  { id: '1', label: 'MDR Classification', icon: Shield, prompt: 'What classification is disposable syringe under MDR?' },
  { id: '2', label: 'Thailand FDA', icon: Globe, prompt: 'Can syringe be sold in Thailand?' },
  { id: '3', label: 'Check Certificate', icon: FileCheck, prompt: 'Check certificate validity for KDL-SYR-05' },
  { id: '4', label: 'Generate DoC', icon: FileText, prompt: 'Generate Declaration of Conformity for 5ml syringe' },
];

interface AIResponse {
  content: string;
  citations: Citation[];
}

const sampleComplianceResponses: Record<string, AIResponse> = {
  'What classification is disposable syringe under MDR?': {
    content: `**MDR Classification Analysis**

**Device Class:** IIa

**Regulation Reference:**
- EU MDR 2017/745
- Rule 6 (Annex VIII)

**Classification Basis:**
Syringes are classified as **Class IIa** because they:
- Are invasive devices with respect to body orifices
- Are intended for short-term use (< 60 minutes)
- Do not administer medicinal products

**Applicable Rules:**
- Rule 6: All invasive devices with respect to body orifices
- Duration: Short-term (≤ 60 min)

**Required Documentation:**
- Technical Documentation (Annex II)
- Quality Management System (Annex IX)
- Clinical Evaluation Report
- Risk Management File (ISO 14971)

**Notified Body:** Required for Class IIa devices`,
    citations: [
      { id: '1', type: 'regulation', name: 'EU MDR 2017/745', reference: 'Annex VIII, Rule 6' },
      { id: '2', type: 'product', name: 'KDL-SYR-05', reference: 'Classification Record' },
      { id: '3', type: 'document', name: 'MDR Classification Guide', reference: 'Regulatory Docs' },
    ]
  },

  'Can syringe be sold in Thailand?': {
    content: `**Thailand FDA Registration Requirements**

**Answer:** Yes, but registration is required.

**Regulatory Pathway:**
Thailand FDA (Thai FDA) Class II Medical Device Registration

**Required Documents:**
1. **Free Sale Certificate** (from country of origin)
2. **ISO 13485 Certificate** (Quality Management)
3. **CE Certificate** (or FDA clearance)
4. **Product Registration Application** (Thai FDA Form)
5. **Labeling in Thai Language**
6. **Instructions for Use (Thai)**

**Timeline:** 6-12 months
**Validity:** 5 years

**Local Requirements:**
- Thailand Licensed Distributor
- Thai FDA Local Representative

**Note:** Products with CE MDR or FDA clearance have expedited review pathway.

Would you like the detailed registration checklist?`,
    citations: [
      { id: '1', type: 'regulation', name: 'Thai FDA Medical Device Act', reference: 'Thailand' },
      { id: '2', type: 'document', name: 'Thailand Registration Guide', reference: 'Market Entry' },
      { id: '3', type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' },
    ]
  },

  'Check certificate validity for KDL-SYR-05': {
    content: `**Certificate Status Check**

**Product:** KDL-SYR-05 (5ml Syringe)

**CE MDR Certificate:**
- **Status:** Valid
- **Certificate No.:** TUVMDR-2023-78432
- **Notified Body:** TÜV SÜD Product Service GmbH
- **Issue Date:** 2023-03-15
- **Expiry Date:** 2028-03-14
- **Days Remaining:** 1,089 days

**ISO 13485 Certificate:**
- **Status:** Valid
- **Certificate No.:** TUV13485-2022-45678
- **Issue Date:** 2022-08-20
- **Expiry Date:** 2025-08-19
- **Days Remaining:** 523 days

**FDA Registration:**
- **Status:** Active
- **Registration No.:** 3008578642
- **Owner/Operator:** KDL Medical Devices Co., Ltd.

**Action Required:**
ISO 13485 renewal should be initiated 6 months before expiry (February 2025).

Would you like me to set a reminder?`,
    citations: [
      { id: '1', type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' },
      { id: '2', type: 'certificate', name: 'ISO 13485 Certificate', reference: 'TUV13485-2022-45678' },
      { id: '3', type: 'certificate', name: 'FDA Registration', reference: '3008578642' },
    ]
  },

  'Generate Declaration of Conformity for 5ml syringe': {
    content: `**Declaration of Conformity Generated**

---

**EU DECLARATION OF CONFORMITY**

**No.:** DoC-KDL-SYR-05-2024
**Date:** 2024-01-15

**Manufacturer:**
KDL Medical Devices Co., Ltd.
[Address]

**Product:**
Disposable Hypodermic Syringe 5ml
Model: KDL-SYR-05

**Applicable Legislation:**
Regulation (EU) 2017/745 (MDR)

**Notified Body:**
TÜV SÜD Product Service GmbH
Notified Body Number: 0123

**Certificate No.:** TUVMDR-2023-78432

**Harmonized Standards Applied:**
- EN ISO 7886-1:2020
- EN ISO 13485:2016
- EN ISO 14971:2019
- EN ISO 10993 series

**Conformity Assessment Procedure:**
Annex IX (Quality Management System)

We declare that the above-mentioned product meets all the provisions of Regulation (EU) 2017/745.

**Authorized Representative:**
[EU AR Name and Address]

**Signed:** _________________
**Date:** 2024-01-15

---

**Document ready for download.** Would you like to customize any sections?`,
    citations: [
      { id: '1', type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' },
      { id: '2', type: 'regulation', name: 'EU MDR 2017/745', reference: 'Annex IX' },
      { id: '3', type: 'product', name: 'KDL-SYR-05', reference: 'Product Database' },
    ]
  },
};

const sampleCertifications: Certification[] = [
  {
    id: '1',
    productId: 'KDL-SYR-05',
    type: 'MDR',
    number: 'TUVMDR-2023-78432',
    issuedBy: 'TÜV SÜD',
    issueDate: new Date('2023-03-15'),
    expiryDate: new Date('2028-03-14'),
    status: 'valid',
  },
  {
    id: '2',
    productId: 'KDL-SYR-05',
    type: 'ISO13485',
    number: 'TUV13485-2022-45678',
    issuedBy: 'TÜV SÜD',
    issueDate: new Date('2022-08-20'),
    expiryDate: new Date('2025-08-19'),
    status: 'valid',
  },
];

const sampleComplianceChecks: ComplianceCheck[] = [
  {
    id: '1',
    fileName: 'IFU_KDL_SYR_05_v2.1.pdf',
    status: 'warning',
    issues: [
      { type: 'warning', field: 'UDI Code', message: 'UDI code format does not comply with GS1 standards' },
      { type: 'info', field: 'MDR Reference', message: 'Consider adding explicit MDR 2017/745 reference' },
    ],
    checkedAt: new Date(),
  },
];

// Recent questions for quick access
const recentQuestions = [
  'What classification is disposable syringe under MDR?',
  'Can syringe be sold in Thailand?',
  'Check certificate validity for KDL-SYR-05',
  'Generate Declaration of Conformity for 5ml syringe',
];

export default function ComplianceAICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Compliance AI Copilot. I can help you with:\n\n• MDR/FDA classification queries\n• Country-specific registration requirements\n• Certificate validity checks\n• Document compliance verification\n• Declaration of Conformity generation\n\nAll responses include **Source** citations for full traceability and audit compliance. What compliance question can I assist with?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [showRecentQuestions, setShowRecentQuestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowRecentQuestions(false);

    setTimeout(() => {
      const responseData = sampleComplianceResponses[text] || {
        content: `I'll help you with "${text}". Let me search our regulatory database for the most current information.\n\nOur compliance database covers EU MDR, FDA, ISO standards, and registration requirements for 50+ countries. Could you provide more specific details about the product or regulation you're inquiring about?`,
        citations: [
          { id: '1', type: 'regulation', name: 'Regulatory Database', reference: 'Internal Search' },
        ]
      };
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.content,
        timestamp: new Date(),
        citations: responseData.citations,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-emerald-400 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-3 border-border" />;
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*:\s*(.+)/);
        if (match) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-emerald-400">•</span>
              <span><span className="font-medium">{match[1]}:</span> {match[2]}</span>
            </div>
          );
        }
      }
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-emerald-400">•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="mb-1">{line}</p>;
    });
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4 border-b border-border">
            <TabsList className="bg-[hsl(220,25%,14%)]">
              <TabsTrigger value="chat" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <FileCheck className="w-4 h-4 mr-2" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="checks" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <Shield className="w-4 h-4 mr-2" />
                Compliance Checks
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 animate-slide-in ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}>
                      {message.role === 'user' ? (
                        <span className="text-white text-sm font-medium">JD</span>
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[85%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`inline-block text-left px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'bg-[hsl(220,25%,14%)] border border-border text-foreground'
                      }`}>
                        <div className="text-sm leading-relaxed">
                          {formatContent(message.content)}
                        </div>
                      </div>
                      
                      {/* Source Citations - Medical Grade Traceability */}
                      {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                        <div className="mt-3 p-3 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                          <p className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Source</p>
                          <div className="space-y-1">
                            {message.citations.map((citation) => (
                              <div key={citation.id} className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground capitalize">{citation.type}:</span>
                                <span className="text-white font-medium">{citation.name}</span>
                                {citation.page && (
                                  <span className="text-emerald-400">page {citation.page}</span>
                                )}
                                {citation.reference && citation.reference !== citation.name && (
                                  <span className="text-muted-foreground">({citation.reference})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => handleCopy(message.content, message.id)}
                            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[hsl(220,25%,14%)] border border-border rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-[hsl(220,25%,8%)]">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {complianceQuickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleSend(action.prompt)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(220,25%,14%)] border border-border hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-sm text-muted-foreground hover:text-emerald-400 whitespace-nowrap"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Recent Questions Toggle */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setShowRecentQuestions(!showRecentQuestions)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-400 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    {showRecentQuestions ? 'Hide Recent Questions' : 'Show Recent Questions'}
                  </button>
                </div>

                {/* Recent Questions Panel */}
                {showRecentQuestions && (
                  <div className="mb-3 p-3 bg-[hsl(220,25%,14%)] rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Click to reuse:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(question)}
                          className="px-3 py-1.5 text-xs bg-[hsl(220,25%,10%)] hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 rounded-full border border-border hover:border-emerald-500/30 transition-all text-left"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <button 
                    onClick={handleFileUpload}
                    className="p-3 rounded-xl bg-[hsl(220,25%,14%)] border border-border hover:border-emerald-500/50 transition-colors text-muted-foreground hover:text-emerald-400"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Ask about regulations, certifications, or upload a document for compliance check..."
                      className="w-full pr-12 bg-[hsl(220,25%,14%)] border-border focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    />
                  </div>
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Certificate Management</h2>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Certificate
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleCertifications.map((cert) => (
                  <Card key={cert.id} className="bg-[hsl(220,25%,14%)] border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium text-white">{cert.type}</CardTitle>
                            <p className="text-xs text-muted-foreground">{cert.number}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {cert.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>{cert.issuedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Issued: {cert.issueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Expires: {cert.expiryDate.toLocaleDateString()}</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Validity</span>
                          <span className="text-emerald-400">Valid</span>
                        </div>
                        <Progress value={75} className="h-1.5 bg-[hsl(220,25%,20%)]" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[hsl(220,25%,18%)] text-muted-foreground text-sm hover:text-white transition-colors">
                          <Search className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checks" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Compliance Check Results</h2>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Upload className="w-4 h-4 mr-2" />
                  New Check
                </Button>
              </div>

              <div className="space-y-4">
                {sampleComplianceChecks.map((check) => (
                  <Card key={check.id} className="bg-[hsl(220,25%,14%)] border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            check.status === 'passed' ? 'bg-emerald-500/10' :
                            check.status === 'warning' ? 'bg-amber-500/10' : 'bg-red-500/10'
                          }`}>
                            {check.status === 'passed' ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : check.status === 'warning' ? (
                              <AlertTriangle className="w-5 h-5 text-amber-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium text-white">{check.fileName}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              Checked {check.checkedAt.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          check.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          check.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }>
                          {check.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {check.issues.map((issue, idx) => (
                          <div key={idx} className={`p-3 rounded-lg ${
                            issue.type === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                            issue.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                            'bg-blue-500/10 border border-blue-500/20'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium uppercase ${
                                issue.type === 'error' ? 'text-red-400' :
                                issue.type === 'warning' ? 'text-amber-400' :
                                'text-blue-400'
                              }`}>
                                {issue.type}
                              </span>
                              <span className="text-xs text-muted-foreground">• {issue.field}</span>
                            </div>
                            <p className="text-sm text-white">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-sm text-muted-foreground mt-1">{issue.suggestion}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
