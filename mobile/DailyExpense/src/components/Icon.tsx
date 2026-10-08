import React from 'react';
import { 
  StyleProp, 
  ViewStyle, 
  Image, 
  ImageSourcePropType, 
  ImageStyle 
} from 'react-native';
// Note: We import the Base IconProps to ensure full compatibility
// import { IconProps } from 'react-native-vector-icons/Icon';
// import { IconProps } from '@expo/vector-icons/Icon';
import IconProps from '@expo/vector-icons/'
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcon from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { IconProvider } from '../types/styles';


type BaseVectorProps = Omit<React.ComponentProps<typeof MaterialIcon>, 'name'>;


type AppIconProps = BaseVectorProps & {
  name?: string;
  provider?: IconProvider;
  iconSource?: ImageSourcePropType;
  style?: StyleProp<ViewStyle | ImageStyle>;
};

const AppIcon = ({ 
  name, 
  provider = 'Material', 
  iconSource, 
  size, 
  color, 
  style,
  ...rest // Capture any other IconProps (onPress, etc.)
}: AppIconProps) => {
  const { theme } = useTheme();
  
  const finalSize = size ?? theme.fontSize.large;
  const finalColor = color ?? theme.colors.text;

  // Image Provider Logic
  if (provider === 'Image' || iconSource) {
    return (
      <Image
        source={iconSource!}
        style={[
          {
            width: finalSize, 
            height: finalSize, 
            tintColor: color, 
          },
          style,
        ] as ImageStyle}
        resizeMode="contain"
      />
    );
  }

  // Common props for all Vector Libraries
  const vectorProps = {
    ...rest,
    name: (name ?? (provider === 'FontAwesome' ? 'question-circle' : 'help-outline')) as any,
    size: finalSize,
    color: finalColor,
    style: style,
  };

  // 2. Switch between Vector Providers
  switch (provider) {
    case 'Community':
      return <MaterialCommunityIcon {...vectorProps} />;
    case 'FontAwesome':
      return <FontAwesome5 {...vectorProps} />;
    case 'Material':
      return <MaterialIcon {...vectorProps} />;
    case 'Entypo':
      return <Entypo {...vectorProps} />;
    case 'AntDesign':
      return <AntDesign {...vectorProps} />;
    case 'Ionicons':
      return <Ionicons {...vectorProps} />;
    default:
      return <MaterialIcon {...vectorProps} />;
  }
};

export default AppIcon;