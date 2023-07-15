import { Ionicons, Feather } from '@expo/vector-icons'

export function IconIOS(props: {
  name: React.ComponentProps<typeof Ionicons>['name']
  color: string
  size?: number
}) {
  return (
    <Ionicons
      style={{ fontSize: props.size || 28, marginBottom: -3 }}
      {...props}
    />
  )
}
export function IconFeather(props: {
  name: React.ComponentProps<typeof Feather>['name']
  color: string
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />
}
