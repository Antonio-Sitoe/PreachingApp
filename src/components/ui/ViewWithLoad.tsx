import { View } from '../Themed'

export const ViewWithLoad = ({ children, isRendered }) => {
  return (
    <>
      {isRendered ? (
        <>{children}</>
      ) : (
        <View className="w-full h-14 mb-3 bg-[#f5f5f5] rounded" />
      )}
    </>
  )
}
