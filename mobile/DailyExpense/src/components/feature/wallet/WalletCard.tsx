// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import WalletIconRenderer from './WalletIconRenderer';
// import { getWalletVisuals } from '../../../utils/wallet.utils';
// import { Wallet } from '../../../types/wallet';
// import { capitalize } from '../../../utils/string';
// import { getCurrencySymbol } from '../../../utils/currency';
// import { toFormattedDateTime } from '../../../utils/date';
// import BalanceComponent from './BalanceComponent';
// import { CurrencyCode } from '../../../types/types';

// const { width } = Dimensions.get('window');

// const WalletCard = ({ wallet, isBackCard = false }: { wallet: Wallet, isBackCard?: boolean }) => {
//     const { colors, textColor } = getWalletVisuals(wallet.type, wallet.provider);
    
//     // Logic for Negative Balance
//     const isNegative = wallet.balance < 0;
//     const balanceColor = isNegative ? '#FF5252' : textColor; // Bright red for negative

//     // Fix for EasyPaisa/Green visibility
//     const isGreenProvider = wallet.provider === 'easypaisa';
//     const iconColor = isGreenProvider ? '#FFFFFF' : textColor; 

//     return (
//         <LinearGradient
//             colors={colors}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={[styles.cardContainer, isBackCard ? styles.backCard : styles.frontCard]}
//         >
//             <View style={styles.header}>
//                 <View style={isGreenProvider ? styles.iconBadge : null}>
//                    <WalletIconRenderer 
//                         iconKey={(wallet.provider || wallet.type) as any} 
//                         color={iconColor} 
//                         size={30} 
//                     />
//                 </View>
//                 {/* Show Currency instead of Card Number */}
//                 <Text style={[styles.currencyLabel, { color: textColor }]}>
//                     {wallet.type.toUpperCase()} ACCOUNT
//                 </Text>
//             </View>

//             {!isBackCard && (
//                 <View style={styles.body}>
//                     <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Current Balance</Text>
//                     <BalanceComponent
//                       balance={wallet.balance}
//                       currency={wallet.currency as CurrencyCode}
//                       textStyle={styles.balanceText}
//                     />
//                     {/* <Text style={[styles.balanceText, { color: balanceColor }]}>
//                         {isNegative ? '-' : ''}{getCurrencySymbol(wallet.currency)} {Math.abs(wallet.balance).toLocaleString()}
//                     </Text> */}
                    
//                     <View style={styles.footer}>
//                         <View>
//                             <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Account Name</Text>
//                             <Text style={[styles.nameText, { color: textColor }]}>{wallet.name}</Text>
//                         </View>
//                         <View style={styles.lastUpdateBox}>
//                             <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Last Update</Text>
//                             <Text style={[styles.nameText, { color: textColor }]}>
//                                 {toFormattedDateTime(wallet.updatedAt, { format: 'mm/dd' })}
//                             </Text>
//                         </View>
//                     </View>
//                 </View>
//             )}
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     cardContainer: {
//         borderRadius: 30,
//         padding: 24,
//         width: width * 0.9,
//         // width: width,
//     },
//     backCard: {
//         height: 100, // Shorter height because only the top is visible
//     },
//     frontCard: {
//         height: 220,
//         elevation: 10, // Shadow for Android
//         shadowColor: '#000', // Shadow for iPhone 13
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.3,
//         shadowRadius: 15,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     body: {
//         marginTop: 20,
//     },
//     label: {
//         fontSize: 12,
//         marginBottom: 4,
//     },
//     footer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//         alignItems: 'flex-end',
//     },
//     nameText: {
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     lastUpdateBox: {
//         alignItems: 'flex-end'
//     },

//     currencyLabel: {
//         fontSize: 12,
//         fontWeight: '700',
//         letterSpacing: 1.2,
//         opacity: 0.8
//     },
//     iconBadge: {
//         backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle white circle for green icons
//         padding: 6,
//         borderRadius: 12,
//     },
//     balanceText: {
//         fontWeight: 'bold',
//         // Add a slight text shadow to make red readable on dark gradients
//         textShadowColor: 'rgba(0, 0, 0, 0.1)',
//         textShadowOffset: { width: 1, height: 1 },
//         textShadowRadius: 2,
//     },
// });


// export default WalletCard;



import React from 'react';
import { View, Text, StyleSheet, Dimensions, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WalletIconRenderer from './WalletIconRenderer';
import { getWalletVisuals } from '../../../utils/wallet.utils';
import { Wallet } from '../../../types/wallet';
import { capitalize } from '../../../utils/string';
import { getCurrencySymbol } from '../../../utils/currency';
import { toFormattedDateTime } from '../../../utils/date';
import BalanceComponent from './BalanceComponent';
import { CurrencyCode } from '../../../types/types';

const { width } = Dimensions.get('window');


type WalletCardProps = {
  wallet: Wallet;
  isBackCard?: boolean;

  style?: StyleProp<ViewStyle>;
}


const WalletCard = ({ wallet, isBackCard = false, style }: WalletCardProps) => {
    const { colors, textColor } = getWalletVisuals(wallet.type, wallet.provider);
    
    // Logic for Negative Balance
    const isNegative = wallet.balance < 0;
    const balanceColor = isNegative ? '#FF5252' : textColor; // Bright red for negative

    // Fix for EasyPaisa/Green visibility
    const isGreenProvider = wallet.provider === 'easypaisa';
    const iconColor = isGreenProvider ? '#FFFFFF' : textColor; 

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            // style={[styles.cardContainer, isBackCard ? styles.backCard : styles.frontCard, style]}
            style={[styles.cardContainer, styles.frontCard, style]}
        >
            <View style={styles.header}>
                <View style={isGreenProvider ? styles.iconBadge : null}>
                   <WalletIconRenderer 
                        iconKey={(wallet.provider || wallet.type) as any} 
                        color={iconColor} 
                        size={30} 
                    />
                </View>
                {/* Show Currency instead of Card Number */}
                <Text style={[styles.currencyLabel, { color: textColor }]}>
                    {wallet.type.toUpperCase()} ACCOUNT
                </Text>
            </View>

            {/* {!isBackCard && ( */}
                <View style={styles.body}>
                    <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Current Balance</Text>
                    <BalanceComponent
                      balance={wallet.balance}
                      currency={wallet.currency as CurrencyCode}
                      textStyle={styles.balanceText}
                    />
                    {/* <Text style={[styles.balanceText, { color: balanceColor }]}>
                        {isNegative ? '-' : ''}{getCurrencySymbol(wallet.currency)} {Math.abs(wallet.balance).toLocaleString()}
                    </Text> */}
                    
                    <View style={styles.footer}>
                        <View>
                            <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Account Name</Text>
                            <Text style={[styles.nameText, { color: textColor }]}>{wallet.name}</Text>
                        </View>
                        <View style={styles.lastUpdateBox}>
                            <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Last Update</Text>
                            <Text style={[styles.nameText, { color: textColor }]}>
                                {toFormattedDateTime(wallet.updatedAt, { format: 'mm/dd' })}
                            </Text>
                        </View>
                    </View>
                </View>
            {/* )} */}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 30,
        padding: 24,
        width: width * 0.9,
        overflow: 'visible'
        // width: width,
    },
    backCard: {
        height: 100, // Shorter height because only the top is visible
    },
    frontCard: {
        height: 220,
        elevation: 10, // Shadow for Android
        shadowColor: '#000', // Shadow for iPhone 13
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    body: {
        marginTop: 20,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'flex-end',
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
    },
    lastUpdateBox: {
        alignItems: 'flex-end'
    },

    currencyLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        opacity: 0.8
    },
    iconBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle white circle for green icons
        padding: 6,
        borderRadius: 12,
    },
    balanceText: {
        fontWeight: 'bold',
        // Add a slight text shadow to make red readable on dark gradients
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});


export default WalletCard;

