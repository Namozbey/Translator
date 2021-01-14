import React, {useState} from 'react'
import { Entypo } from '@expo/vector-icons'
import { observer } from 'mobx-react'
import { Ionicons } from '@expo/vector-icons'
import { statistic } from '../global/globalState'
import { styles, mainColor } from '../global/globalStyle'
import { 
    Text, 
    View, 
    ScrollView, 
    StyleSheet, 
    TouchableOpacity,
} from 'react-native'

// let search = [{
//     'month': Date().split(' ')[1], 
//     'year': Date().split(' ')[3], 
//     'max': 100, 
//     'data': [],
// }]
// for(let i=0; i<15; i++) {
//     search[0].data.push({day: i, value: parseInt(Math.random() * 90 + 2)})
// }

// let save = [{
//     'month': 'Jul', 
//     'year': Date().split(' ')[3], 
//     'max': 40, 
//     'data': [],
// }]
// for(let i=0; i<15; i++) {
//     save[0].data.push({day: i, value: parseInt(Math.random() * 40 + 1)})
// }

export const Statistics = observer(() => {

    return (
        <View style={styles.body}>
            <View style={styles.main}>
                <ScrollView>
                    {statistic.search.length ? (
                        <Diagram 
                            AllData={statistic.search}
                            color='#3d77d8'
                            comment='The amount of words searched per day'
                        />
                    ) : (
                        <View style={{width: '100%', height: 160, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name="ios-stats" size={100} color="#ddd" />
                            <Text style={{color: '#ddd', fontSize: 30}}>Search statistics</Text>
                        </View>
                    )}
                    
                    {statistic.saved.length ? ( 
                        <Diagram 
                            AllData={statistic.saved}
                            color='#FFB300'
                            comment='The amount of words saved per day'
                        />
                    ) : (
                        <View style={{width: '100%', height: 200, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name="ios-stats" size={100} color="#ddd" />
                            <Text style={{color: '#ddd', fontSize: 30}}>Dictionary statistics</Text>
                        </View>
                    )}

                    {statistic.test.length ? ( 
                    <Diagram 
                        AllData={statistic.test}
                        color='#00ea00'
                        colorTwo='#f0001b'
                        comment='The amount of words answered correctly per day'
                        commentTwo='The amount of words answered incorrectly per day'
                        name='test'
                        style={{borderBottomWidth: 0}}
                    />
                    ) : (
                        <View style={{width: '100%', height: 200, justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name="ios-stats" size={100} color="#ddd" />
                            <Text style={{color: '#ddd', fontSize: 30}}>Test statistics</Text>
                        </View>
                    )}
                    
                </ScrollView>
            </View>
        </View>
    )
})

const Diagram = observer(({AllData, color, colorTwo, comment, commentTwo, style, name = 'default'}) => {
    const [index, setIndex] = useState(AllData.length - 1)
    const {month, year, max, data} = AllData[index]

    const next = () => {
        index !== AllData.length - 1 && setIndex(v => v+1)
    }

    const prev = () => {
        index !== 0 && setIndex(v => v-1)
    }

    return (
        <View style={[{borderBottomWidth: 1, paddingVertical: 10}, style]}>
            <View style={{paddingVertical: 10, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 22}}>{months[month]}</Text>
                    <Text style={{fontSize: 14}}>{year}</Text>
                </View>
                <TouchableOpacity onPress={prev} style={{padding: 5}}>
                    <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={next} style={{padding: 5}}>
                    <Entypo name="chevron-right" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{paddingLeft: 35, paddingRight: 5, flexDirection: 'row'}}>
                {/* <View style={{borderWidth: 1, borderColor: '#fff', height: 172}} /> */}
                <View style={{marginLeft: 35, paddingBottom: 38, paddingTop: 10, justifyContent: 'space-between', position: 'absolute', borderBottomWidth: 2, zIndex: -1, height: 172, width: '100%'}}>
                    <View style={{width: '100%', backgroundColor: '#ddd', padding: 1}} />
                    <View style={{width: '100%', backgroundColor: '#ddd', padding: 1}} />
                    <View style={{width: '100%', backgroundColor: '#ddd', padding: 1}} />
                    <View style={{width: '100%', backgroundColor: '#ddd', padding: 1}} />
                </View>
                <View style={{
                    alignItems: 'flex-end', 
                    justifyContent: 'space-between', 
                    position: 'absolute',
                    zIndex: 1,
                    height: 140,
                    width: 32,
                    // backgroundColor: 'yellow',
                }}>
                    <Text style={{color: '#999999'}}>{max}</Text>
                    <Text style={{color: '#999999'}}>{max *3/4}</Text>
                    <Text style={{color: '#999999'}}>{max / 2}</Text>
                    <Text style={{color: '#999999'}}>{max / 4}</Text>
                </View>
                <ScrollView horizontal={true}>
                    <View style={{height: 195, flex: 1}}>
                        {name === 'test' ? (
                            <View style={{height: 172, borderBottomWidth: 2, borderColor: '#051830', flexDirection: 'row'}}>
                                {data.map(({correct, incorrect}, i) => (
                                    <View style={{ flexDirection: 'row', backgroundColor: `rgba(0, 0, 0, ${i%2 !== 0 ? 0.05 : 0})`}} key={i}>
                                        <TouchableOpacity style={{justifyContent: 'flex-end', paddingLeft: 7, paddingRight: 2, height: '100%', }}>
                                            <View style={{width: 10, height: correct*160/max, borderTopRightRadius: 2, borderTopLeftRadius: 2, backgroundColor: color}} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{justifyContent: 'flex-end', paddingLeft: 2, paddingRight: 7, height: '100%', }}>
                                            <View style={{width: 10, height: incorrect*160/max, borderTopRightRadius: 2, borderTopLeftRadius: 2, backgroundColor: colorTwo}} />
                                        </TouchableOpacity>
                                    </View>
                                    
                                ))}
                            </View>
                        ) : (
                            <View style={{height: 172, borderBottomWidth: 2, borderColor: '#051830', flexDirection: 'row'}}>
                                {data.map(({value}, i) => (
                                    <TouchableOpacity key={i} 
                                        style={{
                                            justifyContent: 'flex-end', 
                                            paddingHorizontal: 7, 
                                            height: '100%', 
                                            // backgroundColor: `rgba(0, 0, 0, ${i%2 !== 0 ? 0.05 : 0})`
                                        }}
                                    >
                                        <View style={{width: 14, height: value*160/max, backgroundColor: color, borderTopRightRadius: 2, borderTopLeftRadius: 2}} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View style={{flexDirection: 'row'}}>
                            {data.map(({day}, i) => (
                                <View key={i} style={{width: name === 'test' ?  38 : 28, alignItems: 'center'}}>
                                    <Text style={{color: '#999999'}}>{day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View style={{paddingHorizontal: 5, marginLeft: 35}}>
                <Text style={{fontSize: 18, marginVertical: 5}}>
                    <View style={{width: 5, height: 15, marginRight: 5, backgroundColor: color}} /> - {comment}
                </Text>
                {name === 'test' && 
                    <Text style={{fontSize: 18, marginVertical: 5}}>
                        <View style={{width: 5, height: 15, marginRight: 5, backgroundColor: colorTwo}} /> - {commentTwo}
                    </Text>
                }
            </View>
        </View>
    )
})

const months = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sep': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December',
}