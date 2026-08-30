import React, { useState } from 'react';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
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

const MainAppContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<NavigationModule>('pipeline');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <Header
          activeModule={activeModule}
          onOpenRBACMatrix={() => setActiveModule('rbac')}
        />

        {/* Dynamic Module Canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>
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
