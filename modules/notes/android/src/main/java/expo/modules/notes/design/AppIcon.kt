package expo.modules.notes.design

import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.PathParser
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

internal fun buildIconVector(path: String, strokeWidth: Float): ImageVector =
  ImageVector.Builder(defaultWidth = 24.dp, defaultHeight = 24.dp, viewportWidth = 24f, viewportHeight = 24f)
    .addPath(
      pathData = PathParser().parsePathString(path).toNodes(),
      fill = null,
      stroke = SolidColor(Color.Black),
      strokeLineWidth = strokeWidth,
      strokeLineCap = StrokeCap.Round,
      strokeLineJoin = StrokeJoin.Round,
    )
    .build()

@Composable
fun AppIcon(
  name: String,
  tint: Color,
  modifier: Modifier = Modifier,
  size: Dp = 24.dp,
  strokeWidth: Float = 2f,
  contentDescription: String? = null,
) {
  val vector = LocalDs.current.icons.vector(name, strokeWidth) ?: return
  Icon(imageVector = vector, contentDescription = contentDescription, tint = tint, modifier = modifier.size(size))
}
