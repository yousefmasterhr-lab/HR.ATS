import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  PieChart, 
  Sparkles,
  Calendar,
  Briefcase,
  Target,
  Award,
  FileSpreadsheet,
  Check,
  TrendingDown
} from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { ANALYTICS_BY_PERIOD } from '../../data/mockAnalytics';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { exportAnalyticsToExcel } from '../../utils/excelExporter';
import { fireConfetti } from '../../utils/confetti';

export const AnalyticsDashboardView: React.FC = () => {
  const { t, language } = useThemeLanguage();

  const [dateRange, setDateRange] = useState<'this_quarter' | 'last_quarter' | 'ytd'>('this_quarter');
  const [selectedChartTab, setSelectedChartTab] = useState<'all' | 'funnel' | 'sources' | 'departments' | 'quality'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activeMonthHover, setActiveMonthHover] = useState<number | null>(null);

  // Active Period Data (Reactive)
  const currentData = useMemo(() => {
    return ANALYTICS_BY_PERIOD[dateRange] || ANALYTICS_BY_PERIOD.this_quarter;
  }, [dateRange]);

  const { kpis, funnel, sources, recruiters, departments, monthlyTrends, qualityBrackets, experienceDiversity } = currentData;

  const dateRangeLabels = {
    this_quarter: { ar: 'الربع الحالي (Q3 2026)', en: 'This Quarter (Q3 2026)' },
    last_quarter: { ar: 'الربع السابق (Q2 2026)', en: 'Last Quarter (Q2 2026)' },
    ytd: { ar: 'منذ بداية العام (YTD 2026)', en: 'Year-to-Date (YTD 2026)' },
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await exportAnalyticsToExcel(currentData, {
        periodKey: dateRange,
        periodLabel: dateRangeLabels[dateRange].ar,
        periodLabelEn: dateRangeLabels[dateRange].en,
        language: language,
      });
      setIsExporting(false);
      setExportSuccess(true);
      fireConfetti();
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Excel Export error:', err);
      setIsExporting(false);
    }
  };

  // Max calculations for charts
  const maxMonthlyHires = Math.max(...monthlyTrends.map((m) => m.hiresCount), 1);
  const maxSourceCandidates = Math.max(...sources.map((s) => s.candidatesCount), 1);

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* 1. EXECUTIVE HEADER BANNER (Clean & Proportional) */}
      <div className="surface-card border-surface-border p-5 rounded-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-mint-500 text-white flex items-center justify-center shadow-card shadow-mint-500/25 shrink-0 transform hover:scale-105 transition-transform duration-200">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-pine tracking-tight">
                  {t('لوحة المؤشرات والتحليلات التنفيذية', 'Executive Recruitment Analytics')}
                </h1>
                <Badge variant="mint" size="sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block me-1" />
                  {t('تحديث حي ومباشر', 'Real-time Live')}
                </Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1 leading-normal">
                {t(
                  'متابعة زمن وتكلفة التعيين، قمع التوظيف، ومؤشرات أداء قنوات الاستقطاب بالجنيه المصري',
                  'Monitor time-to-hire, cost-per-hire, funnel conversion, and sourcing ROI in EGP'
                )}
              </p>
            </div>
          </div>

          {/* Time Filter & Excel Export Toolbar */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            {/* Reactive Date Range Select */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full bg-surface border border-surface-border rounded-xl ps-8 pe-4 py-2 text-xs text-pine font-bold focus:outline-none focus:ring-2 focus:ring-mint-500/20 shadow-xs cursor-pointer hover:border-mint-400 transition-colors"
              >
                <option value="this_quarter">{t('الربع الحالي (Q3 2026)', 'This Quarter (Q3 2026)')}</option>
                <option value="last_quarter">{t('الربع السابق (Q2 2026)', 'Last Quarter (Q2 2026)')}</option>
                <option value="ytd">{t('منذ بداية العام (YTD 2026)', 'Year-to-Date (YTD 2026)')}</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-mint-600 absolute top-1/2 -translate-y-1/2 start-2.5 pointer-events-none" />
            </div>

            {/* Excel Export Button */}
            <Button
              variant="secondary"
              size="sm"
              icon={exportSuccess ? <Check className="w-4 h-4 text-emerald-500 animate-bounce" /> : <FileSpreadsheet className="w-4 h-4 text-mint-600" />}
              onClick={handleExportExcel}
              disabled={isExporting}
              className="font-bold border-mint-200 hover:border-mint-500 hover:bg-mint-50/50 shadow-xs shrink-0 py-2 px-3.5"
            >
              {exportSuccess
                ? t('تم التصدير بنجاح!', 'Exported Successfully!')
                : isExporting
                ? t('جارِ التصدير...', 'Exporting...')
                : t('تصدير تقرير Excel', 'Export Excel')}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI METRIC CARDS (High-Contrast, Balanced Heights) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Time-to-Hire */}
        <div className="surface-card border-surface-border p-4.5 rounded-2xl hover:border-mint-400 hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-neutral-muted font-bold">{t('زمن التعيين (Time-to-Hire)', 'Time-to-Hire')}</span>
              <div className="w-9 h-9 rounded-xl bg-mint-500/15 text-mint-500 border border-mint-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Clock className="w-4 h-4 text-mint-600 dark:text-mint-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-pine tracking-tight">{kpis.timeToHireDays}</span>
              <span className="text-xs text-neutral-muted font-bold">{t('يوماً', 'days')}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {kpis.timeToHireChange < 0
                ? t(`تحسن ${Math.abs(kpis.timeToHireChange)} أيام عن السابق`, `${Math.abs(kpis.timeToHireChange)}d faster vs prev`)
                : t(`+${kpis.timeToHireChange} أيام عن السابق`, `+${kpis.timeToHireChange}d vs prev`)}
            </span>
          </div>
        </div>

        {/* Card 2: Cost-per-Hire */}
        <div className="surface-card border-surface-border p-4.5 rounded-2xl hover:border-mint-400 hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-neutral-muted font-bold">{t('تكلفة التعيين (Cost-per-Hire)', 'Cost-per-Hire')}</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-pine tracking-tight">{kpis.costPerHire.toLocaleString()}</span>
              <span className="text-xs text-neutral-muted font-bold">{t('ج.م', 'EGP')}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t(`توفير ${kpis.costPerHireSavings}% عبر الإحالات`, `${kpis.costPerHireSavings}% organic savings`)}</span>
          </div>
        </div>

        {/* Card 3: Offer Acceptance Rate */}
        <div className="surface-card border-surface-border p-4.5 rounded-2xl hover:border-mint-400 hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-neutral-muted font-bold">{t('معدل قبول العروض (Offers)', 'Offer Acceptance')}</span>
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-500 border border-sky-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-pine tracking-tight">{kpis.offerAcceptanceRate}%</span>
              <span className="text-xs text-neutral-muted font-bold">{t('نسبة قياسية', 'Rate')}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 w-fit">
            <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{t(`${kpis.offersSignedCount} من أصل ${kpis.offersSentTotal} عرضاً موقعاً`, `${kpis.offersSignedCount} of ${kpis.offersSentTotal} signed`)}</span>
          </div>
        </div>

        {/* Card 4: Total Hires & Pipeline */}
        <div className="surface-card border-surface-border p-4.5 rounded-2xl hover:border-mint-400 hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-neutral-muted font-bold">{t('إجمالي التعيينات المكتملة', 'Total Hires')}</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-pine tracking-tight">{kpis.totalHiresThisQuarter}</span>
              <span className="text-xs text-neutral-muted font-bold">{t('موظفاً جديداً', 'Hires')}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-pine bg-sand-200/60 px-2.5 py-1 rounded-lg border border-sand-300 w-fit">
            <span>{kpis.activeCandidatesInPipeline} {t('مرشح نشط قيد الإجراء', 'active in pipeline')}</span>
          </div>
        </div>
      </div>

      {/* 3. CLEAN FILTER TABS (Concise, single-line) */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-muted rounded-2xl border border-surface-border overflow-x-auto">
        {[
          { id: 'all', label: t('نظرة شاملة متكاملة', 'Overview') },
          { id: 'funnel', label: t('قمع التوظيف والسرعة', 'Funnel & Velocity') },
          { id: 'departments', label: t('استيفاء شواغر الأقسام', 'Department Goals') },
          { id: 'sources', label: t('قنوات الاستقطاب والميزانيات', 'Sourcing & Spend') },
          { id: 'quality', label: t('جودة الكوادر ومستويات الخبرة', 'Quality & Demographics') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedChartTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedChartTab === tab.id
                ? 'bg-mint-500 text-white shadow-xs'
                : 'text-neutral-muted hover:text-pine hover:bg-sand-200/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. SECTION 1: RECRUITMENT FUNNEL & MONTHLY VELOCITY (Balanced Heights Grid) */}
      {(selectedChartTab === 'all' || selectedChartTab === 'funnel') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Funnel Visualizer (7 Cols) */}
          <div className="lg:col-span-7 surface-card border-surface-border p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-mint-600" />
                  <h3 className="font-bold text-pine text-xs sm:text-sm">
                    {t('قمع التوظيف ومعدلات التحويل', 'Recruitment Funnel & Conversions')}
                  </h3>
                </div>
                <span className="text-[11px] text-neutral-muted">
                  {t('توزيع المرشحين وفترة المكوث', 'Drop-off & dwell time')}
                </span>
              </div>

              <div className="space-y-3 pt-3">
                {funnel.map((st) => {
                  const widthPercent = Math.max(12, (st.count / funnel[0].count) * 100);

                  return (
                    <div key={st.stageId} className="space-y-1.5 text-xs group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pine flex items-center gap-2 group-hover:text-mint-600 transition-colors">
                          <span className="w-2.5 h-2.5 rounded-full bg-mint-500 shadow-xs shrink-0" />
                          {t(st.stageName, st.stageNameEn)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-muted text-[11px]">
                            {t('المكوث:', 'Dwell:')} <strong className="text-pine font-bold">{st.averageDaysInStage} {t('أيام', 'd')}</strong>
                          </span>
                          <span className="font-black text-pine min-w-[80px] text-end">
                            {st.count} <span className="text-mint-700 font-bold">({st.conversionRate}%)</span>
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-surface-muted rounded-full overflow-hidden p-0.5 border border-surface-border">
                        <div
                          className="h-full bg-gradient-to-r from-mint-500 via-mint-400 to-emerald-400 rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-neutral-muted">
              <span>{t('إجمالي طلبات التقديم الأولية:', 'Initial Applications:')} <strong className="text-pine">{funnel[0].count}</strong></span>
              <span>{t('معدل الوصول للتعيين النهائي:', 'Final Placement Rate:')} <strong className="text-mint-700 font-bold">{((funnel[funnel.length - 1].count / funnel[0].count) * 100).toFixed(1)}%</strong></span>
            </div>
          </div>

          {/* Monthly Velocity & Histogram (5 Cols - Compact, Balanced Height) */}
          <div className="lg:col-span-5 surface-card border-surface-border p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-mint-600" />
                  <h3 className="font-bold text-pine text-xs sm:text-sm">
                    {t('التطور وسرعة التعيين الشهرية', 'Monthly Hiring Velocity')}
                  </h3>
                </div>
                <Badge variant="mint" size="sm">
                  {monthlyTrends.reduce((acc, m) => acc + m.hiresCount, 0)} {t('تعيينات', 'Hires')}
                </Badge>
              </div>

              {/* Histogram Column Chart */}
              <div className="pt-4">
                <div className="h-44 flex items-end justify-between gap-2 px-2 pb-2 border-b border-surface-border">
                  {monthlyTrends.map((m, idx) => {
                    const heightPercent = Math.max(18, Math.round((m.hiresCount / maxMonthlyHires) * 100));
                    const isHovered = activeMonthHover === idx;

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer relative"
                        onMouseEnter={() => setActiveMonthHover(idx)}
                        onMouseLeave={() => setActiveMonthHover(null)}
                      >
                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-12 z-20 bg-pine text-canvas text-[10px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in border border-mint-500/30 pointer-events-none text-center">
                            <div className="font-bold">{m.hiresCount} {t('تعيينات', 'hires')}</div>
                            <div className="text-mint-300">{m.avgTimeToHireDays} {t('يوماً', 'days')} • {m.costPerHire.toLocaleString()} {t('ج.م', 'EGP')}</div>
                          </div>
                        )}

                        <span className="text-[11px] font-black text-pine group-hover:text-mint-600 transition-colors">
                          {m.hiresCount}
                        </span>

                        <div className="w-full max-w-[32px] bg-surface-muted rounded-t-lg overflow-hidden h-32 flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-mint-600 via-mint-500 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>

                        <span className="text-[10px] text-neutral-muted font-bold truncate max-w-full text-center">
                          {isHovered ? t(m.month, m.monthEn) : t(m.month.split(' ')[0], m.monthEn.split(' ')[0])}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Velocity Summary Pill */}
            <div className="p-3 bg-mint-50/50 rounded-xl border border-mint-200 text-xs text-neutral-muted space-y-1">
              <span className="font-bold text-pine flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-mint-600 shrink-0" />
                {t('مؤشر سرعة إغلاق الشواغر', 'Velocity Index')}
              </span>
              <p className="text-[11px] leading-relaxed">
                {t('تسارع بنسبة 28% في سرعة التعيين مع انخفاض تكلفة الاستقطاب للشاغر الواحد.', '28% faster time-to-close with declining cost-per-hire trend.')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION 2: DEPARTMENT FULFILLMENT & SOURCING CHANNELS */}
      {(selectedChartTab === 'all' || selectedChartTab === 'departments' || selectedChartTab === 'sources') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Department Hiring Fulfillment */}
          <div className="surface-card border-surface-border p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-mint-600" />
                {t('استيفاء خطط التوظيف حسب الإدارات', 'Department Hiring Fulfillment')}
              </h3>
              <span className="text-[11px] text-neutral-muted">{t('المكتمل / المستهدف', 'Filled vs Target')}</span>
            </div>

            <div className="space-y-3 pt-1">
              {departments.map((dept, idx) => (
                <div key={idx} className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 space-y-2 text-xs hover:border-mint-400 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                      <span className="font-bold text-pine">{t(dept.department, dept.departmentEn)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-pine">{dept.filledHires} / {dept.targetHires}</span>
                      <Badge variant="mint" size="sm">{dept.fulfillmentRate}%</Badge>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-sand-200 rounded-full overflow-hidden border border-sand-300">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${dept.fulfillmentRate}%`,
                        backgroundColor: dept.color
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-muted pt-0.5">
                    <span>{dept.openPositions} {t('شواغر متبقية نشطة', 'positions remaining')}</span>
                    <span>{t('متوسط الإغلاق:', 'Avg speed:')} {dept.avgTimeToHire} {t('يوماً', 'days')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Channel Effectiveness & Spend */}
          <div className="surface-card border-surface-border p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-mint-600" />
                {t('عائد وكفاءة قنوات الاستقطاب والميزانية', 'Sourcing Channels & ROI')}
              </h3>
              <span className="text-[11px] text-neutral-muted">{t('المتقدمين والتعيينات', 'Applicants & Hires')}</span>
            </div>

            <div className="space-y-3 pt-1">
              {sources.map((src, idx) => {
                const relativeWidth = Math.round((src.candidatesCount / maxSourceCandidates) * 100);

                return (
                  <div key={idx} className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 space-y-2 text-xs hover:border-mint-400 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pine">{t(src.source, src.sourceEn)}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-mint-700">{src.hiredCount} {t('تعيينات', 'hires')}</span>
                        <Badge variant="mint" size="sm">{t('جودة:', 'Quality:')} {src.qualityScore}%</Badge>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-sand-200 rounded-full overflow-hidden border border-sand-300">
                      <div
                        className="h-full bg-gradient-to-r from-mint-500 to-sky-500 rounded-full transition-all duration-700"
                        style={{ width: `${relativeWidth}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-muted">
                      <span>{src.candidatesCount} {t('متقدم مسجل', 'candidates')}</span>
                      <span className="font-bold text-pine">
                        {src.costPerHire > 0 ? `${src.costPerHire.toLocaleString()} ${t('ج.م / تعيين', 'EGP / hire')}` : t('بدون تكلفة إعلانية (0 ج.م)', '0 EGP (Free)')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. SECTION 3: CANDIDATE QUALITY TIERS & EXPERIENCE DEMOGRAPHICS */}
      {(selectedChartTab === 'all' || selectedChartTab === 'quality') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Quality Tiers */}
          <div className="surface-card border-surface-border p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-mint-600" />
                {t('توزيع جودة ومطابقة المرشحين', 'Candidate Match Tiers')}
              </h3>
              <Badge variant="mint" size="sm">AI Scores</Badge>
            </div>

            <div className="space-y-3 pt-1">
              {qualityBrackets.map((qb, idx) => (
                <div key={idx} className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-pine flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: qb.color }} />
                      {t(qb.bracket, qb.bracketEn)}
                    </span>
                    <span className="font-black text-pine">{qb.count} {t('مرشح', 'cand')} ({qb.percentage}%)</span>
                  </div>

                  <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${qb.percentage}%`, backgroundColor: qb.color }}
                    />
                  </div>

                  <p className="text-[10px] text-neutral-muted">{t(qb.description, qb.descriptionEn)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level Demographics */}
          <div className="surface-card border-surface-border p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-mint-600" />
                {t('توزيع مستويات الخبرة والكوادر', 'Experience Demographics')}
              </h3>
              <span className="text-[11px] text-neutral-muted">{t('النسب المئوية', 'Proportions')}</span>
            </div>

            <div className="space-y-3.5 pt-1">
              {experienceDiversity.map((exp, idx) => (
                <div key={idx} className="p-3 bg-sand-50/70 rounded-xl border border-sand-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-pine flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: exp.color }} />
                      {t(exp.level, exp.levelEn)}
                    </span>
                    <span className="font-black text-pine">{exp.count} {t('مرشح', 'cand')} ({exp.percentage}%)</span>
                  </div>

                  <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${exp.percentage}%`, backgroundColor: exp.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. SECTION 4: RECRUITER PERFORMANCE LEADERBOARD */}
      <div className="surface-card border-surface-border p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-mint-600" />
            {t('إنتاجية وأعباء مسؤولي التوظيف', 'Recruiter Workload & Performance')}
          </h3>
          <Badge variant="mint" size="sm">{recruiters.length} {t('مسؤولو توظيف', 'Recruiters')}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recruiters.map((rec) => (
            <div key={rec.recruiterId} className="p-4 bg-sand-50/70 rounded-2xl border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-mint-400 transition-all">
              <div className="flex items-center gap-3">
                <Avatar
                  name={rec.name}
                  src={rec.avatar}
                  size="lg"
                />
                <div>
                  <h4 className="font-bold text-pine text-sm">{rec.name}</h4>
                  <span className="text-xs text-neutral-muted block">
                    {rec.activeRequisitions} {t('شواغر نشطة تحت الإشراف', 'active reqs')}
                  </span>
                  <span className="text-[11px] text-neutral-muted block mt-0.5">
                    {rec.totalCandidatesProcessed} {t('مرشح تمت معالجتهم ومقابلتهم', 'processed')}
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-sand-300">
                <span className="font-black text-mint-700 text-base">{rec.hiredCount} {t('تعيينات منجزة', 'hires')}</span>
                <span className="text-xs text-neutral-muted font-medium mt-1">
                  {t('متوسط الإغلاق:', 'Avg speed:')} <strong className="text-pine">{rec.averageTimeToHireDays} {t('يوماً', 'days')}</strong>
                </span>
                <Badge variant="mint" size="sm" className="mt-1.5">
                  {rec.offerAcceptanceRate}% {t('قبول عروض', 'acceptance')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
