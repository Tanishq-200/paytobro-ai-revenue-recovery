import React from 'react';
import {
  Home,
  ShieldAlert,
  Cpu,
  Bot,
  BarChart3,
  FileText,
  Settings,
  Search,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'cases'
  | 'agent'
  | 'failed-payments'
  | 'recovery-queue'
  | 'payment-history'
  | 'copilot'
  | 'analytics'
  | 'audit'
  | 'settings'
  | 'website'
  | 'simulation'
  | 'login';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  searchTerm = '',
  onSearchChange,
}) => {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 10px',
        zIndex: 20,
        overflowY: 'auto',
      }}
    >
      {/* Top Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Brand */}
        <div style={{ padding: '2px 6px' }}>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
            }}
          >
            PAYTOBRO
          </div>
          <div
            style={{
              fontSize: '9.5px',
              color: '#10B981',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}
          >
            AI REVENUE RECOVERY
          </div>
        </div>

        {/* Search for... with ⌘K */}
        <div style={{ position: 'relative' }}>
          <Search
            size={13}
            color="#64748B"
            style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search for..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0C1017',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 28px 6px 28px',
              fontSize: '12px',
              color: '#F1F5F9',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '9.5px',
              fontFamily: 'var(--font-mono)',
              color: '#64748B',
              border: '1px solid #1E273A',
              padding: '1.5px 3.5px',
              borderRadius: '3px',
              lineHeight: 1,
            }}
          >
            ⌘K
          </div>
        </div>

        {/* Navigation Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Section: Dashboard */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '3px 6px',
                color: '#94A3B8',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Home size={13} color="#10B981" />
                <span>Dashboard</span>
              </div>
              <ChevronDown size={11} color="#64748B" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
              {/* Overview */}
              <button
                onClick={() => onTabChange('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '5px 8px 5px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeTab === 'overview' ? '#0B2218' : 'transparent',
                  border: activeTab === 'overview' ? '1px solid #10B981' : '1px solid transparent',
                  color: activeTab === 'overview' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: activeTab === 'overview' ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Overview
              </button>

              <button
                onClick={() => onTabChange('cases')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '5px 8px 5px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeTab === 'cases' ? '#0B2218' : 'transparent',
                  border: activeTab === 'cases' ? '1px solid #10B981' : '1px solid transparent',
                  color: activeTab === 'cases' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: activeTab === 'cases' ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Recovery Cases
              </button>

              <button
                onClick={() => onTabChange('agent')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '5px 8px 5px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeTab === 'agent' ? '#0B2218' : 'transparent',
                  border: activeTab === 'agent' ? '1px solid #10B981' : '1px solid transparent',
                  color: activeTab === 'agent' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: activeTab === 'agent' ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Recovery Agent
              </button>
            </div>
          </div>

          {/* Section: Transactions */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '3px 6px',
                color: '#94A3B8',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={13} color="#94A3B8" />
                <span>Transactions</span>
              </div>
              <ChevronDown size={11} color="#64748B" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
              {[
                { id: 'failed-payments' as const, label: 'Failed Payments' },
                { id: 'recovery-queue' as const, label: 'Recovery Queue' },
                { id: 'payment-history' as const, label: 'Payment History' },
              ].map((sub) => {
                const isActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onTabChange(sub.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '5px 8px 5px 22px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? '#0B2218' : 'transparent',
                      border: isActive ? '1px solid #10B981' : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: AI */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '3px 6px',
                color: '#94A3B8',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} color="#818CF8" />
                <span>AI</span>
              </div>
              <ChevronDown size={11} color="#64748B" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
              <button
                onClick={() => onTabChange('copilot')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '5px 8px 5px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeTab === 'copilot' ? '#0B2218' : 'transparent',
                  border: activeTab === 'copilot' ? '1px solid #10B981' : '1px solid transparent',
                  color: activeTab === 'copilot' ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: activeTab === 'copilot' ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                PayToBro Copilot
              </button>
            </div>
          </div>

          {/* Direct Nav Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
              { id: 'audit' as const, label: 'Audit Logs', icon: FileText },
              { id: 'settings' as const, label: 'Settings', icon: Settings },
            ].map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? '#0B2218' : 'transparent',
                    border: isActive ? '1px solid #10B981' : '1px solid transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Icon size={14} color={isActive ? '#10B981' : '#64748B'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Demo Mode + User Profile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Prototype Website Switcher pill */}
        <button
          onClick={() => onTabChange(activeTab === 'website' ? 'overview' : 'website')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            backgroundColor: '#0C1017',
            border: '1px solid var(--border-card)',
            color: '#94A3B8',
            borderRadius: 'var(--radius-sm)',
            padding: '5px 6px',
            fontSize: '10.5px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {activeTab === 'website' ? '← Back to App Dashboard' : 'View Public Website / Prototype'}
        </button>

        {/* Demo Mode active */}
        <div style={{ padding: '2px 4px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Demo Mode</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 600 }}>Active</span>
          </div>
        </div>

        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 2px 0',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                backgroundColor: '#16202D',
                border: '1px solid #233044',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              TK
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
                Tanishq K.
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>
                Admin
              </div>
            </div>
          </div>

          <ChevronDown size={12} color="#64748B" />
        </div>
      </div>
    </aside>
  );
};
