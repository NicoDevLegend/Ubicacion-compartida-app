import { ActivityIndicator } from "react-native";
import theme from "../utils/Theme";

export default function Loader() {
  return <ActivityIndicator size="large" color={theme.text} />;
}
