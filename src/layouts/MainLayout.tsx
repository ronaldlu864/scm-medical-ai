import { useState } from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  Database, 
  Stethoscope,
  Menu,
  X,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import type { Module } from '@/types';
import SalesAIAssistant from '@/sections/SalesAIAssistant';
import ComplianceAICopilot from '@/sections/ComplianceAICopilot';
import KnowledgeBase from '@/sections/KnowledgeBase';
import UserHistory from '@/sections/UserHistory';

export default function MainLayout() {
  const { user, signOut } = useAuth();
  const [activeModule, setActiveModule] = useState<Module>('sales');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const modules = [
    { id: 'sales' as Module, label: 'Sales AI Assistant', icon: MessageSquare, color: 'cyan' },
    { id: 'compliance' as Module, label: 'Compliance AI Copilot', icon: ShieldCheck, color: 'emerald' },
    { id: 'database' as Module, label: 'Knowledge Base', icon: Database, color: 'blue' },
    { id: 'history' as Module, label: 'My History', icon: History, color: 'purple' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'sales':
        return <SalesAIAssistant />;
      case 'compliance':
        return <ComplianceAICopilot />;
      case 'database':
        return <KnowledgeBase />;
      case 'history':
        return <UserHistory />;
      default:
        return <SalesAIAssistant />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`flex flex-col bg-[hsl(220,25%,6%)] border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-tight">SCM Medical</span>
              <span className="text-xs text-muted-foreground">AI Suite</span>
            </div>
          )}
        </div>

        {/* Module Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? `bg-${module.color}-500/10 text-${module.color}-400 border border-${module.color}-500/30` 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? `text-${module.color}-400` : ''}`} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium text-left">{module.label}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-${module.color}-400`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Notifications</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
            <HelpCircle className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Help</span>}
          </button>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {sidebarCollapsed ? <Menu className="w-3 h-3" /> : <X className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-[hsl(220,25%,8%)]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">
              {modules.find(m => m.id === activeModule)?.label}
            </h1>
            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
              Internal Beta
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Ready
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.full_name ? getInitials(user.full_name) : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 overflow-hidden">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}
