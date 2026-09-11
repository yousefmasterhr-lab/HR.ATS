import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Kanban, 
  Globe2, 
  CalendarCheck, 
  FileSignature, 
  Users, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useATSData } from '../../context/ATSDataContext';
import { useAuth } from '../../context/AuthContext';

export type NavigationModule = 
  | 'analytics' 
  | 'requisitions' 
  | 'pipeline' 
  | 'careers' 
  | 'interviews' 
  | 'offers' 
  | 'talent-pool' 
  | 'automations' 
  | 'rbac';

interface SidebarProps {
  activeModule: NavigationModule;
  setActiveModule: (module: NavigationModule) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const { t, direction, theme, toggleTheme } = useThemeLanguage();
  const { candidates, requisitions, interviews, offers } = useATSData();
  const { hasPermission } = useAuth();

  // Badges calculation
  const pendingApprovalsCount = requisitions.filter(
    (r) => r.status === 'pending_hr' || r.status === 'pending_finance' || r.status === 'pending_executive'
  ).length;

  const activeCandidatesCount = candidates.filter((c) => c.status === 'active').length;
  const scheduledInterviewsCount = interviews.filter((i) => i.status === 'scheduled').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'sent_to_candidate' || o.status === 'pending_approval').length;

  const navigationItems = [
    {
      id: 'analytics' as NavigationModule,
      title: 'لوحة المؤشرات والتحليلات',
      titleEn: 'Analytics Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      permission: 'view_analytics' as const,
      badge: null,
    },
    {
      id: 'requisitions' as NavigationModule,
      title: 'طلبات الاحتياج والاعتمادات',
      titleEn: 'Requisitions & Approvals',
      icon: <FileText className="w-5 h-5" />,
      permission: 'view_requisitions' as const,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    },
    {
      id: 'pipeline' as NavigationModule,
      title: 'مسار المرشحين ولوحة Kanban',
      titleEn: 'Candidate Pipeline (Kanban)',
      icon: <Kanban className="w-5 h-5" />,
      permission: 'view_candidates' as const,
      badge: activeCandidatesCount,
      badgeColor: 'bg-mint-100 dark:bg-mint-900/60 text-pine border-mint-200 dark:border-mint-700',
    },
    {
      id: 'careers' as NavigationModule,
      title: 'بوابة التوظيف وروابط UTM',
      titleEn: 'Careers Portal & Sourcing',
      icon: <Globe2 className="w-5 h-5" />,
      permission: 'view_requisitions' as const,
      badge: null,
    },
    {
      id: 'interviews' as NavigationModule,
      title: 'المقابلات وبطاقات التقييم',
      titleEn: 'Interviews & Scorecards',
      icon: <CalendarCheck className="w-5 h-5" />,
      permission: 'view_scorecards' as const,
      badge: scheduledInterviewsCount > 0 ? scheduledInterviewsCount : null,
      badgeColor: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
    },
    {
      id: 'offers' as NavigationModule,
      title: 'العروض ومسوغات التعيين',
      titleEn: 'Offers & Pre-boarding',
      icon: <FileSignature className="w-5 h-5" />,
      permission: 'view_offer' as const,
      badge: pendingOffersCount > 0 ? pendingOffersCount : null,
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    },
    {
      id: 'talent-pool' as NavigationModule,
      title: 'بنك المواهب وإدارة العلاقات',
      titleEn: 'Talent Pool CRM',
      icon: <Users className="w-5 h-5" />,
      permission: 'view_talent_pool' as const,
      badge: null,
    },
    {
      id: 'automations' as NavigationModule,
      title: 'محرك الأتمتة والقواعد',
      titleEn: 'Automation Rules',
      icon: <Zap className="w-5 h-5" />,
      permission: 'manage_automations' as const,
      badge: null,
    },
    {
      id: 'rbac' as NavigationModule,
      title: 'مصفوفة الصلاحيات (RBAC)',
      titleEn: 'RBAC Matrix & Security',
      icon: <ShieldCheck className="w-5 h-5" />,
      permission: 'manage_roles_matrix' as const,
      badge: t('وحدة 1', 'Unit 1'),
      badgeColor: 'bg-pine text-canvas border-mint-700',
    },
  ];

  const getChevronIcon = () => {
    if (direction === 'rtl') {
      return isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />;
    }
    return isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />;
  };

  return (
    <>
      {/* Desktop Sidebar (Persistent & Collapsible on md+ screens) */}
      <aside
        className={`hidden md:flex relative bg-sidebar border-e border-sidebar-border h-screen sticky top-0 flex-col transition-all duration-300 ease-in-out z-40 select-none ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
      {/* Edge Toggle Pill (Always reachable and visible on the border line) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-6 z-50 -end-3.5 w-7 h-7 rounded-full bg-surface border border-sidebar-border shadow-md hover:shadow-mint-glow text-pine flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer`}
        title={isCollapsed ? t('توسيع القائمة (Expand)', 'Expand Sidebar') : t('طي القائمة (Collapse)', 'Collapse Sidebar')}
      >
        {getChevronIcon()}
      </button>

      {/* Brand Header */}
      <div className={`px-4 py-4 border-b border-sidebar-border flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              onClick={() => setIsCollapsed(true)}
              className="w-10 h-10 rounded-2xl bg-mint-500 flex items-center justify-center text-canvas shadow-card shadow-mint-500/20 shrink-0 cursor-pointer hover:scale-105 transition-transform"
              title={t('طي القائمة', 'Collapse Sidebar')}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-start truncate">
              <span className="font-black text-pine text-base leading-tight tracking-tight truncate">
                DYNAMIC ATS
              </span>
              <span className="text-[10px] text-neutral-muted font-medium truncate">
                {t('منظومة استقطاب المواهب الذكية', 'Smart Recruitment Platform')}
              </span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 rounded-2xl bg-mint-500 flex items-center justify-center text-canvas shadow-card shadow-mint-500/20 cursor-pointer hover:scale-110 active:scale-95 transition-all"
            title={t('انقر لتوسيع القائمة', 'Click to expand sidebar')}
          >
            <Sparkles className="w-5 h-5" />
          </div>
        )}

        {/* Top Header Toggle Button (When expanded) */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-neutral-muted hover:text-pine hover:bg-sand-200/60 dark:hover:bg-sand-200/20 transition-colors"
            title={t('طي القائمة', 'Collapse Sidebar')}
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navigationItems.map((item) => {
          const isActive = activeModule === item.id;
          const isAllowed = hasPermission(item.permission);

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveModule(item.id)}
                title={isCollapsed ? `${t(item.title, item.titleEn)}${item.badge !== null ? ` (${item.badge})` : ''}` : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                } rounded-xl font-medium text-xs md:text-sm transition-all duration-200 relative ${
                  isActive
                    ? 'bg-mint-500 text-canvas font-bold shadow-md shadow-mint-500/25 ring-1 ring-mint-400/50'
                    : isAllowed
                    ? 'text-neutral-main hover:bg-sidebar-hover hover:text-pine'
                    : 'text-neutral-subtle opacity-60 hover:bg-sand-100/40'
                }`}
              >
                <div
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-canvas scale-110' : 'text-pine group-hover:scale-110'
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full text-start truncate">
                    <span className="truncate">{t(item.title, item.titleEn)}</span>
                    {item.badge !== null && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-canvas border-white/40'
                            : item.badgeColor || 'bg-sand-200 text-pine border-sand-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Floating Tooltip When Collapsed */}
              {isCollapsed && (
                <div
                  className={`absolute ${
                    direction === 'rtl' ? 'end-full me-3' : 'start-full ms-3'
                  } top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 bg-surface text-pine rounded-xl shadow-dropdown border border-surface-border text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 flex items-center gap-2`}
                >
                  <span>{t(item.title, item.titleEn)}</span>
                  {item.badge !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Footer Details & Quick Theme Toggle */}
      <div className="p-3 border-t border-sidebar-border bg-sand-50/40">
        {!isCollapsed ? (
          <div className="space-y-2.5">
            {/* Theme Toggle Bar */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-sand-100/70 hover:bg-sand-200/80 border border-sand-200/80 text-xs font-semibold text-pine transition-all"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-mint-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>{theme === 'dark' ? t('الوضع الليلي (مفعّل)', 'Dark Mode (On)') : t('الوضع النهاري (مفعّل)', 'Light Mode (On)')}</span>
              </span>
              <span className="text-[10px] bg-surface px-2 py-0.5 rounded-md border border-surface-border text-neutral-muted">
                {t('تبديل', 'Toggle')}
              </span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-neutral-muted px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('النظام متصل ونشط', 'System Live & Synced')}
              </span>
              <span className="font-mono font-semibold text-pine">v2.4</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-sand-100 hover:bg-sand-200 flex items-center justify-center text-pine transition-colors shadow-xs"
              title={theme === 'dark' ? t('تفعيل الوضع النهاري', 'Switch to Light Mode') : t('تفعيل الوضع الليلي', 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-mint-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title={t('النظام متصل', 'Connected')} />
          </div>
        )}
      </div>
    </aside>

    {/* Mobile Slide-in Drawer Navigation (< md screens) */}
    {isMobileOpen && (
      <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
        {/* Backdrop Overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen?.(false)}
        />

        {/* Drawer Panel */}
        <aside 
          className="fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] bg-sidebar border-e border-sidebar-border shadow-2xl flex flex-col animate-slide-in"
          dir={direction}
        >
          {/* Drawer Header */}
          <div className="px-4 py-4 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-mint-500 flex items-center justify-center text-canvas shadow-card shadow-mint-500/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-start truncate">
                <span className="font-black text-pine text-base leading-tight tracking-tight truncate">
                  DYNAMIC ATS
                </span>
                <span className="text-[10px] text-neutral-muted font-medium truncate">
                  {t('منظومة استقطاب المواهب الذكية', 'Smart Recruitment Platform')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileOpen?.(false)}
              className="p-1.5 rounded-xl text-neutral-muted hover:text-pine hover:bg-sand-200/60 transition-colors"
              title={t('إغلاق القائمة', 'Close Menu')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = activeModule === item.id;
              const isAllowed = hasPermission(item.permission);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setIsMobileOpen?.(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-start ${
                    isActive
                      ? 'bg-mint-500 text-canvas font-bold shadow-md shadow-mint-500/25 ring-1 ring-mint-400/50'
                      : isAllowed
                      ? 'text-neutral-main hover:bg-sidebar-hover hover:text-pine'
                      : 'text-neutral-subtle opacity-60 hover:bg-sand-100/40'
                  }`}
                >
                  <div className={`shrink-0 ${isActive ? 'text-canvas' : 'text-pine'}`}>
                    {item.icon}
                  </div>

                  <div className="flex items-center justify-between w-full text-start truncate">
                    <span className="truncate">{t(item.title, item.titleEn)}</span>
                    {item.badge !== null && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold border shrink-0 ms-2 ${
                          isActive
                            ? 'bg-white/25 text-canvas border-white/40'
                            : item.badgeColor || 'bg-sand-200 text-pine border-sand-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer Details */}
          <div className="p-3 border-t border-sidebar-border bg-sand-50/40 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sand-100/70 hover:bg-sand-200/80 border border-sand-200/80 text-xs font-semibold text-pine transition-all"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-mint-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{theme === 'dark' ? t('الوضع الليلي (مفعّل)', 'Dark Mode (On)') : t('الوضع النهاري (مفعّل)', 'Light Mode (On)')}</span>
              </span>
              <span className="text-[10px] bg-surface px-2 py-0.5 rounded-md border border-surface-border text-neutral-muted">
                {t('تبديل', 'Toggle')}
              </span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-neutral-muted px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('النظام متصل ونشط', 'System Live & Synced')}
              </span>
              <span className="font-mono font-semibold text-pine">v2.4 Web App</span>
            </div>
          </div>
        </aside>
      </div>
    )}
  </>
);
};
