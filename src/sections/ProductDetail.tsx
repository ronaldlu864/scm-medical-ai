import { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  FileText, 
  Award, 
  CheckCircle, 
  ExternalLink,
  Download,
  Beaker,
  Layers,
  Shield,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product, Certification, TechnicalDocument, CompetitorProduct, MarketRegistration } from '@/types';

interface ProductDetailProps {
  product: Product;
  certifications: Certification[];
  documents: TechnicalDocument[];
  competitors: CompetitorProduct[];
  registrations: MarketRegistration[];
  onBack: () => void;
}

export default function ProductDetail({ 
  product, 
  certifications, 
  documents, 
  competitors, 
  registrations,
  onBack 
}: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const productDocs = documents.filter(d => d.productId === product.id);
  const productCerts = certifications.filter(c => c.productId === product.model);
  const productCompetitors = competitors.filter(c => c.equivalentProductId === product.id);
  const productRegistrations = registrations.filter(r => r.productId === product.id);

  return (
    <div className="flex flex-col h-full bg-[hsl(220,25%,8%)]">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">{product.name}</h1>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              {product.model}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600">
            <ExternalLink className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="bg-[hsl(220,25%,14%)] mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Package className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="specifications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Beaker className="w-4 h-4 mr-2" />
              Specifications
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Award className="w-4 h-4 mr-2" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Layers className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="equivalents" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Shield className="w-4 h-4 mr-2" />
              Equivalents
            </TabsTrigger>
            <TabsTrigger value="markets" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <MapPin className="w-4 h-4 mr-2" />
              Markets
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-[hsl(220,25%,14%)] border-border">
                  <CardHeader>
                    <CardTitle className="text-white">Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || `${product.name} ${product.model} is a high-quality disposable medical device designed for safe and accurate medication administration. Manufactured under ISO 13485 quality management system and CE MDR certified.`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(220,25%,14%)] border-border">
                  <CardHeader>
                    <CardTitle className="text-white">Key Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3 bg-[hsl(220,25%,10%)] rounded-lg">
                          <span className="text-muted-foreground text-sm">{key}</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-[hsl(220,25%,14%)] border-border">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Certifications</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        {productCerts.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Documents</span>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {productDocs.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Markets</span>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {productRegistrations.filter(r => r.status === 'registered').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Competitor Matches</span>
                      <Badge className="bg-amber-500/20 text-amber-400">
                        {productCompetitors.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(220,25%,14%)] border-border">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="border-emerald-500/30 text-emerald-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications">
            <Card className="bg-[hsl(220,25%,14%)] border-border">
              <CardHeader>
                <CardTitle className="text-white">Complete Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                
                {product.materials && (
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">Materials</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material) => (
                        <span key={material} className="px-3 py-1 bg-[hsl(220,25%,10%)] rounded-full text-sm text-muted-foreground">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.standards && (
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">Compliance Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.standards.map((standard) => (
                        <Badge key={standard} variant="outline" className="border-blue-500/30 text-blue-400">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productCerts.map((cert) => (
                <Card key={cert.id} className="bg-[hsl(220,25%,14%)] border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Award className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium text-white">{cert.type}</CardTitle>
                          <p className="text-xs text-muted-foreground">{cert.number}</p>
                        </div>
                      </div>
                      <Badge className={
                        cert.status === 'valid' ? 'bg-emerald-500/20 text-emerald-400' :
                        cert.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }>
                        {cert.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issued By</span>
                      <span className="text-white">{cert.issuedBy}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issue Date</span>
                      <span className="text-white">{cert.issueDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expiry Date</span>
                      <span className="text-white">{cert.expiryDate.toLocaleDateString()}</span>
                    </div>
                    {cert.scope && (
                      <div className="mt-3 p-3 bg-[hsl(220,25%,10%)] rounded-lg">
                        <span className="text-muted-foreground text-sm">Scope: </span>
                        <span className="text-white text-sm">{cert.scope}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="space-y-4">
              {productDocs.map((doc) => (
                <Card key={doc.id} className="bg-[hsl(220,25%,14%)] border-border">
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
                            <span>•</span>
                            <span>Uploaded {doc.uploadDate.toLocaleDateString()}</span>
                          </div>
                          {doc.parsedContent && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                                AI Parsed
                              </Badge>
                              {doc.parsedContent.specifications && (
                                <span className="text-xs text-muted-foreground">
                                  {doc.parsedContent.specifications.length} specs extracted
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {doc.parsedContent && (
                      <div className="mt-4 p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                        <h4 className="text-sm font-medium text-white mb-3">AI Extracted Content</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {doc.parsedContent.materials && (
                            <div>
                              <span className="text-muted-foreground">Materials: </span>
                              <span className="text-white">{doc.parsedContent.materials.join(', ')}</span>
                            </div>
                          )}
                          {doc.parsedContent.sterility && (
                            <div>
                              <span className="text-muted-foreground">Sterility: </span>
                              <span className="text-white">{doc.parsedContent.sterility}</span>
                            </div>
                          )}
                          {doc.parsedContent.standards && (
                            <div>
                              <span className="text-muted-foreground">Standards: </span>
                              <span className="text-white">{doc.parsedContent.standards.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="bg-[hsl(220,25%,14%)] border-border">
              <CardHeader>
                <CardTitle className="text-white">Recommended Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.applications?.map((app, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white">{app}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-start gap-3 p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium">Hospital & Clinical Use</span>
                          <p className="text-sm text-muted-foreground mt-1">General medication administration, fluid management</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium">ICU & Emergency</span>
                          <p className="text-sm text-muted-foreground mt-1">Critical care medication delivery, emergency procedures</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium">Home Healthcare</span>
                          <p className="text-sm text-muted-foreground mt-1">Patient self-administration, home nursing care</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium">Vaccination Programs</span>
                          <p className="text-sm text-muted-foreground mt-1">Immunization campaigns, mass vaccination</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equivalents Tab */}
          <TabsContent value="equivalents">
            <div className="space-y-4">
              {productCompetitors.length > 0 ? (
                productCompetitors.map((comp) => (
                  <Card key={comp.id} className="bg-[hsl(220,25%,14%)] border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{comp.competitorName} {comp.productName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{comp.model}</p>
                        </div>
                        <Badge className="bg-cyan-500/20 text-cyan-400">Equivalent</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(comp.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-3 bg-[hsl(220,25%,10%)] rounded-lg">
                            <span className="text-muted-foreground text-sm">{key}</span>
                            <span className="text-white text-sm">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      {comp.differences && (
                        <div className="p-4 bg-[hsl(220,25%,10%)] rounded-lg border border-border">
                          <h4 className="text-sm font-medium text-white mb-2">Key Differences</h4>
                          <ul className="space-y-1">
                            {comp.differences.map((diff, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-amber-400" />
                                {diff}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {comp.advantages && (
                        <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <h4 className="text-sm font-medium text-emerald-400 mb-2">Our Advantages</h4>
                          <ul className="space-y-1">
                            {comp.advantages.map((adv, idx) => (
                              <li key={idx} className="text-sm text-white flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                {adv}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-[hsl(220,25%,14%)] border-border">
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-white font-medium">No competitor equivalents mapped</p>
                    <p className="text-sm text-muted-foreground mt-1">Add competitor products to enable AI recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Markets Tab */}
          <TabsContent value="markets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productRegistrations.length > 0 ? (
                productRegistrations.map((reg) => (
                  <Card key={reg.id} className="bg-[hsl(220,25%,14%)] border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium text-white">{reg.country}</CardTitle>
                            <p className="text-xs text-muted-foreground">{reg.region}</p>
                          </div>
                        </div>
                        <Badge className={
                          reg.status === 'registered' ? 'bg-emerald-500/20 text-emerald-400' :
                          reg.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          reg.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {reg.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {reg.registrationNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Registration No.</span>
                          <span className="text-white">{reg.registrationNumber}</span>
                        </div>
                      )}
                      {reg.registrationDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Registration Date</span>
                          <span className="text-white">{reg.registrationDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {reg.expiryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expiry Date</span>
                          <span className="text-white">{reg.expiryDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {reg.distributor && (
                        <div className="p-3 bg-[hsl(220,25%,10%)] rounded-lg">
                          <span className="text-muted-foreground text-sm">Distributor: </span>
                          <span className="text-white text-sm">{reg.distributor}</span>
                        </div>
                      )}
                      {reg.requirements.length > 0 && (
                        <div>
                          <span className="text-muted-foreground text-sm">Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {reg.requirements.map((req, idx) => (
                              <span key={idx} className="px-2 py-1 bg-[hsl(220,25%,10%)] rounded text-xs text-white">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2">
                  <Card className="bg-[hsl(220,25%,14%)] border-border">
                    <CardContent className="p-8 text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-white font-medium">No market registrations found</p>
                      <p className="text-sm text-muted-foreground mt-1">Add registration data to track market availability</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
