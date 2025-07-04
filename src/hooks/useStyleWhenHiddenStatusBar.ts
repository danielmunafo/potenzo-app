import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSpacingToken } from '@/theme/FigmaTokens';

export function useContainerStyleWhenHiddenStatusBar() {
  const insets = useSafeAreaInsets();
  return { paddingTop: insets.top + getSpacingToken('spacing-sm') };
}
