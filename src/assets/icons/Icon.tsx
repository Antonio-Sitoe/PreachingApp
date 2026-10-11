import { Ionicons, Feather } from '@expo/vector-icons';

export type IconIOSPropName = React.ComponentProps<typeof Ionicons>['name'];

export function IconIOS(props: {
  name: IconIOSPropName;
  color: string;
  size?: number;
}) {
  return (
    <Ionicons
      style={{ fontSize: props.size || 28, marginBottom: -3 }}
      {...props}
    />
  );
}
export function IconFeather(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}
