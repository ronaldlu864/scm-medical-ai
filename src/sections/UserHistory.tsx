import { useState, useEffect } from 'react';
import { 
  History, 
  MessageSquare, 
  ShieldCheck, 
  Search,
  Trash2,
  Copy,
  Check,
  Calendar,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryItem {
  id: string;
  module: 'sales' | 'compliance';
  question: string;
  answer: string;
  citations?: string;
  created_at: string;
}

export default function UserHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user?.id]);

  async function loadHistory() {
    try {
      setIsLoading(true);
      // 这里先使用模拟数据，实际部署时连接Supabase
      // const { data, error } = await supabase
      //   .from('chat_history')
      //   .select('*')
      //   .eq('user_id', user?.id)
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      // setHistory(data || []);
      
      // 模拟数据
      setHistory([
        {
          id: '1',
          module: 'sales',
          question: 'What is the needle size for 5ml syringe?',
          answer: '**Product:** Disposable Syringe 5ml\n**Model:** KDL-SYR-05\n\n**Needle Size:** 21G / 23G',
          citations: JSON.stringify([
            { type: 'product', name: 'KDL-SYR-05' },
            { type: 'document', name: 'KDL-SYR-05_Datasheet_v2.1.pdf', page: 2 }
          ]),
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          module: 'compliance',
          question: 'Is your syringe CE MDR certified?',
          answer: 'Yes, our syringes are CE certified under EU MDR (Regulation 2017/745).\n\n**Notified Body:** TÜV SÜD\n**Certificate Number:** TUVMDR-2023-78432',
          citations: JSON.stringify([
            { type: 'certificate', name: 'CE MDR Certificate', reference: 'TUVMDR-2023-78432' }
          ]),
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '3',
          module: 'sales',
          question: 'Do you have alternative to BD 5ml syringe?',
          answer: '**Equivalent Product Found:**\n\n**Model:** KDL-SYR-05\n**Needle:** 23G\n**Connection:** Luer Lock',
          citations: JSON.stringify([
            { type: 'product', name: 'KDL-SYR-05' },
            { type: 'competitor', name: 'BD 5ml Syringe' }
          ]),
          created_at: new Date(Date.now() - 259200000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteHistoryItem(id: string) {
    try {
      // await supabase.from('chat_history').delete().eq('id', id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  }

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full">
      {/* History List */}
      <div className={`${selectedItem ? 'w-1/2' : 'w-full'} border-r border-border flex flex-col`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              My Question History
            </h2>
            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
              {history.length} questions
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your questions..."
              className="pl-10 bg-[hsl(220,25%,14%)] border-border focus:border-purple-500/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white font-medium">No history yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your questions will appear here
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <Card
                  key={item.id}
                  className={`bg-[hsl(220,25%,14%)] border-border cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-purple-500/50 bg-purple-500/5'
                      : 'hover:border-purple-500/30'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.module === 'sales'
                          ? 'bg-cyan-500/10'
                          : 'bg-emerald-500/10'
                      }`}>
                        {item.module === 'sales' ? (
                          <MessageSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm line-clamp-2">
                          {item.question}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.created_at)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.module === 'sales'
                                ? 'border-cyan-500/30 text-cyan-400'
                                : 'border-emerald-500/30 text-emerald-400'
                            }`}
                          >
                            {item.module === 'sales' ? 'Sales' : 'Compliance'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detail View */}
      {selectedItem && (
        <div className="w-1/2 flex flex-col bg-[hsl(220,25%,10%)]">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-muted-foreground"
              >
                ← Back
              </button>
              <span className="text-sm text-muted-foreground">
                {formatDate(selectedItem.created_at)} at {formatTime(selectedItem.created_at)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(selectedItem.answer, selectedItem.id)}
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                title="Copy answer"
              >
                {copiedId === selectedItem.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => deleteHistoryItem(selectedItem.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Question</p>
                <p className="text-white text-lg">{selectedItem.question}</p>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Answer</p>
                <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
                  <div className="text-white whitespace-pre-wrap">
                    {selectedItem.answer}
                  </div>
                </div>
              </div>

              {selectedItem.citations && (
                <div className="border-t border-border pt-6">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Source</p>
                  <div className="bg-[hsl(220,25%,14%)] border border-border rounded-lg p-4">
                    {(() => {
                      try {
                        const citations = JSON.parse(selectedItem.citations);
                        return citations.map((c: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground capitalize">{c.type}:</span>
                            <span className="text-white font-medium">{c.name}</span>
                            {c.page && <span className="text-purple-400">page {c.page}</span>}
                            {c.reference && <span className="text-muted-foreground">({c.reference})</span>}
                          </div>
                        ));
                      } catch {
                        return <p className="text-muted-foreground">{selectedItem.citations}</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
