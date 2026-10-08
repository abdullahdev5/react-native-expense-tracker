import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { useTheme } from "../theme/ThemeProvider";
import AppIcon from "./Icon";
import ImagePicker, { ImagePickerAsset } from "expo-image-picker";
import { useSnackbarStore } from "../store/snackbarStore";
import { ERRORS } from "../constants/errorConstants";

type ProfilePhotoProps = {
  imageUrl?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

function ProfilePicture({ imageUrl, size = 100, style }: ProfilePhotoProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        profilePictureStyles.container,
        {
          backgroundColor: "#E0F2FE",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: theme.colors.text,
        },
        style,
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={profilePictureStyles.image} />
      ) : (
        <AppIcon
          style={[
            profilePictureStyles.icon,
            {
              transform: [{ translateY: size * 0.25 }],
            },
          ]}
          name="person"
          size={size * 0.9}
          color={colors.grey}
        />
      )}
    </View>
  );
}

const profilePictureStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  icon: {
    alignSelf: "center",
  },
});

type UploadPictureProps = ProfilePhotoProps & {
  onUpload: (image: ImagePickerAsset) => void;
  mode: "camera" | "gallery";
  style?: StyleProp<ViewStyle>;
};

function UploadPicture({
  onUpload,
  mode,
  size = 130,
  style,
  ...props
}: UploadPictureProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    setImageUri(props.imageUrl || null);
  }, [props.imageUrl]);

  const onImagePick = async () => {
    const result =
      mode === "gallery"
        ? await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
          })
        : await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
          });


    if (result.canceled) {
      useSnackbarStore
        .getState()
        .showSnackbar('Cancelled! maybe Permission denied.', { type: "error" });

      return;
    }

    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri || null);
      onUpload(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity style={[style]} activeOpacity={0.8} onPress={onImagePick}>
      <View style={{ position: "relative" }}>
        <ProfilePicture imageUrl={imageUri} size={size} {...props} />

        {/* Overlay */}
        {imageUri && (
          <TouchableOpacity
            style={uploadPictureStyles.overlay}
            onPress={onImagePick}
          >
            <AppIcon
              style={uploadPictureStyles.editIcon}
              name="edit"
              size={size * 0.4}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const uploadPictureStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(0,0,0,0.55)", // dark transparent bg
    borderRadius: 999, // keeps it circular
  },
  editIcon: {
    alignSelf: "center",
  },
});

export default ProfilePicture;
export { UploadPicture };
