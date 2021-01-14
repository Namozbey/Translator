import React from 'react'
import { Test } from '../components/test'
import { Feather } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TestDetails } from '../components/testDetails'
import { styles, mainColor } from "../global/globalStyle";
import { createStackNavigator } from '@react-navigation/stack'
import { TouchableOpacity, View, Image } from 'react-native'

const Stack = createStackNavigator()

export const TestNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: mainColor
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center'
            }}
        >
            <Stack.Screen 
                name="TestHome" 
                component={Test} 
                initialParams={{post: "there will be a posted text"}} 
                options={({navigation, route}) => ({ 
                    headerTitle: 'Test'                   
                })}
            />
            <Stack.Screen 
                name="TestDetails" 
                component={TestDetails} 
                options={({ route }) => ({
                    title: route.params.title,
                    // headerLeft: () => (<></>)
                })}
            />
        </Stack.Navigator>
    )
}