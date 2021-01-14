import React from 'react'
import { mainColor } from "../global/globalStyle";
import { Statistics } from '../components/statistics'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export const StatisticsNavigator = () => {
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
                name="StatisticsHome" 
                component={Statistics} 
                initialParams={{post: "there will be a posted text"}} 
                options={({navigation, route}) => ({ 
                    headerTitle: 'Statistics'                   
                })}
            />
        </Stack.Navigator>
    )
}