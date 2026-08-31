import ExcelJS from 'exceljs';
import { PeriodAnalyticsData } from '../types/analytics';

export interface ExcelExportOptions {
  periodKey: string;
  periodLabel: string;
  periodLabelEn: string;
  language: 'ar' | 'en';
}

export const exportAnalyticsToExcel = async (
  data: PeriodAnalyticsData,
  options: ExcelExportOptions
): Promise<void> => {
  const { kpis, funnel, sources, recruiters, departments, monthlyTrends, qualityBrackets, experienceDiversity } = data;
  const isAr = options.language === 'ar';

  const currentDate = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const periodTitle = isAr ? options.periodLabel : options.periodLabelEn;

  // Create Workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Dynamic ATS Platform';
  workbook.created = new Date();

  // Common Color Tokens (Mint Green & Deep Pine Palette)
  const PINE_DARK = 'FF1B4938';      // Main Brand Dark Pine #1B4938
  const MINT_PRIMARY = 'FF38A37F';   // Mint Primary #38A37F
  const MINT_HEADER_BG = 'FFD8F3E5'; // Soft Mint Header #D8F3E5
  const MINT_BADGE_BG = 'FFE6F9F0';  // Light Badge #E6F9F0
  const MINT_BADGE_TXT = 'FF0D7B55'; // Emerald text
  const ROW_ODD_BG = 'FFF7FAF8';     // Alternating Row #F7FAF8
  const ROW_EVEN_BG = 'FFFFFFFF';    // White
  const BORDER_COLOR = 'FFD5E2DC';   // Light Border #D5E2DC

  const cellBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: BORDER_COLOR } },
    bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
    left: { style: 'thin', color: { argb: BORDER_COLOR } },
    right: { style: 'thin', color: { argb: BORDER_COLOR } },
  };

  const applyHeaderStyles = (row: ExcelJS.Row, bgArgb = MINT_HEADER_BG, textArgb = PINE_DARK) => {
    row.height = 24;
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: textArgb } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = cellBorder;
    });
  };

  const applyDataRowStyles = (row: ExcelJS.Row, isOdd: boolean) => {
    row.height = 22;
    const bg = isOdd ? ROW_ODD_BG : ROW_EVEN_BG;
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1F2937' } };
      cell.alignment = { vertical: 'middle', horizontal: isAr ? 'right' : 'left' };
      cell.border = cellBorder;
    });
  };

  const addBanner = (ws: ExcelJS.Worksheet, maxCol: string) => {
    // Row 1: Brand Title Banner
    ws.mergeCells(`A1:${maxCol}1`);
    const r1 = ws.getCell('A1');
    r1.value = isAr ? 'منظومة استقطاب المواهب الذكية | Dynamic ATS Platform' : 'Dynamic ATS Recruitment Platform';
    r1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PINE_DARK } };
    r1.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    r1.alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getRow(1).height = 32;

    // Row 2: Subtitle Banner
    ws.mergeCells(`A2:${maxCol}2`);
    const r2 = ws.getCell('A2');
    r2.value = isAr ? `التقرير التحليلي التنفيذي الشامل - ${periodTitle}` : `Executive Analytics Report - ${periodTitle}`;
    r2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_PRIMARY } };
    r2.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    r2.alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getRow(2).height = 24;

    // Row 3: Meta Info
    ws.mergeCells(`A3:${maxCol}3`);
    const r3 = ws.getCell('A3');
    r3.value = isAr ? `تاريخ وساعة الاستخراج: ${currentDate} | العملة: الجنيه المصري (ج.م)` : `Export Date: ${currentDate} | Currency: EGP`;
    r3.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF6B7280' } };
    r3.alignment = { vertical: 'middle', horizontal: isAr ? 'right' : 'left' };
    ws.getRow(3).height = 20;

    // Row 4: Empty separator
    ws.getRow(4).height = 10;
  };

  const addSectionTitle = (ws: ExcelJS.Worksheet, rowNum: number, maxCol: string, title: string) => {
    ws.mergeCells(`A${rowNum}:${maxCol}${rowNum}`);
    const cell = ws.getCell(`A${rowNum}`);
    cell.value = title;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF236951' } };
    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: isAr ? 'right' : 'left' };
    ws.getRow(rowNum).height = 26;
  };

  // =========================================================================
  // 1. SHEET 1: EXECUTIVE KPIS & DEPARTMENTS & RECRUITERS
  // =========================================================================
  const ws1 = workbook.addWorksheet(isAr ? 'المؤشرات_التنفيذية' : 'Executive_KPIs', {
    views: [{ rightToLeft: isAr }],
  });

  addBanner(ws1, 'E');

  // Section 1: KPIs
  addSectionTitle(ws1, 5, 'E', isAr ? '1. مؤشرات الأداء التنفيذية الرئيسية (Recruitment KPIs)' : '1. Executive Recruitment KPIs');

  const kpiHeader = ws1.addRow([
    isAr ? 'المؤشر' : 'Metric',
    isAr ? 'القيمة الحالية' : 'Value',
    isAr ? 'الوحدة / المقياس' : 'Unit',
    isAr ? 'المقارنة بالفترة السابقة' : 'Trend vs Previous',
    isAr ? 'ملاحظات الأداء الاستراتيجي' : 'Strategic Performance Notes',
  ]);
  applyHeaderStyles(kpiHeader);

  const kpiData = [
    [
      isAr ? 'زمن التعيين (Time-to-Hire)' : 'Time-to-Hire',
      kpis.timeToHireDays,
      isAr ? 'أيام' : 'days',
      kpis.timeToHireChange < 0 ? (isAr ? `تحسن ${Math.abs(kpis.timeToHireChange)} أيام` : `${Math.abs(kpis.timeToHireChange)} days faster`) : `+${kpis.timeToHireChange} ${isAr ? 'أيام' : 'days'}`,
      isAr ? 'أسرع بـ 40% من متوسط السوق المحلي في القاهرة والمدن الذكية' : '40% faster than regional industry benchmark',
    ],
    [
      isAr ? 'تكلفة التعيين (Cost-per-Hire)' : 'Cost-per-Hire',
      `${kpis.costPerHire.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
      isAr ? 'جنيه مصري / تعيين' : 'EGP / hire',
      isAr ? `توفير ${kpis.costPerHireSavings}%` : `${kpis.costPerHireSavings}% savings`,
      isAr ? 'انخفاض التكاليف بفضل برنامج الإحالات وبوابة التوظيف المباشرة' : 'Cost optimized via internal referrals and organic careers portal',
    ],
    [
      isAr ? 'معدل قبول العروض (Offer Acceptance)' : 'Offer Acceptance Rate',
      `${kpis.offerAcceptanceRate}%`,
      isAr ? 'نسبة مئوية' : 'Percentage',
      isAr ? `${kpis.offersSignedCount} من أصل ${kpis.offersSentTotal} عرضاً تم توقيعه` : `${kpis.offersSignedCount} of ${kpis.offersSentTotal} offers signed`,
      isAr ? 'استجابة سريعة وتنافسية عبر منظومة عروض العمل والتوقيع الرقمي' : 'High engagement via automated digital offer letter signing',
    ],
    [
      isAr ? 'إجمالي التعيينات المكتملة' : 'Total Completed Hires',
      kpis.totalHiresThisQuarter,
      isAr ? 'موظفاً جديداً' : 'Hires',
      isAr ? `${kpis.activeCandidatesInPipeline} مرشح نشط قيد الإجراء` : `${kpis.activeCandidatesInPipeline} active candidates in pipeline`,
      isAr ? 'تم استيفاء مستهدفات خطة التوظيف بنجاح تام' : 'Headcount targets fulfilled successfully',
    ],
  ];

  kpiData.forEach((rowValues, idx) => {
    const row = ws1.addRow(rowValues);
    applyDataRowStyles(row, idx % 2 === 1);
    // Value cell centered & bold
    const valCell = row.getCell(2);
    valCell.alignment = { vertical: 'middle', horizontal: 'center' };
    valCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: PINE_DARK } };
    // Trend cell pill style
    const trendCell = row.getCell(4);
    trendCell.alignment = { vertical: 'middle', horizontal: 'center' };
    trendCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    trendCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
  });

  // Empty separator
  ws1.addRow([]);

  // Section 2: Department Fulfillment
  const deptTitleRow = ws1.rowCount + 1;
  addSectionTitle(ws1, deptTitleRow, 'F', isAr ? '2. استيفاء خطط التوظيف حسب الإدارات (Department Fulfillment)' : '2. Department Hiring Fulfillment');

  const deptHeader = ws1.addRow([
    isAr ? 'الإدارة / القسم' : 'Department',
    isAr ? 'الشواغر المفتوحة' : 'Open Positions',
    isAr ? 'المستهدف' : 'Target Hires',
    isAr ? 'المنجز' : 'Filled Hires',
    isAr ? 'نسبة الاستيفاء' : 'Fulfillment Rate',
    isAr ? 'متوسط سرعة الإغلاق' : 'Avg Time to Hire',
  ]);
  applyHeaderStyles(deptHeader);

  departments.forEach((d, idx) => {
    const row = ws1.addRow([
      isAr ? d.department : d.departmentEn,
      d.openPositions,
      d.targetHires,
      d.filledHires,
      `${d.fulfillmentRate}%`,
      `${d.avgTimeToHire} ${isAr ? 'يوماً' : 'days'}`,
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
    const rateCell = row.getCell(5);
    rateCell.alignment = { vertical: 'middle', horizontal: 'center' };
    rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    rateCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Empty separator
  ws1.addRow([]);

  // Section 3: Recruiter Performance
  const recTitleRow = ws1.rowCount + 1;
  addSectionTitle(ws1, recTitleRow, 'F', isAr ? '3. إنتاجية وأعباء مسؤولي التوظيف (Recruiter Workload & Performance)' : '3. Recruiter Performance');

  const recHeader = ws1.addRow([
    isAr ? 'اسم مسؤول التوظيف' : 'Recruiter Name',
    isAr ? 'الشواغر النشطة' : 'Active Reqs',
    isAr ? 'المرشحين المعالجين' : 'Processed Candidates',
    isAr ? 'التعيينات المنجزة' : 'Hired Count',
    isAr ? 'متوسط سرعة التعيين' : 'Avg Speed',
    isAr ? 'نسبة قبول العروض' : 'Offer Acceptance Rate',
  ]);
  applyHeaderStyles(recHeader);

  recruiters.forEach((r, idx) => {
    const row = ws1.addRow([
      r.name,
      r.activeRequisitions,
      r.totalCandidatesProcessed,
      r.hiredCount,
      `${r.averageTimeToHireDays} ${isAr ? 'يوماً' : 'days'}`,
      `${r.offerAcceptanceRate}%`,
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: MINT_PRIMARY } };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    const accCell = row.getCell(6);
    accCell.alignment = { vertical: 'middle', horizontal: 'center' };
    accCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    accCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
  });

  // Set generous column widths
  ws1.columns = [
    { width: 32 }, // Col A
    { width: 22 }, // Col B
    { width: 22 }, // Col C
    { width: 26 }, // Col D
    { width: 48 }, // Col E
    { width: 24 }, // Col F
  ];

  // =========================================================================
  // 2. SHEET 2: FUNNEL & MONTHLY VELOCITY
  // =========================================================================
  const ws2 = workbook.addWorksheet(isAr ? 'قمع_التوظيف_والسرعة' : 'Funnel_and_Velocity', {
    views: [{ rightToLeft: isAr }],
  });

  addBanner(ws2, 'E');

  // Section 1: Funnel
  addSectionTitle(ws2, 5, 'E', isAr ? '1. مراحل قمع التوظيف ومعدلات التحويل وفترات المكوث (Recruitment Funnel)' : '1. Recruitment Funnel & Conversion');

  const funnelHeader = ws2.addRow([
    isAr ? 'مرحلة قمع التوظيف' : 'Funnel Stage',
    isAr ? 'عدد المرشحين' : 'Candidates Count',
    isAr ? 'نسبة التحويل %' : 'Conversion Rate %',
    isAr ? 'متوسط فترة المكوث' : 'Avg Dwell Time',
    isAr ? 'تقييم كفاءة المرحلة' : 'Stage Efficiency Rating',
  ]);
  applyHeaderStyles(funnelHeader);

  funnel.forEach((f, idx) => {
    const row = ws2.addRow([
      isAr ? f.stageName : f.stageNameEn,
      f.count,
      `${f.conversionRate}%`,
      `${f.averageDaysInStage} ${isAr ? 'أيام' : 'days'}`,
      f.averageDaysInStage <= 3 ? (isAr ? 'سلسلة ممتازة' : 'Fast processing') : (isAr ? 'ضمن المعدل الطبيعي' : 'Standard velocity'),
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
    const convCell = row.getCell(3);
    convCell.alignment = { vertical: 'middle', horizontal: 'center' };
    convCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    convCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Empty separator
  ws2.addRow([]);

  // Section 2: Monthly Velocity
  const monthTitleRow = ws2.rowCount + 1;
  addSectionTitle(ws2, monthTitleRow, 'E', isAr ? '2. التطور والسرعة الشهرية للتعيينات (Month-over-Month Velocity)' : '2. Month-over-Month Velocity');

  const monthHeader = ws2.addRow([
    isAr ? 'الشهر' : 'Month',
    isAr ? 'عدد التعيينات' : 'Hires Count',
    isAr ? 'طلبات التقديم' : 'Applications Count',
    isAr ? 'متوسط زمن التعيين' : 'Avg Speed',
    isAr ? 'تكلفة التعيين' : 'Cost per Hire',
  ]);
  applyHeaderStyles(monthHeader);

  monthlyTrends.forEach((m, idx) => {
    const row = ws2.addRow([
      isAr ? m.month : m.monthEn,
      m.hiresCount,
      m.applicationsCount,
      `${m.avgTimeToHireDays} ${isAr ? 'يوماً' : 'days'}`,
      `${m.costPerHire.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: MINT_PRIMARY } };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
  });

  ws2.columns = [
    { width: 34 },
    { width: 22 },
    { width: 22 },
    { width: 24 },
    { width: 32 },
  ];

  // =========================================================================
  // 3. SHEET 3: SOURCING CHANNELS & ROI
  // =========================================================================
  const ws3 = workbook.addWorksheet(isAr ? 'قنوات_الاستقطاب' : 'Sourcing_ROI', {
    views: [{ rightToLeft: isAr }],
  });

  addBanner(ws3, 'G');

  addSectionTitle(ws3, 5, 'G', isAr ? 'عائد وكفاءة قنوات الاستقطاب والميزانيات (Sourcing Channel ROI & Spend)' : 'Sourcing Channels & ROI');

  const sourceHeader = ws3.addRow([
    isAr ? 'قناة الاستقطاب / المصدر' : 'Channel Source',
    isAr ? 'عدد المتقدمين' : 'Applicants Count',
    isAr ? 'التعيينات المنجزة' : 'Hires Count',
    isAr ? 'معدل التحويل' : 'Conversion Rate',
    isAr ? 'الميزانية المنفقة' : 'Spend Budget',
    isAr ? 'تكلفة التعيين للقناة' : 'Cost per Hire',
    isAr ? 'مؤشر الجودة' : 'Quality Score',
  ]);
  applyHeaderStyles(sourceHeader);

  sources.forEach((s, idx) => {
    const row = ws3.addRow([
      isAr ? s.source : s.sourceEn,
      s.candidatesCount,
      s.hiredCount,
      `${s.conversionPercent}%`,
      `${s.spendAmount.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
      s.costPerHire > 0 ? `${s.costPerHire.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? 'مجاني (0 ج.م)' : '0 EGP (Free)'),
      `${s.qualityScore}%`,
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
    const qualCell = row.getCell(7);
    qualCell.alignment = { vertical: 'middle', horizontal: 'center' };
    qualCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    qualCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
  });

  // Total Aggregate Row
  const totalApps = sources.reduce((acc, s) => acc + s.candidatesCount, 0);
  const totalHires = sources.reduce((acc, s) => acc + s.hiredCount, 0);
  const totalSpend = sources.reduce((acc, s) => acc + s.spendAmount, 0);

  const totalRow = ws3.addRow([
    isAr ? 'الإجمالي العام' : 'Total Aggregates',
    totalApps,
    totalHires,
    totalApps > 0 ? `${((totalHires / totalApps) * 100).toFixed(1)}%` : '-',
    `${totalSpend.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`,
    totalHires > 0 ? `${Math.round(totalSpend / totalHires).toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}` : '-',
    '-',
  ]);
  totalRow.height = 24;
  totalRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_HEADER_BG } };
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: MINT_PRIMARY } },
      bottom: { style: 'medium', color: { argb: MINT_PRIMARY } },
      left: { style: 'thin', color: { argb: BORDER_COLOR } },
      right: { style: 'thin', color: { argb: BORDER_COLOR } },
    };
  });

  ws3.columns = [
    { width: 34 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 24 },
    { width: 26 },
    { width: 20 },
  ];

  // =========================================================================
  // 4. SHEET 4: QUALITY & DEMOGRAPHICS
  // =========================================================================
  const ws4 = workbook.addWorksheet(isAr ? 'جودة_المرشحين' : 'Quality_and_Diversity', {
    views: [{ rightToLeft: isAr }],
  });

  addBanner(ws4, 'D');

  addSectionTitle(ws4, 5, 'D', isAr ? '1. توزيع شرائح جودة ومطابقة المرشحين (Candidate Quality Tiers)' : '1. Candidate Quality & Match Tiers');

  const qualityHeader = ws4.addRow([
    isAr ? 'شريحة المطابقة' : 'Match Tier Bracket',
    isAr ? 'عدد المرشحين' : 'Candidates Count',
    isAr ? 'النسبة المئوية' : 'Share Percentage',
    isAr ? 'التوجيه الاستراتيجي' : 'Strategic Action',
  ]);
  applyHeaderStyles(qualityHeader);

  qualityBrackets.forEach((q, idx) => {
    const row = ws4.addRow([
      isAr ? q.bracket : q.bracketEn,
      q.count,
      `${q.percentage}%`,
      isAr ? q.description : q.descriptionEn,
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
    const pctCell = row.getCell(3);
    pctCell.alignment = { vertical: 'middle', horizontal: 'center' };
    pctCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    pctCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
  });

  // Empty separator
  ws4.addRow([]);

  // Section 2: Demographics
  const demoTitleRow = ws4.rowCount + 1;
  addSectionTitle(ws4, demoTitleRow, 'D', isAr ? '2. تنوع مستويات الخبرة للكوادر المتقدمة (Experience Demographics)' : '2. Experience Level Demographics');

  const demoHeader = ws4.addRow([
    isAr ? 'مستوى الخبرة' : 'Experience Level',
    isAr ? 'عدد الكوادر' : 'Candidates Count',
    isAr ? 'النسبة المئوية' : 'Share Percentage',
    isAr ? 'التصنيف' : 'Classification',
  ]);
  applyHeaderStyles(demoHeader);

  experienceDiversity.forEach((e, idx) => {
    const row = ws4.addRow([
      isAr ? e.level : e.levelEn,
      e.count,
      `${e.percentage}%`,
      isAr ? 'كوادر نشطة' : 'Active Talent',
    ]);
    applyDataRowStyles(row, idx % 2 === 1);
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PINE_DARK } };
    const pctCell = row.getCell(3);
    pctCell.alignment = { vertical: 'middle', horizontal: 'center' };
    pctCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MINT_BADGE_BG } };
    pctCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: MINT_BADGE_TXT } };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
  });

  ws4.columns = [
    { width: 34 },
    { width: 22 },
    { width: 22 },
    { width: 45 },
  ];

  // =========================================================================
  // WRITE BUFFER & TRIGGER DIRECT BROWSER DOWNLOAD
  // =========================================================================
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `ATS_Recruitment_Analytics_${options.periodKey.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
