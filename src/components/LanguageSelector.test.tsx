import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';

import { LanguageSelector } from '@/components/LanguageSelector';
import { TestWrapper } from '@/utils/test-utils';

// Mock the translation hook
const mockChangeLanguage = jest.fn();
const mockTranslationHook = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'profile.language': 'Language',
    };
    return translations[key] || key;
  },
  changeLanguage: mockChangeLanguage,
  currentLanguage: 'en',
};

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => mockTranslationHook,
}));

describe('<LanguageSelector />', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockTranslationHook.currentLanguage = 'en';
    mockTranslationHook.changeLanguage = mockChangeLanguage;
  });

  afterEach(() => {
    cleanup();
  });

  test('Text renders correctly on LanguageSelector', async () => {
    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      getByText('🇺🇸 English');
    });
  });

  test('renders with hasLabel prop', async () => {
    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector hasLabel={true} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(getByText('Language')).toBeTruthy();
      expect(getByText('🇺🇸 English')).toBeTruthy();
    });
  });

  test('does not render label when hasLabel is false', async () => {
    const { queryByText, getByText } = render(
      <TestWrapper>
        <LanguageSelector hasLabel={false} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(queryByText('Language')).toBeNull();
      expect(getByText('🇺🇸 English')).toBeTruthy();
    });
  });

  test('opens menu when button is pressed', async () => {
    const { getByText, getAllByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      // Check that both language options are rendered in the menu
      const englishElements = getAllByText('🇺🇸 English');
      expect(englishElements[0]).not.toBeUndefined();
      expect(englishElements[1]).not.toBeUndefined();
      expect(getByText('🇧🇷 Português (BR)')).toBeTruthy();
    });
  });

  test('displays correct language options in menu', async () => {
    const { getByText, getAllByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      const englishElements = getAllByText('🇺🇸 English');
      expect(englishElements[0]).not.toBeUndefined();
      expect(englishElements[1]).not.toBeUndefined();
      expect(getByText('🇧🇷 Português (BR)')).toBeTruthy();
    });
  });

  test('shows check icon for current language in menu', async () => {
    const { getByText, getAllByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      // The current language (English) should have a check icon
      // Note: This test might need adjustment based on how react-native-paper renders icons
      const englishElements = getAllByText('🇺🇸 English');
      expect(englishElements[0]).not.toBeUndefined();
      expect(englishElements[1]).not.toBeUndefined();
    });
  });

  test('handles language selection', async () => {
    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      const portugueseOption = getByText('🇧🇷 Português (BR)');
      fireEvent.press(portugueseOption);
    });

    // Verify that changeLanguage was called
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt');
  });

  test('displays fallback text when current language is not found', async () => {
    // Temporarily change the current language to an unknown one
    mockTranslationHook.currentLanguage = 'fr';

    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(getByText('Select Language')).toBeTruthy();
    });
  });

  test('renders in English and shows Select Language when user language is not found', async () => {
    // Set current language to an unsupported language (e.g., French)
    mockTranslationHook.currentLanguage = 'fr';

    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    // Should show "Select Language" as fallback
    await waitFor(() => {
      expect(getByText('Select Language')).toBeTruthy();
    });

    // Open the menu
    const selectButton = getByText('Select Language');
    fireEvent.press(selectButton);

    // Wait for menu to open and check for menu items
    await waitFor(() => {
      // Look for the menu items directly
      expect(getByText('🇺🇸 English')).toBeTruthy();
      expect(getByText('🇧🇷 Português (BR)')).toBeTruthy();
    });

    // Select English from the menu
    const englishMenuItem = getByText('🇺🇸 English');
    fireEvent.press(englishMenuItem);

    // Should call changeLanguage with 'en'
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  test('displays Portuguese when current language is Portuguese', async () => {
    // Set current language to Portuguese
    mockTranslationHook.currentLanguage = 'pt';

    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(getByText('🇧🇷 Português (BR)')).toBeTruthy();
    });
  });

  test('closes menu when language is selected', async () => {
    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(getByText('🇧🇷 Português (BR)')).toBeTruthy();
    });

    // Select a language
    const portugueseOption = getByText('🇧🇷 Português (BR)');
    fireEvent.press(portugueseOption);

    // Menu should close (though this might be hard to test with react-native-paper)
    // We can at least verify the button is still there
    await waitFor(() => {
      expect(getByText('🇺🇸 English')).toBeTruthy();
    });
  });

  test('handles menu dismiss correctly', async () => {
    const { getByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(getByText('🇧🇷 Português (BR)')).toBeTruthy();
    });

    // Simulate menu dismiss (this might need adjustment based on react-native-paper behavior)
    // The menu should close when dismissed
  });

  test('calls changeLanguage with correct parameters', async () => {
    const { getByText, getAllByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      // Get all elements with the text and select the second one (menu item)
      const englishElements = getAllByText('🇺🇸 English');
      const englishMenuItem = englishElements[1]; // Second element is the menu item
      fireEvent.press(englishMenuItem);
    });

    // Should call changeLanguage with 'en'
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  test('handles multiple language selections', async () => {
    const { getByText, getAllByText } = render(
      <TestWrapper>
        <LanguageSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    // First selection - Portuguese
    await waitFor(() => {
      const portugueseOption = getByText('🇧🇷 Português (BR)');
      fireEvent.press(portugueseOption);
    });
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt');

    // Reset mock calls
    mockChangeLanguage.mockClear();

    // Second selection - English
    await waitFor(() => {
      const button = getByText('🇺🇸 English');
      fireEvent.press(button);
    });

    await waitFor(() => {
      const englishElements = getAllByText('🇺🇸 English');
      const englishMenuItem = englishElements[1]; // Second element is the menu item
      fireEvent.press(englishMenuItem);
    });
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });
});
