import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  PieChart, 
  Download, 
  Filter,
  Briefcase,
  Layers,
  Sparkles,
  ArrowUpRight,
  Shield
} from 'lucide-react';
import { useATSData } from '../../context/ATSDataContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { 
  MOCK_KPIS, 
  MOCK_FUNNEL_METRICS, 
  MOCK_SOURCE_METRICS, 
  MOCK_RECRUITER_METRICS 
} from '../../data/mockAnalytics';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';

export const AnalyticsDashboardView: React.FC = () => {
  const { kpis, candidates, requisitions } = useATSData();
  const { t } = useThemeLanguage();

  const [dateRange, setDateRange] = useState('this_quarter');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Header Banner */}
      <div className="surface-card border-surface-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pine text-canvas flex items-center justify-center shadow-card">
              <LayoutDashboard className="w-6 h-6 text-mint-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-pine">
                  {t('لوحة المؤشرات والتحليلات التنفيذية (Recruitment Analytics)', 'Recruitment Analytics Dashboard')}
                </h1>
                <Badge variant="mint" size="sm">Real-time KPI Aggregation</Badge>
              </div>
              <p className="text-xs text-neutral-muted mt-1">
                {t(
                  'قياس زمن التعيين (Time-to-Hire)، تكلفة التعيين (Cost-per-Hire)، قمع التوظيف، وكفاءة قنوات الاستقطاب.',
                  'Real-time metrics: Time-to-Hire, Cost-per-Hire, Funnel conversions, and channel ROI.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-sand-300 rounded-xl px-3 py-1.5 text-xs text-pine font-bold focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="this_quarter">{t('الربع الحالي (Q3 2026)', 'This Quarter (Q3 2026)')}</option>
              <option value="last_quarter">{t('الربع السابق (Q2 2026)', 'Last Quarter (Q2 2026)')}</option>
              <option value="ytd">{t('منذ بداية العام (YTD)', 'Year-to-Date (YTD)')}</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert(t('تم تصدير التقرير التنفيذي بصيغة PDF / Excel بنجاح!', 'Executive analytics report exported!'))}
            >
              {t('تصدير التقارير', 'Export KPI Report')}
            </Button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Time-to-Hire */}
        <div className="surface-card border-surface-border hover:border-mint-400 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-neutral-muted font-bold">{t('زمن التعيين (Time-to-Hire)', 'Time-to-Hire')}</span>
            <div className="w-8 h-8 rounded-xl bg-mint-100 text-pine flex items-center justify-center">
              <Clock className="w-4 h-4 text-mint-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pine">{kpis.timeToHireDays}</span>
            <span className="text-xs text-neutral-muted font-medium">{t('يوماً (أسرع بـ 40% من السوق)', 'days')}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('تحسن بمقدار 5 أيام عن الربع السابق', '-5 days vs last quarter')}</span>
          </div>
        </div>

        {/* Card 2: Cost-per-Hire */}
        <div className="surface-card border-surface-border hover:border-mint-400 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-neutral-muted font-bold">{t('تكلفة التعيين (Cost-per-Hire)', 'Cost-per-Hire')}</span>
            <div className="w-8 h-8 rounded-xl bg-sand-200 text-pine flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-pine" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pine">{kpis.costPerHire.toLocaleString()}</span>
            <span className="text-xs text-neutral-muted font-medium">ج.م</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('توفير 18% بفضل الإحالات الداخلية', '18% savings via referrals')}</span>
          </div>
        </div>

        {/* Card 3: Offer Acceptance Rate */}
        <div className="surface-card border-surface-border hover:border-mint-400 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-neutral-muted font-bold">{t('معدل قبول العروض (Acceptance Rate)', 'Offer Acceptance')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pine">{kpis.offerAcceptanceRate}%</span>
            <span className="text-xs text-neutral-muted font-medium">{t('نسبة قياسية', 'Rate')}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('14 من أصل 16 عرضاً تم توقيعه', '14 of 16 offers signed')}</span>
          </div>
        </div>

        {/* Card 4: Total Hires & Pipeline */}
        <div className="surface-card border-surface-border hover:border-mint-400 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-neutral-muted font-bold">{t('إجمالي التعيينات المكتملة', 'Total Hires')}</span>
            <div className="w-8 h-8 rounded-xl bg-pine text-canvas flex items-center justify-center">
              <Users className="w-4 h-4 text-mint-300" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pine">{kpis.totalHiresThisQuarter}</span>
            <span className="text-xs text-neutral-muted font-medium">{t('موظفاً جديداً', 'Hires')}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-pine font-semibold">
            <span>{kpis.activeCandidatesInPipeline} {t('مرشح نشط في خط السير حالياً', 'active candidates in pipeline')}</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC RECRUITMENT FUNNEL */}
      <div className="surface-card border border-surface-border space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-mint-600" />
            <h3 className="font-bold text-pine text-xs sm:text-sm">
              {t('قمع التوظيف الديناميكي ومعدلات التحويل (Recruitment Funnel & Stage Drop-off)', 'Recruitment Funnel')}
            </h3>
          </div>
          <span className="text-xs text-neutral-muted">
            {t('توزيع المرشحين ومتوسط فترة المكوث في كل مرحلة', 'Conversion and dwell time')}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {MOCK_FUNNEL_METRICS.map((st, idx) => {
            const widthPercent = Math.max(14, (st.count / MOCK_FUNNEL_METRICS[0].count) * 100);

            return (
              <div key={st.stageId} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pine flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mint-500" />
                    {t(st.stageName, st.stageNameEn)}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-muted">
                      {t('متوسط المكوث:', 'Avg dwell:')} <strong>{st.averageDaysInStage} {t('أيام', 'days')}</strong>
                    </span>
                    <span className="font-black text-pine min-w-[70px] text-end">
                      {st.count} {t('مرشح', 'cand')} ({st.conversionRate}%)
                    </span>
                  </div>
                </div>

                <div className="w-full h-4 bg-sand-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-mint-500 to-mint-400 rounded-full transition-all duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOURCE EFFECTIVENESS & RECRUITER PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Channels */}
        <div className="surface-card border border-surface-border space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-mint-600" />
              {t('كفاءة قنوات الاستقطاب والميزانيات (Source Effectiveness)', 'Source ROI')}
            </h3>
          </div>

          <div className="space-y-2.5">
            {MOCK_SOURCE_METRICS.map((src, idx) => (
              <div key={idx} className="p-3 bg-sand-50 rounded-xl border border-sand-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-pine block">{t(src.source, src.sourceEn)}</span>
                  <span className="text-[11px] text-neutral-muted">
                    {src.candidatesCount} {t('متقدم', 'candidates')} • {src.hiredCount} {t('تعيينات', 'hires')}
                  </span>
                </div>
                <div className="text-end">
                  <span className="font-bold text-pine block">{src.costPerHire > 0 ? `${src.costPerHire.toLocaleString()} ج.م / تعيين` : t('بدون تكلفة إعلانية', 'Free / 0 EGP')}</span>
                  <Badge variant="mint" size="sm">{t('جودة:', 'Quality:')} {src.qualityScore}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Workload */}
        <div className="surface-card border border-surface-border space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <h3 className="font-bold text-pine text-xs sm:text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-mint-600" />
              {t('إنتاجية وأعباء مسؤولي التوظيف (Recruiter Workload)', 'Recruiter Performance')}
            </h3>
          </div>

          <div className="space-y-2.5">
            {MOCK_RECRUITER_METRICS.map((rec) => (
              <div key={rec.recruiterId} className="p-3 bg-sand-50 rounded-xl border border-sand-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={rec.name}
                    src={rec.avatar}
                    size="md"
                  />
                  <div>
                    <span className="font-bold text-pine block">{rec.name}</span>
                    <span className="text-[11px] text-neutral-muted">
                      {rec.activeRequisitions} {t('شواغر نشطة تحت الإشراف', 'active reqs')}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-black text-mint-700 text-sm block">{rec.hiredCount} {t('تعيينات', 'hires')}</span>
                  <span className="text-[10px] text-neutral-muted">{t('متوسط الإغلاق:', 'Avg speed:')} {rec.averageTimeToHireDays} {t('يوم', 'days')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
