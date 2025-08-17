import React from 'react';
import { View } from 'react-native';
import { getIconComponent, type IconName } from '@/lib/icons/icon-registry';
import { iconWithClassName } from '@/lib/icons/iconWithClassName';
import { cn } from '@/lib/utils';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: object;
  absoluteFill?: boolean;
}

export function Icon({
  name,
  size = 24,
  color = '#000000',
  strokeWidth = 2,
  className,
  style,
  absoluteFill = false,
}: IconProps) {
  const IconComponent = getIconComponent(name);

  if (!IconComponent) {
    // Fallback to a default icon or return null
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  // Apply CSS interop for className support
  iconWithClassName(IconComponent);

  const iconElement = (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={absoluteFill ? { position: 'absolute' } : undefined}
    />
  );

  if (absoluteFill) {
    return (
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
        className={cn('justify-center items-center', className)}
      >
        {iconElement}
      </View>
    );
  }

  return iconElement;
}

// Specialized component for background icons
export interface BackgroundIconProps extends Omit<IconProps, 'absoluteFill'> {
  opacity?: number;
  backgroundColor?: string;
}

export function BackgroundIcon({
  name,
  size = 100,
  color = '#000000',
  strokeWidth = 1,
  className,
  style,
  opacity = 0.1,
  backgroundColor,
}: BackgroundIconProps) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          backgroundColor: backgroundColor || 'transparent',
        },
        style,
      ]}
      className={cn('justify-center items-center', className)}
    >
      <Icon name={name} size={size} color={color} strokeWidth={strokeWidth} />
    </View>
  );
}

// Component for icon lists/grids
export interface IconGridProps {
  icons: IconName[];
  onIconPress?: (iconName: IconName) => void;
  selectedIcon?: IconName | null;
  iconSize?: number;
  itemSize?: number;
  className?: string;
}

export function IconGrid({
  icons,
  onIconPress,
  selectedIcon,
  iconSize = 24,
  itemSize = 48,
  className,
}: IconGridProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      }}
      className={cn('flex-row flex-wrap gap-2', className)}
    >
      {icons.map((iconName) => {
        const isSelected = selectedIcon === iconName;
        return (
          <View
            key={iconName}
            style={{
              width: itemSize,
              height: itemSize,
              borderRadius: itemSize / 2,
              backgroundColor: isSelected ? '#e5e7eb' : 'transparent',
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? '#374151' : '#d1d5db',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name={iconName}
              size={iconSize}
              color={isSelected ? '#000000' : '#6b7280'}
            />
          </View>
        );
      })}
    </View>
  );
}
