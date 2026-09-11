import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  Search, 
  Shield, 
  ChevronDown, 
  Check, 
  UserCheck, 
  Sliders,
  Sparkles,
  Info,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { UserRole } from '../../types/auth';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

interface HeaderProps {
  activeModule: string;
  onOpenRBACMatrix: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onOpenRBACMatrix, onToggleMobileMenu }) => {
  const { currentUser, currentRole, switchRole, roleDefinitions } = useAuth();
  const { language, toggleLanguage, theme, toggleTheme, t } = useThemeLanguage();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const rolesList: UserRole[] = ['hr_manager', 'recruiter', 'hiring_manager', 'reviewer', 'super_admin'];

  const notifications = [
    {
      id: 1,
      title: 'تم تقديم بطاقة تقييم جديدة',
      titleEn: 'New Scorecard Submitted',
      desc: 'د. ليلى الشريف قيّمت المرشح عمر عادل (4.8/5)',
      time: 'منذ 15 دقيقة',
      isNew: true,
    },
    {
      id: 2,
      title: 'طلب اعتماد احتياج وظيفي',
      titleEn: 'Requisition Approval Requested',
      desc: 'طلب REQ-2026-083 بانتظار اعتماد الميزانية المالية',
      time: 'منذ ساعتين',
      isNew: true,
    },
    {
      id: 3,
      title: 'توقيع العرض الوظيفي رقمياً',
      titleEn: 'Job Offer Signed Digitally',
      desc: 'أروى سليمان قامت بتوقيع العرض الوظيفي',
      time: 'منذ 4 ساعات',
      isNew: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-sidebar border-b border-sidebar-border px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Menu Hamburger & Global Search */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl bg-surface border border-sand-300 hover:bg-sand-100 text-pine md:hidden shrink-0 shadow-xs"
              title={t('فتح القائمة الرئيسية', 'Open Navigation Menu')}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="relative w-full min-w-0">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-neutral-muted" />
            <input
              type="text"
              placeholder={t(
                'بحث شامل...',
                'Global search candidates, jobs...'
              )}
              className="w-full bg-surface/80 border border-sand-300 rounded-xl ps-9 pe-3 py-1.5 sm:ps-10 sm:pe-4 sm:py-2 text-xs md:text-sm text-neutral-main placeholder:text-neutral-subtle focus:bg-surface focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20 transition-all truncate"
            />
          </div>
        </div>

        {/* Right Side: Role Switcher, Language Toggle, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Interactive Role Switcher Banner */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface border border-sand-300 hover:border-mint-500 shadow-sm transition-all text-xs"
              title={t('بدّل دور المستخدم لتجربة الصلاحيات وحجب الرواتب فوراً', 'Switch role to test live RBAC & salary masking')}
            >
              <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse shrink-0" />
              <div className="hidden sm:flex flex-col text-start">
                <span className="text-[10px] text-neutral-muted leading-tight font-medium">
                  {t('الدور الفعّال (RBAC)', 'Active Role')}
                </span>
                <span className="font-bold text-pine text-xs flex items-center gap-1 truncate max-w-[120px]">
                  {t(roleDefinitions[currentRole]?.name || '', roleDefinitions[currentRole]?.nameEn || '')}
                </span>
              </div>
              <div className="sm:hidden flex items-center">
                <span className="font-bold text-pine text-[11px] truncate max-w-[70px]">
                  {t(roleDefinitions[currentRole]?.name || '', roleDefinitions[currentRole]?.nameEn || '')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-muted ms-0.5 sm:ms-1 shrink-0" />
            </button>

            {/* Role Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute end-0 mt-2 w-72 bg-surface rounded-2xl border border-surface-border shadow-dropdown p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-surface-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pine flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-mint-500" />
                      {t('مصفوفة محاكاة الصلاحيات', 'Role Simulation Matrix')}
                    </span>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        onOpenRBACMatrix();
                      }}
                      className="text-[11px] text-mint-600 hover:underline font-semibold"
                    >
                      {t('إدارة الصلاحيات', 'View Matrix')}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-muted mt-1">
                    {t(
                      'اختر أي دور لتجربة النظام بصلاحياته فوراً (مثل إخفاء الرواتب للـ Reviewer)',
                      'Select any role to test system views & salary shields live'
                    )}
                  </p>
                </div>

                <div className="py-1 space-y-1">
                  {rolesList.map((roleKey) => {
                    const rDef = roleDefinitions[roleKey];
                    const isSelected = currentRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          switchRole(roleKey);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-start transition-colors ${
                          isSelected
                            ? 'bg-mint-50 border border-mint-200 text-pine'
                            : 'hover:bg-sand-100 text-neutral-main'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{t(rDef.name, rDef.nameEn)}</span>
                          <span className="text-[10px] text-neutral-muted line-clamp-1">{t(rDef.description, rDef.descriptionEn)}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-mint-600 shrink-0 ms-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-sand-300 hover:bg-sand-100 text-xs font-bold text-pine transition-all shadow-sm"
            title={theme === 'dark' ? t('التحويل إلى الوضع النهاري', 'Switch to Light Mode') : t('التحويل إلى الوضع الليلي', 'Switch to Dark Mode')}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-mint-400" />
                <span className="hidden sm:inline">{t('ليلي', 'Dark')}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{t('نهاري', 'Light')}</span>
              </>
            )}
          </button>

          {/* Language Toggle (AR / EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-sand-300 hover:bg-sand-100 text-xs font-bold text-pine transition-all shadow-sm"
            title={t('التبديل إلى الإنجليزية', 'Switch to Arabic')}
          >
            <Globe className="w-3.5 h-3.5 text-mint-500" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl bg-surface border border-sand-300 hover:bg-sand-100 text-neutral-muted hover:text-pine transition-all shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-terracotta ring-2 ring-white" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute end-0 mt-2 w-80 bg-surface rounded-2xl border border-surface-border shadow-dropdown p-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                  <span className="text-xs font-bold text-pine">{t('مركز التنبيهات الذكي', 'Notifications Center')}</span>
                  <Badge variant="mint" size="sm">3 {t('جديدة', 'New')}</Badge>
                </div>
                <div className="divide-y divide-surface-border max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-sand-50 transition-colors rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pine">{t(n.title, n.titleEn)}</span>
                        <span className="text-[10px] text-neutral-muted">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-neutral-muted mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 ps-2 border-s border-sand-300">
            <Avatar
              name={currentUser.name}
              src={currentUser.avatar}
              size="sm"
              statusIndicator="online"
            />
            <div className="hidden lg:flex flex-col text-start">
              <span className="text-xs font-bold text-pine leading-tight">{t(currentUser.name, currentUser.nameEn)}</span>
              <span className="text-[10px] text-neutral-muted leading-tight">{t(currentUser.title, currentUser.titleEn)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
