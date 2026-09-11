import React, { useState } from 'react';
import { Kanban, FileText, CalendarCheck, Users, Menu } from 'lucide-react';
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ATSDataProvider } from './context/ATSDataContext';
import { Sidebar, NavigationModule } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Feature Modules
import { RBACMatrixView } from './modules/rbac/RBACMatrixView';
import { RequisitionsView } from './modules/requisitions/RequisitionsView';
import { PipelineKanbanView } from './modules/pipeline/PipelineKanbanView';
import { CareersPortalView } from './modules/careers/CareersPortalView';
import { InterviewsView } from './modules/interviews/InterviewsView';
import { OffersView } from './modules/offers/OffersView';
import { AutomationsView } from './modules/automations/AutomationsView';
import { AnalyticsDashboardView } from './modules/analytics/AnalyticsDashboardView';
import { TalentPoolView } from './modules/talent-pool/TalentPoolView';
import { PublicJobApplicationPage } from './modules/careers/PublicJobApplicationPage';

const MainAppContent: React.FC = () => {
  const { t } = useThemeLanguage();
  const [activeModule, setActiveModule] = useState<NavigationModule>('pipeline');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Detect public candidate application portal link from URL query params
  const [publicJobParams, setPublicJobParams] = useState<{
    jobId: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referralName?: string;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('jobId');
    if (jobId) {
      return {
        jobId,
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        referralName: params.get('ref') || undefined,
      };
    }
    return null;
  });

  if (publicJobParams) {
    return (
      <PublicJobApplicationPage
        jobId={publicJobParams.jobId}
        utmSource={publicJobParams.utmSource}
        utmMedium={publicJobParams.utmMedium}
        utmCampaign={publicJobParams.utmCampaign}
        referralName={publicJobParams.referralName}
        onBackToAdmin={() => {
          window.history.pushState({}, '', window.location.pathname);
          setPublicJobParams(null);
          setActiveModule('careers');
        }}
      />
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'analytics':
        return <AnalyticsDashboardView />;
      case 'requisitions':
        return <RequisitionsView />;
      case 'pipeline':
        return <PipelineKanbanView />;
      case 'careers':
        return <CareersPortalView />;
      case 'interviews':
        return <InterviewsView />;
      case 'offers':
        return <OffersView />;
      case 'talent-pool':
        return <TalentPoolView />;
      case 'automations':
        return <AutomationsView />;
      case 'rbac':
        return <RBACMatrixView />;
      default:
        return <PipelineKanbanView />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-neutral-main flex flex-row antialiased selection:bg-mint-100 selection:text-pine">
      {/* Sidebar (Desktop Persistent + Mobile Drawer) */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <Header
          activeModule={activeModule}
          onOpenRBACMatrix={() => setActiveModule('rbac')}
          onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Module Canvas */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar (< md screens) */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 dark:bg-surface-soft/95 backdrop-blur-md border-t border-surface-border md:hidden px-2 py-1.5 flex items-center justify-around shadow-lg safe-bottom"
      >
        <button
          onClick={() => setActiveModule('pipeline')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeModule === 'pipeline'
              ? 'text-mint-500 font-bold scale-105'
              : 'text-neutral-muted hover:text-pine'
          }`}
          title={t('مسار المرشحين', 'Candidate Pipeline')}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[10px]">{t('المسار', 'Pipeline')}</span>
        </button>

        <button
          onClick={() => setActiveModule('requisitions')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeModule === 'requisitions'
              ? 'text-mint-500 font-bold scale-105'
              : 'text-neutral-muted hover:text-pine'
          }`}
          title={t('طلبات الاحتياج', 'Requisitions')}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">{t('الاحتياج', 'Reqs')}</span>
        </button>

        <button
          onClick={() => setActiveModule('interviews')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeModule === 'interviews'
              ? 'text-mint-500 font-bold scale-105'
              : 'text-neutral-muted hover:text-pine'
          }`}
          title={t('المقابلات', 'Interviews')}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px]">{t('المقابلات', 'Interviews')}</span>
        </button>

        <button
          onClick={() => setActiveModule('talent-pool')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeModule === 'talent-pool'
              ? 'text-mint-500 font-bold scale-105'
              : 'text-neutral-muted hover:text-pine'
          }`}
          title={t('بنك المواهب', 'Talent Pool')}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">{t('المواهب', 'Talent')}</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-neutral-muted hover:text-pine transition-all"
          title={t('كل الأقسام والإعدادات', 'All Modules')}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">{t('المزيد', 'More')}</span>
        </button>
      </nav>
    </div>
  );
};

export function App() {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <ATSDataProvider>
          <MainAppContent />
        </ATSDataProvider>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}

export default App;
