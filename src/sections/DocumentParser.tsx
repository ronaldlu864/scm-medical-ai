import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Beaker,
  Shield,
  List,
  FileSearch,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TechnicalDocument } from '@/types';

interface DocumentParserProps {
  documents: TechnicalDocument[];
  onParseComplete?: (doc: TechnicalDocument) => void;
}

export default function DocumentParser({ documents, onParseComplete }: DocumentParserProps) {
  const [parsingDoc, setParsingDoc] = useState<string | null>(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<TechnicalDocument | null>(null);

  const pendingDocs = documents.filter(d => d.status === 'pending');
  const parsedDocs = documents.filter(d => d.status === 'parsed');

  const simulateParsing = (docId: string) => {
    setParsingDoc(docId);
    setParseProgress(0);

    const interval = setInterval(() => {
      setParseProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setParsingDoc(null);
          const doc = documents.find(d => d.id === docId);
          if (doc && onParseComplete) {
            onParseComplete({
              ...doc,
              status: 'parsed',
              parsedContent: {
                specifications: ['Needle: 21G', 'Volume: 5ml', 'Material: Medical Grade PP'],
                materials: ['Polypropylene', 'Stainless Steel Needle', 'Rubber Piston'],
                sterility: 'EO Gas Sterilized, Sterile R',
                standards: ['ISO 7886-1', 'ISO 13485', 'CE MDR 2017/745'],
                warnings: ['Single use only', 'Do not reuse', 'Check package integrity'],
                instructions: ['Remove cap', 'Draw medication', 'Administer slowly'],
                fullText: 'Full document text extracted from PDF...',
                extractedAt: new Date(),
              }
            });
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-[hsl(220,25%,14%)] border-border border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Upload Documents for AI Parsing</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Upload PDF documents to automatically extract specifications, materials, sterility info, and compliance standards
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>PDF</span>
              <span>•</span>
              <span>Max 50MB</span>
              <span>•</span>
              <span>Multi-page supported</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parsing Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[hsl(220,25%,14%)] border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{documents.length}</p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(220,25%,14%)] border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-400">{parsedDocs.length}</p>
                <p className="text-xs text-muted-foreground">AI Parsed</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(220,25%,14%)] border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-400">{pendingDocs.length}</p>
                <p className="text-xs text-muted-foreground">Pending Parse</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          AI Parsed Documents
        </h3>
        
        {documents.map((doc) => (
          <Card key={doc.id} className="bg-[hsl(220,25%,14%)] border-border hover:border-cyan-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{doc.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="capitalize">{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      {doc.pages && (
                        <>
                          <span>•</span>
                          <span>{doc.pages} pages</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {doc.status === 'parsed' ? (
                    <>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Parsed
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <FileSearch className="w-4 h-4" />
                        View Extracted
                      </Button>
                    </>
                  ) : doc.status === 'pending' ? (
                    <>
                      {parsingDoc === doc.id ? (
                        <div className="flex items-center gap-3 w-48">
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                          <Progress value={parseProgress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{parseProgress}%</span>
                        </div>
                      ) : (
                        <>
                          <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                          <Button 
                            size="sm" 
                            className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600"
                            onClick={() => simulateParsing(doc.id)}
                          >
                            <Sparkles className="w-4 h-4" />
                            Parse with AI
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Extracted Content Modal */}
      {selectedDoc && selectedDoc.parsedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[hsl(220,25%,10%)] border-border w-full max-w-3xl max-h-[80vh] overflow-auto">
            <CardHeader className="sticky top-0 bg-[hsl(220,25%,10%)] border-b border-border z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">AI Extracted Content</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedDoc.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDoc(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Specifications */}
              {selectedDoc.parsedContent.specifications && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <List className="w-4 h-4 text-cyan-400" />
                    Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoc.parsedContent.specifications.map((spec, idx) => (
                      <div key={idx} className="p-3 bg-[hsl(220,25%,14%)] rounded-lg border border-border">
                        <span className="text-sm text-white">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {selectedDoc.parsedContent.materials && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-purple-400" />
                    Materials
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.parsedContent.materials.map((material, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[hsl(220,25%,14%)] rounded-full text-sm text-white border border-border">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sterility */}
              {selectedDoc.parsedContent.sterility && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Sterility
                  </h4>
                  <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <span className="text-sm text-white">{selectedDoc.parsedContent.sterility}</span>
                  </div>
                </div>
              )}

              {/* Standards */}
              {selectedDoc.parsedContent.standards && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    Compliance Standards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.parsedContent.standards.map((standard, idx) => (
                      <Badge key={idx} variant="outline" className="border-blue-500/30 text-blue-400">
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {selectedDoc.parsedContent.warnings && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Warnings
                  </h4>
                  <ul className="space-y-2">
                    {selectedDoc.parsedContent.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-amber-400">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Extracted on {selectedDoc.parsedContent.extractedAt.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
