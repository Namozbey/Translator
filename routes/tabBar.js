import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AntDesign } from '@expo/vector-icons'
import { mainColor } from '../global/globalStyle'
import { HomeNavigator } from './router'
import { TestNavigator } from "./testRouter"
import { DictionaryNavigator } from './dictionaryRouter'
import { StatisticsNavigator } from "./statisticsRouter"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Keyboard } from 'react-native'


const Tab = createBottomTabNavigator()

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'yellow',
                inactiveTintColor: '#fff',
                tabStyle: {
                    backgroundColor: mainColor,
                    // borderTopColor: 'blue',
                    // borderTopWidth: 2,
                    // margin: 0
                }
            }}
        >
            <Tab.Screen 
                name='Home' 
                component={HomeNavigator} 
                options={{
                    tabBarIcon: ({size, color}) => <AntDesign name="home" size={size} color={color} />
                }} 
            />
            <Tab.Screen 
                name='Dictionary' 
                component={DictionaryNavigator}
                options={{
                    tabBarIcon: ({size, color}) => <MaterialCommunityIcons name="dictionary" size={size} color={color} />
                }}
            />
            <Tab.Screen 
                name='Test' 
                component={TestNavigator}
                options={{
                    tabBarIcon: ({size, color}) => <MaterialCommunityIcons name="file-document-box-check-outline" size={size} color={color} />
                }}
            />
            <Tab.Screen 
                name='Statistics' 
                component={StatisticsNavigator}
                options={{
                    tabBarIcon: ({size, color}) => <Ionicons name="ios-stats" size={size} color={color} />
                }}
            />
        </Tab.Navigator>
    )    
}