jest.mock('react-native-paper', () => {
  const { View, Text, TextInput, Pressable } = require('react-native');
  return {
    PaperProvider: ({ children }: any) => children,
    Chip: ({ children, onPress }: any) => <Pressable onPress={onPress}><Text>{children}</Text></Pressable>,
    HelperText: ({ children }: any) => <Text>{children}</Text>,
    Searchbar: ({ placeholder, onChangeText, value }: any) => (
      <TextInput placeholder={placeholder} onChangeText={onChangeText} value={value} />
    ),
    Modal: ({ children, visible }: any) => visible ? <View>{children}</View> : null,
    Portal: ({ children }: any) => <View>{children}</View>,
  };
});