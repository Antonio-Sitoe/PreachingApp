import { View } from '../Themed'

export const ViewWithLoad = ({ children, isRendered }) => {
  return (
    <>
      {isRendered ? (
        <>{children}</>
      ) : (
        <View
          lightColor="#f5f5f5"
          darkColor="#464645"
          className="w-full h-14 mb-3  rounded"
        />
      )}
    </>
  )
}
