import React from 'react';
import { Text } from 'react-native';

const createMockIcon = (name: string) => () => <Text>{name}</Text>;

export const Entypo = createMockIcon('Entypo');
export const Feather = createMockIcon('Feather');
export const Ionicons = createMockIcon('Ionicons');