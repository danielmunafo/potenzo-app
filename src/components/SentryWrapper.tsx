import * as Sentry from '@sentry/react-native';

/**
 * Since sentry is not initialized in the root layout, we need to wrap the app in a sentry wrapper.
 * This is because is loaded asynchronously and we need to ensure that it is initialized before any other component is rendered.
 *
 * Logic is handled by `_layout.tsx` and `terms-and-conditions.tsx`
 *
 * @param children - The children to wrap.
 * @returns The wrapped children.
 */
const SentryWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Sentry.wrap(SentryWrapper, {
  touchEventBoundaryProps: { labelName: 'accessibilityLabel' },
});
