import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { REPORT_STATUS_LABEL, type ReportStatus } from '@/utils/reports';
import { View } from 'react-native';

const STYLE: Record<ReportStatus, { bg: string; text: string }> = {
  sent: { bg: 'bg-success-soft', text: 'text-success' },
  pending: { bg: 'bg-warning-soft', text: 'text-warning' },
  not_sent: { bg: 'bg-muted', text: 'text-muted-foreground' },
};

function ReportStatusBadge({ status, className }: { status: ReportStatus; className?: string }) {
  const style = STYLE[status];
  return (
    <View className={cn('self-start rounded-full px-2 py-[3px]', style.bg, className)}>
      <Text variant="labelS" className={style.text}>
        {REPORT_STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

export { ReportStatusBadge };
