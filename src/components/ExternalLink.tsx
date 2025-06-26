import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: Href & string;
  onPress?: () => void;
};

export function ExternalLink({ href, onPress, ...rest }: Props) {
  return (
    <Link
      accessibilityLabel={`external-link-${href}`}
      target="_blank"
      href={href}
      onPress={async (event) => {
        // Call the custom onPress callback if provided
        onPress?.();

        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
      {...rest}
    />
  );
}
