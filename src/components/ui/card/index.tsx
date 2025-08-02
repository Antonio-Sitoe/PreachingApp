import React from 'react';
import { View, type ViewProps, Text, type TextProps } from 'react-native';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { cardStyle } from './styles';

type ICardProps = ViewProps &
  VariantProps<typeof cardStyle> & { className?: string };

const Card = React.forwardRef<React.ComponentRef<typeof View>, ICardProps>(
  function Card(
    { className, size = 'md', variant = 'elevated', ...props },
    ref
  ) {
    return (
      <View
        className={cardStyle({ size, variant, class: className })}
        {...props}
        ref={ref}
      />
    );
  }
);

Card.displayName = 'Card';

type CardSectionProps = ViewProps & { className?: string };

const CardContent = React.forwardRef<
  React.ComponentRef<typeof View>,
  CardSectionProps
>(function CardContent({ className, ...props }, ref) {
  return (
    <View
      className={['px-4 py-3', className].filter(Boolean).join(' ')}
      {...props}
      ref={ref}
    />
  );
});
CardContent.displayName = 'CardContent';

const CardHeader = React.forwardRef<
  React.ComponentRef<typeof View>,
  CardSectionProps
>(function CardHeader({ className, ...props }, ref) {
  return (
    <View
      className={['px-4 py-3 border-b border-gray-200', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
      ref={ref}
    />
  );
});
CardHeader.displayName = 'CardHeader';

type CardTitleProps = TextProps & { className?: string };

const CardTitle = React.forwardRef<
  React.ComponentRef<typeof Text>,
  CardTitleProps
>(function CardTitle({ className, ...props }, ref) {
  return (
    <Text
      className={['text-lg font-semibold text-gray-900', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
      ref={ref}
    />
  );
});
CardTitle.displayName = 'CardTitle';

export { Card, CardContent, CardHeader, CardTitle };
