declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: FC<SvgProps>;
  export default content;
}

declare module '*.css';

declare module '*.ttf' {
  const content: number;
  export default content;
}

declare module '*.sql' {
  const content: string;
  export default content;
}
