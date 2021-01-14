import React from 'react'
import { observer } from 'mobx-react'
import { Languages } from '../components/languages'
import { Dictionary } from '../components/dictionary'
import { TouchableOpacity } from 'react-native'
import { styles, mainColor } from "../global/globalStyle";
import { DictionaryDetails } from '../components/dictionaryDetails'
import { createStackNavigator } from '@react-navigation/stack'
import { modalVisible, setModalVisible } from '../global/globalState'
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'

const Stack = createStackNavigator()

export const DictionaryNavigator = observer(() => {
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
                name="DictionaryHome" 
                component={Dictionary} 
                initialParams={{post: "there will be a posted text"}} 
                options={({navigation, route}) => ({ 
                    headerTitle: 'Dictionary',
                    headerRight: props => (
                        <TouchableOpacity 
                            style={styles.headerIcon} 
                            onPress={() => setModalVisible('dictionaries', true)}
                        >
                            <Entypo name="plus" size={24} color='#fff' />
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen 
                name="DictionaryDetails" 
                component={DictionaryDetails} 
                options={({ route, navigation }) => ({
                    title: route.params.title,
                    headerRight: props => 
                    route.params.id !== 'correct' && route.params.id !== 'incorrect' ? (
                        <>
                            {route.params.id === 'history' ? (
                                <TouchableOpacity 
                                    style={styles.headerIcon} 
                                    onPress={() => setModalVisible('history', !modalVisible.history.value)}
                                >
                                    <MaterialCommunityIcons name="delete-sweep-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity 
                                    style={styles.headerIcon} 
                                    onPress={() => setModalVisible('dictionary', true)}
                                >
                                    <Entypo name="plus" size={24} color='#fff' />
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (<></>)
                })}
            />
            <Stack.Screen 
                name='Languages'
                component={Languages}
            />
        </Stack.Navigator>
    )
})