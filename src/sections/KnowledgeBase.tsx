import { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Package, 
  Award, 
  Globe,
  Download,
  MoreHorizontal,
  Database,
  Plus,
  Upload,
  Trash2,
  Edit,
  Eye,
  Shield,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product, Certification, Regulation, TechnicalDocument, CompetitorProduct, MarketRegistration } from '@/types';
import ProductDetail from './ProductDetail';
import DocumentParser from './DocumentParser';

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Disposable Syringe',
    model: 'KDL-SYR-05',
    category: 'Syringe',
    description: 'High-quality disposable syringe for safe medication administration',
    specifications: {
      'Needle Size': '21G / 23G',
      'Connection': 'Luer Slip / Luer Lock',
      'Volume': '5ml',
      'Material': 'Medical Grade PP',
      'Graduation': '0.2ml increments',
      'Packaging': 'Sterile, 100pcs/box',
    },
    certifications: ['CE MDR', 'ISO13485', 'FDA'],
    needleSize: '21G / 23G',
    connection: 'Luer Slip / Luer Lock',
    packaging: 'Sterile, 100pcs/box',
    equivalentTo: ['BD 5ml Syringe', 'Terumo 5ml Syringe'],
    applications: ['Hospital & Clinical Use', 'ICU & Emergency', 'Home Healthcare', 'Vaccination Programs'],
    materials: ['Medical Grade Polypropylene', 'Stainless Steel Needle', 'Latex-free Piston'],
    sterility: 'EO Gas Sterilized',
    standards: ['ISO 7886-1', 'ISO 13485', 'CE MDR 2017/745'],
  },
  {
    id: '2',
    name: 'Disposable Syringe',
    model: 'KDL-SYR-03',
    category: 'Syringe',
    description: '3ml disposable syringe for precise medication dosing',
    specifications: {
      'Needle Size': '25G / 26G',
      'Connection': 'Luer Lock',
      'Volume': '3ml',
      'Material': 'Medical Grade PP',
      'Graduation': '0.1ml increments',
      'Packaging': 'Sterile, 100pcs/box',
    },
    certifications: ['CE MDR', 'ISO13485', 'FDA'],
    needleSize: '25G / 26G',
    connection: 'Luer Lock',
    packaging: 'Sterile, 100pcs/box',
    equivalentTo: ['BD 3ml Syringe'],
    applications: ['Pediatric Care', 'Diabetes Management', 'Vaccination', 'Clinical Trials'],
    materials: ['Medical Grade Polypropylene', 'Stainless Steel Needle'],
    sterility: 'EO Gas Sterilized',
    standards: ['ISO 7886-1', 'ISO 13485'],
  },
  {
    id: '3',
    name: 'Disposable Syringe',
    model: 'KDL-SYR-10',
    category: 'Syringe',
    description: '10ml syringe for fluid management and irrigation',
    specifications: {
      'Needle Size': '21G',
      'Connection': 'Luer Lock',
      'Volume': '10ml',
      'Material': 'Medical Grade PP',
      'Graduation': '0.5ml increments',
      'Packaging': 'Sterile, 100pcs/box',
    },
    certifications: ['CE MDR', 'ISO13485'],
    needleSize: '21G',
    connection: 'Luer Lock',
    packaging: 'Sterile, 100pcs/box',
    equivalentTo: ['BD 10ml Syringe'],
    applications: ['Fluid Management', 'Irrigation', 'Enteral Feeding', 'Wound Care'],
    materials: ['Medical Grade Polypropylene'],
    sterility: 'EO Gas Sterilized',
    standards: ['ISO 7886-1'],
  },
];

const sampleCertifications: Certification[] = [
  {
    id: '1',
    productId: 'KDL-SYR-05',
    productName: 'Disposable Syringe 5ml',
    type: 'MDR',
    number: 'TUVMDR-2023-78432',
    issuedBy: 'TÜV SÜD',
    issueDate: new Date('2023-03-15'),
    expiryDate: new Date('2028-03-14'),
    status: 'valid',
    scope: 'Class IIa Medical Devices - Sterile Hypodermic Syringes',
  },
  {
    id: '2',
    productId: 'KDL-SYR-05',
    productName: 'Disposable Syringe 5ml',
    type: 'ISO13485',
    number: 'TUV13485-2022-45678',
    issuedBy: 'TÜV SÜD',
    issueDate: new Date('2022-08-20'),
    expiryDate: new Date('2025-08-19'),
    status: 'valid',
    scope: 'Quality Management System for Medical Devices',
  },
  {
    id: '3',
    productId: 'KDL-SYR-03',
    productName: 'Disposable Syringe 3ml',
    type: 'MDR',
    number: 'TUVMDR-2023-78433',
    issuedBy: 'TÜV SÜD',
    issueDate: new Date('2023-03-15'),
    expiryDate: new Date('2028-03-14'),
    status: 'valid',
  },
  {
    id: '4',
    productId: 'KDL-SYR-03',
    productName: 'Disposable Syringe 3ml',
    type: 'FDA',
    number: 'K123456',
    issuedBy: 'FDA',
    issueDate: new Date('2022-01-10'),
    expiryDate: new Date('2027-01-09'),
    status: 'valid',
  },
];

const sampleRegulations: Regulation[] = [
  {
    id: '1',
    region: 'European Union',
    regulation: 'EU MDR 2017/745',
    deviceClass: 'IIa',
    requirements: [
      'Technical Documentation (Annex II)',
      'Quality Management System (Annex IX)',
      'Clinical Evaluation Report',
      'Risk Management File',
    ],
    documents: ['CE Certificate', 'DoC', 'IFU'],
  },
  {
    id: '2',
    region: 'United States',
    regulation: 'FDA 21 CFR Part 820',
    deviceClass: 'Class II',
    requirements: [
      '510(k) Premarket Notification',
      'Quality System Regulation',
      'Medical Device Reporting',
    ],
    documents: ['510(k) Clearance', 'FDA Registration'],
  },
  {
    id: '3',
    region: 'Thailand',
    regulation: 'Thai FDA Medical Device Act',
    deviceClass: 'Class 2',
    requirements: [
      'Thai FDA Registration',
      'Free Sale Certificate',
      'ISO 13485 Certificate',
      'Thai Labeling',
    ],
    documents: ['Registration Certificate', 'Import License'],
  },
];

const sampleDocuments: TechnicalDocument[] = [
  {
    id: '1',
    productId: '1',
    productName: 'KDL-SYR-05',
    name: 'KDL-SYR-05_Datasheet_v2.1.pdf',
    type: 'datasheet',
    size: '2.3 MB',
    pages: 8,
    uploadDate: new Date('2024-01-15'),
    status: 'parsed',
    parsedContent: {
      specifications: ['Needle: 21G / 23G', 'Volume: 5ml', 'Material: Medical Grade PP'],
      materials: ['Polypropylene', 'Stainless Steel Needle', 'Rubber Piston'],
      sterility: 'EO Gas Sterilized, Sterile R',
      standards: ['ISO 7886-1', 'ISO 13485', 'CE MDR 2017/745'],
      fullText: 'Full document text...',
      extractedAt: new Date('2024-01-15'),
    },
  },
  {
    id: '2',
    productId: '1',
    productName: 'KDL-SYR-05',
    name: 'KDL-SYR-05_IFU_EN.pdf',
    type: 'ifu',
    size: '856 KB',
    pages: 4,
    uploadDate: new Date('2024-01-10'),
    status: 'parsed',
    parsedContent: {
      specifications: ['Instructions for Use', 'Safety Warnings', 'Disposal Guidelines'],
      warnings: ['Single use only', 'Do not reuse', 'Check package integrity'],
      instructions: ['Remove cap', 'Draw medication', 'Administer slowly'],
      fullText: 'Full IFU text...',
      extractedAt: new Date('2024-01-10'),
    },
  },
  {
    id: '3',
    productId: '1',
    productName: 'KDL-SYR-05',
    name: 'CE_Certificate_TUVMDR-2023-78432.pdf',
    type: 'certificate',
    size: '1.1 MB',
    pages: 2,
    uploadDate: new Date('2023-03-15'),
    status: 'pending',
  },
  {
    id: '4',
    productId: '2',
    productName: 'KDL-SYR-03',
    name: 'KDL-SYR-03_Datasheet_v1.5.pdf',
    type: 'datasheet',
    size: '1.8 MB',
    pages: 6,
    uploadDate: new Date('2024-01-12'),
    status: 'pending',
  },
];

const sampleCompetitors: CompetitorProduct[] = [
  {
    id: '1',
    competitorName: 'BD',
    productName: 'Disposable Syringe',
    model: 'BD-5ml',
    category: 'Syringe',
    specifications: {
      'Needle Size': '21G / 23G',
      'Connection': 'Luer Lock',
      'Volume': '5ml',
      'Material': 'Medical Grade PP',
    },
    equivalentModel: 'KDL-SYR-05',
    equivalentProductId: '1',
    differences: ['BD uses proprietary needle coating', 'KDL offers more needle size options'],
    advantages: ['Competitive pricing', 'Faster delivery', 'Custom packaging available'],
    disadvantages: ['Lower brand recognition in some markets'],
  },
  {
    id: '2',
    competitorName: 'Terumo',
    productName: 'Hypodermic Syringe',
    model: 'TER-5ml',
    category: 'Syringe',
    specifications: {
      'Needle Size': '23G',
      'Connection': 'Luer Slip',
      'Volume': '5ml',
      'Material': 'Medical Grade PP',
    },
    equivalentModel: 'KDL-SYR-05',
    equivalentProductId: '1',
    differences: ['Terumo uses Luer Slip only', 'KDL offers both Luer Slip and Luer Lock'],
    advantages: ['Better needle sharpness', 'More connection options', 'CE MDR + FDA certified'],
    disadvantages: [],
  },
];

const sampleRegistrations: MarketRegistration[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Disposable Syringe',
    productModel: 'KDL-SYR-05',
    region: 'Europe',
    country: 'Germany',
    status: 'registered',
    registrationNumber: 'DE-MDR-2023-78432',
    registrationDate: new Date('2023-03-15'),
    expiryDate: new Date('2028-03-14'),
    requirements: ['CE MDR Certificate', 'ISO 13485', 'Technical Documentation'],
    requiredDocuments: ['CE Certificate', 'DoC', 'IFU'],
    distributor: 'MediTrade GmbH',
    distributorContact: 'contact@meditrade.de',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Disposable Syringe',
    productModel: 'KDL-SYR-05',
    region: 'Asia',
    country: 'Thailand',
    status: 'registered',
    registrationNumber: 'TH-FDA-2023-45678',
    registrationDate: new Date('2023-06-20'),
    expiryDate: new Date('2028-06-19'),
    requirements: ['Thai FDA Registration', 'Free Sale Certificate', 'ISO 13485', 'Thai Labeling'],
    requiredDocuments: ['Registration Certificate', 'Import License'],
    distributor: 'Thai Medical Supply Co.',
    distributorContact: 'info@thaimedical.co.th',
    timeline: '6 months',
  },
  {
    id: '3',
    productId: '1',
    productName: 'Disposable Syringe',
    productModel: 'KDL-SYR-05',
    region: 'North America',
    country: 'United States',
    status: 'registered',
    registrationNumber: '510(k)-K123456',
    registrationDate: new Date('2022-01-10'),
    expiryDate: new Date('2027-01-09'),
    requirements: ['510(k) Clearance', 'FDA Registration', 'Quality System Regulation'],
    requiredDocuments: ['510(k) Clearance Letter', 'FDA Registration Certificate'],
    distributor: 'US Medical Distributors LLC',
  },
  {
    id: '4',
    productId: '1',
    productName: 'Disposable Syringe',
    productModel: 'KDL-SYR-05',
    region: 'Asia',
    country: 'Japan',
    status: 'pending',
    requirements: ['PMDA Registration', 'Japan Quality System', 'Japanese Labeling'],
    requiredDocuments: ['PMDA Application', 'Quality System Certificate'],
    timeline: '12-18 months',
    notes: 'Application submitted, under review',
  },
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [documents, setDocuments] = useState<TechnicalDocument[]>(sampleDocuments);

  const filteredProducts = sampleProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleParseComplete = (updatedDoc: TechnicalDocument) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        certifications={sampleCertifications}
        documents={documents}
        competitors={sampleCompetitors}
        registrations={sampleRegistrations}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-[hsl(220,25%,14%)]">
                <TabsTrigger value="products" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="certifications" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <Award className="w-4 h-4 mr-2" />
                  Certifications
                </TabsTrigger>
                <TabsTrigger value="regulations" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <Globe className="w-4 h-4 mr-2" />
                  Regulations
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="competitors" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <Shield className="w-4 h-4 mr-2" />
                  Competitors
                </TabsTrigger>
                <TabsTrigger value="registrations" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  Registrations
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="products" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name, model, or specification..."
                    className="pl-10 bg-[hsl(220,25%,14%)] border-border focus:border-blue-500/50"
                  />
                </div>
                <Button variant="outline" className="border-border hover:border-blue-500/50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-[hsl(220,25%,14%)] border-border hover:border-blue-500/30 transition-colors group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium text-white">{product.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{product.model}</p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {product.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-1 text-sm">
                        {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[hsl(220,25%,18%)] text-muted-foreground text-sm hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleCertifications.map((cert) => (
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
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {cert.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Product</span>
                        <span className="text-white">{cert.productName || cert.productId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Issued By</span>
                        <span className="text-white">{cert.issuedBy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expiry</span>
                        <span className="text-white">{cert.expiryDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className="p-2 rounded-lg bg-[hsl(220,25%,18%)] text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="regulations" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              {sampleRegulations.map((reg) => (
                <Card key={reg.id} className="bg-[hsl(220,25%,14%)] border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium text-white">{reg.region}</CardTitle>
                          <p className="text-xs text-muted-foreground">{reg.regulation}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">
                        Class {reg.deviceClass}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {reg.requirements.map((req, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-[hsl(220,25%,18%)] text-xs text-white">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Required Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {reg.documents.map((doc, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-5xl mx-auto">
              <DocumentParser documents={documents} onParseComplete={handleParseComplete} />
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleCompetitors.map((comp) => (
                  <Card key={comp.id} className="bg-[hsl(220,25%,14%)] border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{comp.competitorName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{comp.productName} - {comp.model}</p>
                        </div>
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          Equivalent: {comp.equivalentModel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(comp.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-[hsl(220,25%,10%)] rounded text-sm">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                      {comp.advantages && comp.advantages.length > 0 && (
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <p className="text-sm font-medium text-emerald-400 mb-2">Our Advantages</p>
                          <ul className="space-y-1">
                            {comp.advantages.map((adv, idx) => (
                              <li key={idx} className="text-sm text-white flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                {adv}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registrations" className="flex-1 p-6 m-0 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleRegistrations.map((reg) => (
                  <Card key={reg.id} className="bg-[hsl(220,25%,14%)] border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium text-white">{reg.country}</CardTitle>
                            <p className="text-xs text-muted-foreground">{reg.productModel}</p>
                          </div>
                        </div>
                        <Badge className={
                          reg.status === 'registered' ? 'bg-emerald-500/20 text-emerald-400' :
                          reg.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {reg.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {reg.registrationNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Reg. Number</span>
                          <span className="text-white">{reg.registrationNumber}</span>
                        </div>
                      )}
                      {reg.expiryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expiry</span>
                          <span className="text-white">{reg.expiryDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {reg.distributor && (
                        <div className="p-2 bg-[hsl(220,25%,10%)] rounded text-sm">
                          <span className="text-muted-foreground">Distributor: </span>
                          <span className="text-white">{reg.distributor}</span>
                        </div>
                      )}
                      {reg.timeline && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Timeline</span>
                          <span className="text-white">{reg.timeline}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Sidebar - Stats */}
      <div className="w-72 border-l border-border bg-[hsl(220,25%,10%)] p-4 overflow-y-auto hidden xl:block">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Database Overview
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Products</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">156</p>
            <p className="text-xs text-emerald-400 mt-1">+12 this month</p>
          </div>
          
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Certifications</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">89</p>
            <p className="text-xs text-emerald-400 mt-1">All valid</p>
          </div>
          
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">AI Parsed Docs</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400">847</p>
            <p className="text-xs text-muted-foreground mt-1">of 1,247 total</p>
          </div>
          
          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Competitors</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-xs text-muted-foreground mt-1">Products mapped</p>
          </div>

          <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Markets</span>
              <MapPin className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">42</p>
            <p className="text-xs text-muted-foreground mt-1">Countries registered</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white mb-4">Storage</h3>
        <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Used Space</span>
            <span className="text-sm text-white">45.2 GB</span>
          </div>
          <div className="w-full h-2 bg-[hsl(220,25%,20%)] rounded-full overflow-hidden">
            <div className="h-full w-[45%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">of 100 GB total</p>
        </div>
      </div>
    </div>
  );
}
