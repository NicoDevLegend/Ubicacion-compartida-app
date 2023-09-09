import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { Link, useLocation } from "react-router-native";
import theme from "../utils/Theme";
import React from "react";

type Props = {
  children: React.ReactNode;
  to: string;
};

const AppBarTab: React.FC<Props> = ({ children, to }) => {
  const { pathname } = useLocation();

  const active = pathname === to;

  const textStyles = [styles.text, active && styles.active];
  return (
    <Link underlayColor={theme.secondary} to={to}>
      <Text style={textStyles}>{children}</Text>
    </Link>
  );
};

export default function AppBar() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scroll}>
        <AppBarTab to="/">Inicio</AppBarTab>
        <AppBarTab to="/map">Mapa</AppBarTab>
        <AppBarTab to="/group">Grupo</AppBarTab>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.secondary,
    paddingTop: Constants.statusBarHeight + 10,
  },
  scroll: {
    paddingBottom: 15,
  },
  text: {
    color: theme.text,
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  active: {
    color: theme.selection,
  },
});
