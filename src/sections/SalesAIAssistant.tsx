import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  FileText, 
  Package, 
  Award, 
  Mail,
  ExternalLink,
  Copy,
  Check,
  Search,
  Zap,
  History,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, Product, Citation } from '@/types';

const quickActions = [
  { id: '1', label: 'Product Specs', icon: Package, prompt: 'What is the needle size for 5ml syringe?' },
  { id: '2', label: 'Certifications', icon: Award, prompt: 'Is your syringe CE MDR certified?' },
  { id: '3', label: 'Find Alternative', icon: Search, prompt: 'Do you have alternative to BD 5ml syringe?' },
  { id: '4', label: 'ICU Recommend', icon: Zap, prompt: 'ICU syringe recommendation' },
  { id: '5', label: 'Draft Email', icon: Mail, prompt: 'Draft a reply about CE certification' },
  { id: '6', label: 'Documents', icon: FileText, prompt: 'Show me the datasheet for 5ml syringe' },
];

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Disposable Syringe',
    model: 'KDL-SYR-05',
    category: 'Syringe',
    specifications: {
      'Needle Size': '21G / 23G',
      'Connection': 'Luer Slip / Luer Lock',
      'Volume': '5ml',
      'Material': 'Medical Grade PP',
    },
    certifications: ['CE MDR', 'ISO13485', 'FDA'],
    needleSize: '21G / 23G',
    connection: 'Luer Slip / Luer Lock',
    packaging: 'Sterile, 100pcs/box',
    equivalentTo: ['BD 5ml Syringe', 'Terumo 5ml Syringe'],
  },
];

interface AIResponse {
  content: string;
  citations: Citation[];
}

const sampleResponses: Record<string, AIResponse> = {
  'What is the needle size for 5ml syringe?': {
    content: `**Product:** Disposable Syringe 5ml
**Model:** KDL-SYR-05

**Specifications:**
- **Needle Size:** 21G / 23G
- **Connection:** Luer Slip / Luer Lock
- **Volume:** 5ml
- **Material:** Medical Grade PP

**Certifications:**
- CE MDR (EU 2017/745)
- ISO 13485
- FDA Registered`,
    citations: [
      { id: '1', type: 'product', name: 'KDL-SYR-05', reference: 'Product Database' },
      { id: '2', type: 'document', name: 'KDL-SYR-05_Datasheet_v2.1.pdf', reference: 'Datasheet', page: 2 },
      { id: '3', type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' },
    ]
  },

  'Is your syringe CE MDR certified?': {
    content: `Yes, our syringes are CE certified under EU MDR (Regulation 2017/745).

**Notified Body:** TÜV SÜD
**Certificate Number:** TUVMDR-2023-78432
**Scope:** Class IIa Medical Devices

The products comply with:
- ISO 7886 (Sterile hypodermic syringes)
- ISO 13485 (Quality Management)
- EU MDR 2017/745

Would you like me to generate a formal compliance letter or provide the certificate?`,
    citations: [
      { id: '1', type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' },
      { id: '2', type: 'product', name: 'KDL-SYR-05', reference: 'Certification Records' },
      { id: '3', type: 'document', name: 'ISO 13485 Certificate', reference: 'TUV13485-2022-45678' },
    ]
  },

  'Do you have alternative to BD 5ml syringe?': {
    content: `**Equivalent Product Found:**

**Model:** KDL-SYR-05
**Needle:** 23G (also available in 21G)
**Connection:** Luer Lock (Luer Slip available)
**Certification:** CE MDR, ISO 13485, FDA

**Key Features:**
- Same 5ml capacity
- Compatible with all standard needles
- Sterile, single-use
- Latex-free

**Advantages over BD:**
- Competitive pricing
- Faster delivery (stock available)
- Custom packaging options

Would you like a sample or quotation?`,
    citations: [
      { id: '1', type: 'product', name: 'KDL-SYR-05', reference: 'Product Database' },
      { id: '2', type: 'competitor', name: 'BD 5ml Syringe', reference: 'Competitor Database' },
      { id: '3', type: 'document', name: 'Competitive Analysis Report', reference: 'Q1-2024' },
    ]
  },

  'ICU syringe recommendation': {
    content: `**ICU Syringe Recommendations:**

**For General ICU Use:**
- 3ml Syringe (KDL-SYR-03) - Medication administration
- 5ml Syringe (KDL-SYR-05) - Standard dosing
- 10ml Syringe (KDL-SYR-10) - Fluid management

**For Critical Care:**
- 20ml Syringe (KDL-SYR-20) - Irrigation, aspiration
- 50ml Syringe (KDL-SYR-50) - Enteral feeding

**All models include:**
- Clear graduation markings
- Luer Lock connection
- Sterile packaging
- CE MDR / FDA certified

**Recommended Set:** ICU Basic Set (3ml, 5ml, 10ml, 20ml)

Would you like detailed specifications for any model?`,
    citations: [
      { id: '1', type: 'product', name: 'KDL-SYR-03', reference: 'Product Database' },
      { id: '2', type: 'product', name: 'KDL-SYR-05', reference: 'Product Database' },
      { id: '3', type: 'product', name: 'KDL-SYR-10', reference: 'Product Database' },
      { id: '4', type: 'document', name: 'ICU Product Guide', reference: 'Clinical Applications' },
    ]
  },

  'Draft a reply about CE certification': {
    content: `**Draft Email:**

Subject: CE MDR Certification Confirmation

Dear [Customer Name],

Thank you for your inquiry regarding our CE certification status.

I can confirm that all our syringe products are CE marked under the EU Medical Device Regulation (EU) 2017/745 (MDR).

**Certification Details:**
- Notified Body: TÜV SÜD Product Service GmbH
- Certificate Number: TUVMDR-2023-78432
- Device Classification: Class IIa
- Scope: Sterile hypodermic syringes for single use

Our quality management system is certified to ISO 13485:2016, ensuring consistent compliance with regulatory requirements.

Please find attached:
- CE Certificate
- Declaration of Conformity
- ISO 13485 Certificate

Should you need any additional documentation, please let me know.

Best regards,
[Your Name]
Technical Sales`,
    citations: [
      { id: '1', type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' },
      { id: '2', type: 'certificate', name: 'ISO 13485 Certificate', reference: 'TUV13485-2022-45678' },
      { id: '3', type: 'document', name: 'Email Template Library', reference: 'Sales Resources' },
    ]
  },

  'Show me the datasheet for 5ml syringe': {
    content: `**Technical Documentation - 5ml Syringe**

Available documents for KDL-SYR-05:

1. **Product Datasheet** (PDF, 2.3MB)
   - Complete specifications
   - Performance data
   - Compatibility chart

2. **Instructions for Use (IFU)** (PDF, 856KB)
   - Usage instructions
   - Safety warnings
   - Disposal guidelines

3. **CE Certificate** (PDF, 1.1MB)
   - MDR compliance
   - Notified body certification

4. **Declaration of Conformity** (PDF, 412KB)
   - Regulatory compliance statement

5. **ISO 13485 Certificate** (PDF, 890KB)
   - Quality management certification

All documents are available for download. Would you like me to generate a document package?`,
    citations: [
      { id: '1', type: 'product', name: 'KDL-SYR-05', reference: 'Document Library' },
      { id: '2', type: 'document', name: 'KDL-SYR-05_Datasheet_v2.1.pdf', reference: 'Datasheets', page: 1 },
      { id: '3', type: 'document', name: 'KDL-SYR-05_IFU_EN.pdf', reference: 'IFU Documents' },
      { id: '4', type: 'certificate', name: 'CE MDR Certificate', reference: 'Certificates' },
    ]
  },
};

// Recent questions for quick access
const recentQuestions = [
  'What is the needle size for 5ml syringe?',
  'Is your syringe CE MDR certified?',
  'Do you have alternative to BD 5ml syringe?',
  'ICU syringe recommendation',
];

export default function SalesAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your Sales AI Assistant. I can help you with:\n\n• Product specifications and technical details\n• Certification and compliance information\n• Product recommendations and alternatives\n• Drafting customer emails\n• Finding technical documents\n\nAll my answers include **Source** citations for full traceability. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showRecentQuestions, setShowRecentQuestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      const responseData = sampleResponses[text] || {
        content: `I understand you're asking about "${text}". Let me search our product database for the most accurate information.\n\nBased on our records, I can provide you with detailed specifications, certifications, and documentation. Could you please clarify if you're looking for a specific product model or general information?`,
        citations: [
          { id: '1', type: 'product', name: 'Product Database', reference: 'Internal Search' },
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

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-cyan-400 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*:\s*(.+)/);
        if (match) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-cyan-400">•</span>
              <span><span className="font-medium">{match[1]}:</span> {match[2]}</span>
            </div>
          );
        }
      }
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-cyan-400">•</span>
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
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
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
                              <span className="text-cyan-400">page {citation.page}</span>
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
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
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
                    <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-[hsl(220,25%,8%)]">
          <div className="max-w-4xl mx-auto">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSend(action.prompt)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(220,25%,14%)] border border-border hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-sm text-muted-foreground hover:text-cyan-400 whitespace-nowrap"
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
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
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
                      className="px-3 py-1.5 text-xs bg-[hsl(220,25%,10%)] hover:bg-cyan-500/10 text-muted-foreground hover:text-cyan-400 rounded-full border border-border hover:border-cyan-500/30 transition-all text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex gap-3">
              <button className="p-3 rounded-xl bg-[hsl(220,25%,14%)] border border-border hover:border-cyan-500/50 transition-colors text-muted-foreground hover:text-cyan-400">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask about products, certifications, or request document..."
                  className="w-full pr-12 bg-[hsl(220,25%,14%)] border-border focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
              </div>
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Product Info */}
      <div className="w-80 border-l border-border bg-[hsl(220,25%,10%)] p-4 overflow-y-auto hidden xl:block">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          Recent Products
        </h3>
        
        <div className="space-y-3">
          {sampleProducts.map((product) => (
            <Card key={product.id} className="bg-[hsl(220,25%,14%)] border-border hover:border-cyan-500/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.model}</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                    Active
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Needle: {product.needleSize}</p>
                  <p>Connection: {product.connection}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors">
                    <FileText className="w-3 h-3" />
                    Docs
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-white mt-6 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          Recent Questions
        </h3>
        
        <div className="space-y-2">
          {recentQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(question)}
              className="w-full text-left p-3 bg-[hsl(220,25%,14%)] border border-border rounded-lg hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
            >
              <p className="text-xs text-muted-foreground hover:text-cyan-400 line-clamp-2">{question}</p>
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-white mt-6 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          Quick Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-3">
            <p className="text-2xl font-bold text-cyan-400">156</p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-3">
            <p className="text-2xl font-bold text-emerald-400">89</p>
            <p className="text-xs text-muted-foreground">Certifications</p>
          </div>
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-400">42</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </div>
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">1.2k</p>
            <p className="text-xs text-muted-foreground">Documents</p>
          </div>
        </div>
      </div>
    </div>
  );
}
