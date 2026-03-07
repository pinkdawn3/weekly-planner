module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: ["__tests__/helpers/", "__tests__/setup.tsx"],
  setupFilesAfterEnv: ["./__tests__/setup.tsx"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-paper|@react-native-paper/.*)",
  ],
  moduleNameMapper: {
    "react-native-paper": "<rootDir>/__mocks__/react-native-paper.tsx",
  },
};
