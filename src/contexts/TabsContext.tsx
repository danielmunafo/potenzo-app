import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  isTabsVisible: boolean;
  setIsTabsVisible: (v: boolean) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);
interface TabsProviderProps {
  children: React.ReactNode;
}

export function TabsProvider({ children }: TabsProviderProps) {
  const [isTabsVisible, setIsTabsVisible] = useState<boolean>(false);

  const value: TabsContextType = {
    isTabsVisible,
    setIsTabsVisible,
  };
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
}
