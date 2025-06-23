import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';

import { useDatadog } from '@/hooks/useDatadog';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

type LanguageSelectorProps = {
  hasLabel?: boolean;
};

export function LanguageSelector({ hasLabel = false }: LanguageSelectorProps) {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { trackAction } = useDatadog();
  const [menuVisible, setMenuVisible] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português (BR)', flag: '🇧🇷' },
  ] as const;

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  const openMenu = () => {
    setMenuVisible(true);
    trackAction({ 
      action: 'Language Selector Menu Opened',
      attributes: { 
        currentLanguage,
        hasLabel,
        availableLanguages: languages.map(lang => lang.code)
      }
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
    trackAction({ 
      action: 'Language Selector Menu Closed',
      attributes: { currentLanguage }
    });
  };

  const handleLanguageSelect = (languageCode: string) => {
    const selectedLanguage = languages.find(lang => lang.code === languageCode);
    
    trackAction({ 
      action: 'Language Selected',
      attributes: { 
        previousLanguage: currentLanguage,
        newLanguage: languageCode,
        languageName: selectedLanguage?.name,
        hasLabel
      }
    });

    changeLanguage(languageCode as 'en' | 'pt');
    closeMenu();
  };

  return (
    <View style={styles.container}>
      {hasLabel && <Text variant="titleMedium" style={styles.title}>
        {t('profile.language')}
      </Text>}

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="text"
            onPress={openMenu}
            style={styles.dropdownButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="chevron-down"
            dd-action-name="language-selector-button"
            accessibilityLabel="language-selector-button"
          >
            {currentLanguageData ? `${currentLanguageData.flag} ${currentLanguageData.name}` : 'Select Language'}
          </Button>
        }
      >
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            onPress={() => handleLanguageSelect(language.code)}
            title={`${language.flag} ${language.name}`}
            titleStyle={[
              styles.menuItemTitle,
              currentLanguage === language.code && styles.selectedMenuItem
            ]}
            leadingIcon={currentLanguage === language.code ? 'check' : undefined}
            dd-action-name={`language-selector-menu-item-${language.code}`}
            accessibilityLabel={`language-selector-menu-item-${language.code}`}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: getSpacingToken('spacing-md'),
  },
  title: {
    fontFamily: 'Exo2-Bold',
    marginBottom: getSpacingToken('spacing-md'),
    textAlign: 'center',
  },
  dropdownButton: {
    borderRadius: getSpacingToken('spacing-sm'),
    borderColor: getColorToken('core-primary'),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  menuItemTitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  selectedMenuItem: {
    color: getColorToken('core-primary'),
    fontFamily: 'OpenSans-SemiBold',
  },
}); 