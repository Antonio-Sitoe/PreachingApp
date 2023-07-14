import Feather from '@expo/vector-icons/Feather'

export function Icon(props: {
  name: React.ComponentProps<typeof Feather>['name']
  color: string
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />
}
