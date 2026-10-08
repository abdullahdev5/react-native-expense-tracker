import { FlexStyle, TextStyle } from 'react-native';

// Layout Styles
export type JustifyContent = FlexStyle['justifyContent'];
export type AlignItems = FlexStyle['alignItems'];
export type FlexDirection = FlexStyle['flexDirection'];


// Text Styles
export type FontWeight = TextStyle['fontWeight'];
export type TextDecoration = TextStyle['textDecorationLine'];


// TextInput Style
export type TextInputBorder = "outlined" | "underlined";


// Icon
export type IconProvider = 'Material' | 'Community' | 'FontAwesome' | 'Entypo' | 'AntDesign' | 'Ionicons' |'Image';