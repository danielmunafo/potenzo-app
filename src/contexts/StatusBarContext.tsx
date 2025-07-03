import React, { createContext, useContext, useState } from 'react';

interface StatusBarContextType {
  isStatusBarVisible: boolean;
  setIsStatusBarVisible: (v: boolean) => void;
}

const StatusBarContext = createContext<StatusBarContextType | undefined>(
  undefined
);
interface StatusBarProviderProps {
  children: React.ReactNode;
}

export function StatusBarProvider({ children }: StatusBarProviderProps) {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState<boolean>(false);

  const value: StatusBarContextType = {
    isStatusBarVisible,
    setIsStatusBarVisible,
  };
  return (
    <StatusBarContext.Provider value={value}>
      {children}
    </StatusBarContext.Provider>
  );
}

export function useStatusBarContext() {
  const context = useContext(StatusBarContext);
  if (context === undefined) {
    throw new Error(
      'useStatusBarContext must be used within a StatusBarProvider'
    );
  }
  return context;
}
