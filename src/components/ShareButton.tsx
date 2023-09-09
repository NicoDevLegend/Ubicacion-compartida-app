import { View, TouchableOpacity, Share, Alert } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import theme from "../utils/Theme";
import React from "react";

export const ShareButton: React.FC<{ text: string }> = ({ text }) => {
  const handleShare = async () => {
    const options = {
      message: text,
    };

    try {
      await Share.share(options);
    } catch (error) {
      Alert.alert("Error");
    }
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <View>
        <SimpleLineIcons name="share" size={25} color={theme.text} />
      </View>
    </TouchableOpacity>
  );
};
