import React from 'react';
import { EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface SalaryShieldProps {
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  className?: string;
  isMonthly?: boolean;
}

export const SalaryShield: React.FC<SalaryShieldProps> = ({
  amount,
  minAmount,
  maxAmount,
  currency = 'ج.م',
  className = '',
  isMonthly = true,
}) => {
  const { canViewSalary } = useAuth();
  const { t } = useThemeLanguage();

  if (!canViewSalary()) {
    return (
      <span
        title={t('تم حجب الراتب لعدم توفر صلاحية الاطلاع المالي', 'Salary hidden due to lack of financial permission')}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sand-200/70 text-neutral-muted text-xs font-medium cursor-help select-none ${className}`}
      >
        <EyeOff className="w-3.5 h-3.5 text-sand-500" />
        <span>•••• {currency}</span>
        <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1 py-0.2 rounded font-normal">
          {t('سري', 'Confidential')}
        </span>
      </span>
    );
  }

  const formatNumber = (num?: number) => {
    return num ? num.toLocaleString() : '0';
  };

  const periodText = isMonthly ? t('/ شهرياً', '/ mo') : t('/ سنوياً', '/ yr');

  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-pine ${className}`}>
      {amount !== undefined ? (
        <span>{formatNumber(amount)} {currency}</span>
      ) : (
        <span>
          {formatNumber(minAmount)} - {formatNumber(maxAmount)} {currency}
        </span>
      )}
      <span className="text-xs font-normal text-neutral-muted">{periodText}</span>
    </span>
  );
};
