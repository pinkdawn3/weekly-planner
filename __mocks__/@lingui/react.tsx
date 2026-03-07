import React from 'react';
import { View } from 'react-native';

export const useLingui = () => ({
  _: (msg: any) => msg.id ?? msg,
});

export const I18nProvider = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);
