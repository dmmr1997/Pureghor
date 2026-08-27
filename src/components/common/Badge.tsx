import React from 'react';
import { OrderStatus, PaymentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'discount';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    primary: 'bg-[#004d1a]/10 text-[#004d1a] border-[#004d1a]/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    discount: 'bg-[#cc3366] text-white border-transparent font-bold',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; lang?: 'bn' | 'en' }> = ({
  status,
  lang = 'bn',
}) => {
  const statusConfig: Record<
    OrderStatus,
    { labelBn: string; labelEn: string; variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
  > = {
    pending: { labelBn: 'পেন্ডিং', labelEn: 'Pending', variant: 'warning' },
    confirmed: { labelBn: 'কনফার্মড', labelEn: 'Confirmed', variant: 'info' },
    processing: { labelBn: 'প্রসেসিং', labelEn: 'Processing', variant: 'info' },
    packed: { labelBn: 'প্যাকড', labelEn: 'Packed', variant: 'primary' },
    shipped: { labelBn: 'শিপড (পথে আছে)', labelEn: 'Shipped', variant: 'primary' },
    delivered: { labelBn: 'ডেলিভার্ড', labelEn: 'Delivered', variant: 'success' },
    cancelled: { labelBn: 'বাতিল', labelEn: 'Cancelled', variant: 'danger' },
    returned: { labelBn: 'রিটার্নড', labelEn: 'Returned', variant: 'neutral' },
  };

  const conf = statusConfig[status] || { labelBn: status, labelEn: status, variant: 'neutral' };

  return (
    <Badge variant={conf.variant} size="sm">
      {lang === 'bn' ? conf.labelBn : conf.labelEn}
    </Badge>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus; lang?: 'bn' | 'en' }> = ({
  status,
  lang = 'bn',
}) => {
  const statusConfig: Record<
    PaymentStatus,
    { labelBn: string; labelEn: string; variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
  > = {
    pending: { labelBn: 'বাকি (পেন্ডিং)', labelEn: 'Unpaid', variant: 'warning' },
    paid: { labelBn: 'পরিশোধিত (পেইড)', labelEn: 'Paid', variant: 'success' },
    failed: { labelBn: 'ব্যর্থ', labelEn: 'Failed', variant: 'danger' },
    refunded: { labelBn: 'রিফান্ডেড', labelEn: 'Refunded', variant: 'neutral' },
  };

  const conf = statusConfig[status] || { labelBn: status, labelEn: status, variant: 'neutral' };

  return (
    <Badge variant={conf.variant} size="sm">
      {lang === 'bn' ? conf.labelBn : conf.labelEn}
    </Badge>
  );
};
