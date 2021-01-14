import React from 'react'
import { Home } from '../components/home'
import { Feather } from '@expo/vector-icons'
import { Details } from '../components/details'
import { Languages } from '../components/languages'
import { styles, mainColor } from "../global/globalStyle"
import { createStackNavigator } from '@react-navigation/stack'
import { TouchableOpacity, View, Image } from 'react-native'

const Stack = createStackNavigator()

// const Logo = () => {
//     return (
//         <Image
//             style={{width: 30, height: 30, borderRadius: 15}}
//             source={require('../assets/avatar.jpg')}
//         />
//     )
// }

export const HomeNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: mainColor
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: 22
                }
            }}
        >
            <Stack.Screen 
                name="Home" 
                component={Home} 
                initialParams={{firstLang: 'English', LastLang: 'Uzbek'}} 
                options={({navigation, route}) => ({ 
                    headerTitle: 'Translator',
                    headerRight: props => (
                        <TouchableOpacity 
                            style={styles.headerIcon} 
                            onPress={() => navigation.navigate('About')}
                        >
                            <Feather name="info" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                    // headerLeft: props => (
                    //     <TouchableOpacity 
                    //         style={styles.headerIcon}
                    //         onPress={() => navigation.navigate('Details')}
                    //     >
                    //         <Logo />
                    //     </TouchableOpacity>
                    // ),
                })}
            />
            <Stack.Screen 
                name="About" 
                component={Details} 
                // options={({ route }) => ({
                //     title: route.params.name
                // })}
            />
            <Stack.Screen 
                name='Languages'
                component={Languages}
            />
        </Stack.Navigator>
    )
}