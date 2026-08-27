import React from 'react';
import { KpiGrid } from '../components/KpiGrid.js';
import { RevenueRecoveryChart } from '../components/RevenueRecoveryChart.js';
import { RightAnalyticsPanel } from '../components/RightAnalyticsPanel.js';
import { RecentRecoveryCases } from '../components/RecentRecoveryCases.js';
import { DashboardCopilot } from '../components/DashboardCopilot.js';

interface OverviewPageProps {
  onSelectCase: (caseOrTxId: string) => void;
  onViewAllCases: () => void;
  onViewReport?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onSelectCase,
  onViewAllCases,
  onViewReport,
}) => {
  return (
    <div className="screen22-dashboard">
      {/* 1. Row 1: Four Screen 22 KPI Cards (Live from Context) */}
      <KpiGrid />

      {/* 2. Row 2: Large Revenue Recovery Chart (Left) + Stacked Analytics Cards (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(290px, 1fr)',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        <RevenueRecoveryChart />
        <RightAnalyticsPanel onViewReport={onViewReport || onViewAllCases} />
      </div>

      {/* 3. Row 3: Recent Recovery Cases (Left) + PayToBro Copilot (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(290px, 1fr)',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        <RecentRecoveryCases
          onSelectCase={onSelectCase}
          onViewAll={onViewAllCases}
        />
        <DashboardCopilot onSelectTransaction={onSelectCase} />
      </div>
    </div>
  );
};
