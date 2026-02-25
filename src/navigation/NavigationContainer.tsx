import React, { ReactNode, createRef } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { RootStackParamList } from "./AuthHomepage";

//This is a custom navigation reference to be able to use the navigation methods with React Paper's Bottom
//Tab Navigator.
export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function reset(name: keyof RootStackParamList) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name }],
  });
}

interface AppNavigationContainerProps {
  children: ReactNode;
}

const AppNavigationContainer: React.FC<AppNavigationContainerProps> = ({
  children,
}) => <NavigationContainer ref={navigationRef}>{children}</NavigationContainer>;

export default AppNavigationContainer;
