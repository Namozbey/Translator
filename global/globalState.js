import * as FileSystem from 'expo-file-system'
import { AsyncStorage } from 'react-native'
import { observable, action } from 'mobx'

export const getData = action(() => {
    FileSystem.readAsStringAsync(uri)
        .then(res => {
            let data = JSON.parse(res)
            dictionaries.data = data.dictionaries
            defaultDics.history = data.history
            defaultDics.saved = data.saved
            statistic.search = data.statistic.search
            statistic.saved = data.statistic.saved
            statistic.test = data.statistic.test
        })
        .catch(e => {})
})

export const setData = () => {
    const Data = {
        'dictionaries': dictionaries.data,
        'history': defaultDics.history,
        'saved': defaultDics.saved,
        statistic: {
            'search': statistic.search,
            'saved': statistic.saved,
            'test': statistic.test,
        }

    }

    FileSystem.writeAsStringAsync(uri, JSON.stringify(Data))
        .catch(e => {})
}

export const translation = observable({
    "result": ''
});

export const modalVisible = observable({
    dictionaries: {value: false},
    dictionary: {value: false},
    history: {value: false},
});

export const setModalVisible = action((name, value) => {
    modalVisible[name].value = value
})

export const getRecentlyLangs = () => {
    AsyncStorage.getItem('recentlyLangs')
        .then(action(data => {
            if(data !== null) {
                let { firstLang, lastLang } = JSON.parse(data)
                langs.firstLang = firstLang
                langs.lastLang = lastLang
            }
        }))
        .catch(e => {})
}

export const postRecentlyLangs = () => {
    AsyncStorage.setItem('recentlyLangs', JSON.stringify(langs))
}

export const id = observable({
    value: ''
})

export const setId = () => {
    AsyncStorage.getItem('Id')
        .then(action(val => {
            if(val === null) {
                id.value = '1000000'
            } else {
                id.value = val
            }            
        }))
}

export const getId = action(() => {
    let _id = +id.value + 1
    AsyncStorage.setItem('Id', JSON.stringify(_id))
    id.value = _id
    return _id
})

// AsyncStorage.removeItem('Id')

export const text = observable({
    value: ''
});

export const langs = observable({
    'firstLang': {name: 'English', title: 'en'},
    'lastLang': {name: 'Russian', title: 'ru'}
})

let duration = 0
let input = ''
let output = ''

const interval = setInterval(function() {
    duration -= 1; 
    // console.log(duration)
    if(duration === 0 && input !== output){
        let item = {
            id: getId(),
            firstLang: langs.firstLang.name,
            lastLang: langs.lastLang.name,
            text: input,
            translation: output
        }
        addWordToDefaultDic(item, 'history')
        setStatistics('search')
    }
}, 1000)


export const getTranslation = action((text) => {
    // console.log(text)
    return fetch(`${YANDEX_HOST}/translate?key=${YANDEX_TOKEN}&lang=${langs.firstLang.title}-${langs.lastLang.title}&text=${text}`)
        .then(res => res.json())
        .then(data => {
            translation.result = data.text[0]
            if(data.text.length) {
                duration = 2
                input = text
                output = data.text[0]
            }
        })
        .catch(err => console.log(err))
})

export const dictionaries = observable({
    data: []
})

export const setDictionary = action((_title, _color) => {
    let item = {
        title: _title,
        data: [],
        color: _color,
    }
    dictionaries.data.unshift(item)
})

export const defaultDics = observable({
    'history': [],
    'saved': [],
})

export const statistic = observable({
    'search': [],
    'saved': [],
    'test': []
})

// {'title': 'July', 'year': 2020, 'max': 100, 'data': []},
// {date: i + 1, value: parseInt(Math.random() * 90 + 10)}

export const setStatistics = action((title, val = null) => {
    const current = statistic[title][statistic[title].length - 1]
    if(statistic[title].length && 
        current.month === Date().split(' ')[1]
    ) {
        if(title === 'test') {
            if(current.data.length &&
                current.data[current.data.length - 1].day === Date().split(' ')[2]
            ) {
                if(val) {
                    current.data[current.data.length - 1].correct += 1
                    if(current.data[current.data.length - 1].correct > current.max) {
                        let num = current.data[current.data.length - 1].correct
                        current.max = num.toString().length !== 1
                            ? Math.ceil(num/Math.pow(10, num.toString().length - 1)) * Math.pow(10, num.toString().length - 1)
                            : 10
                    }
                } else {
                    current.data[current.data.length - 1].incorrect += 1
                    if(current.data[current.data.length - 1].incorrect > current.max) {
                        let num = current.data[current.data.length - 1].incorrect
                        current.max = num.toString().length !== 1
                            ? Math.ceil(num/Math.pow(10, num.toString().length - 1)) * Math.pow(10, num.toString().length - 1)
                            : 10
                    }
                }
            } else {
                current.data.push({day: Date().split(' ')[2], correct: 0, incorrect: 0})
                setStatistics(title, val)
            }
        } else {
            if(current.data.length &&
                current.data[current.data.length - 1].day === Date().split(' ')[2]
            ) {
                current.data[current.data.length - 1].value += 1
                if(current.data[current.data.length - 1].value > current.max) {
                    let num = current.data[current.data.length - 1].value
                    current.max = num.toString().length !== 1
                        ? Math.ceil(num/Math.pow(10, num.toString().length - 1)) * Math.pow(10, num.toString().length - 1)
                        : 10
                }
            } else {
                current.data.push({day: Date().split(' ')[2], value: 0})
                setStatistics(title, val)
            }
        }
    } else {
        statistic[title].push({
            'month': Date().split(' ')[1], 
            'year': Date().split(' ')[3], 
            'max': 0, 
            'data': [],
        })
        setStatistics(title, val)
    }

    setData()
})

export const changeTestResult = action((dicId, id, test) => {
    // data.forEach((elm, i) => {if(elm.id == 2) {data.splice(i,1); return 0} })
    Number.isFinite(+dicId)
        ? dictionaries.data[dicId].data.forEach(elem => {
            if(elem.id === id) {elem.test = test; return 0}
        })
        : defaultDics[dicId].forEach(elem => {
            if(elem.id === id) {elem.test = test; return 0}
        })

})

export const addWordToDic = action((item, index) => {
    
    if(!dictionaries.data[index].data.some(({firstLang, lastLang, text, translation}) => 
        item.firstLang === firstLang && 
        item.lastLang === lastLang && 
        item.text === text && 
        item.translation[0] === translation[0]
    )) {
        dictionaries.data[index].data.unshift(item);
        return true
    } else {
        return false
    }
})

export const addWordToDefaultDic = action((item, dicName) => {
    // if(!saved.data.some(v => v.firstLang == item.firstLang))
    if(dicName === 'history') {
        defaultDics[dicName].unshift(item);
    } else {
        if(!defaultDics[dicName].some(({firstLang, lastLang, text, translation}) => 
            item.firstLang === firstLang &&
            item.lastLang === lastLang &&
            item.text === text &&
            item.translation[0] === translation[0]
        )) {
            defaultDics[dicName].unshift(item);
            return true
        } else {
            return false
        }
    }
})



// *************************** Constants *******************************

const uri = FileSystem.documentDirectory + 'data.txt'

const URL = 'https://stormy-refuge-69718.herokuapp.com/'
const TOKEN = '920389471:AAHJGFbPHCQ4sGFOY1BmQvQeIGz3hi9ydjw'
const YANDEX_TOKEN = 'trnsl.1.1.20200216T090652Z.69ff82988b42b1f4.8757d1dc994b15b668fd4038482eea8fafe69908'
const YANDEX_HOST = 'https://translate.yandex.net/api/v1.5/tr.json'
const HOST = '0.0.0.0'
const PORT = '5001'

export const supported_languages = {
    data: [
        {name: "Afrikaans", title: "af"},
        {name: "Albanian", title: "sq"},
        {name: "Amharic", title: "am"},
        {name: "Arabic", title: "ar"},
        {name: "Armenian", title: "hy"},
        {name: "Azerbaijani", title: "az"},
        {name: "Bashkir", title: "ba"},
        {name: "Basque", title: "eu"},
        {name: "Belarusian", title: "be"},
        {name: "Bengali", title: "bn"},
        {name: "Bosnian", title: "bs"},
        {name: "Bulgarian", title: "bg"},
        {name: "Burmese", title: "my"},
        {name: "Catalan", title: "ca"},
        {name: "Cebuano", title: "ceb"},
        {name: "Chinese", title: "zh"},
        {name: "Chuvash", title: "cv"},
        {name: "Croatian", title: "hr"},
        {name: "Czech", title: "cs"},
        {name: "Danish", title: "da"},
        {name: "Dutch", title: "nl"},
        {name: "English", title: "en"},
        {name: "Esperanto", title: "eo"},
        {name: "Estonian", title: "et"},
        {name: "Finnish", title: "fi"},
        {name: "French", title: "fr"},
        {name: "Galician", title: "gl"},
        {name: "Georgian", title: "ka"},
        {name: "German", title: "de"},
        {name: "Greek", title: "el"},
        {name: "Gujarati", title: "gu"},
        {name: "Haitian", title: "ht"},
        {name: "Hebrew", title: "he"},
        {name: "Hill Mari", title: "mrj"},
        {name: "Hindi", title: "hi"},
        {name: "Hungarian", title: "hu"},
        {name: "Icelandic", title: "is"},
        {name: "Indonesian", title: "id"},
        {name: "Irish", title: "ga"},
        {name: "Italian", title: "it"},
        {name: "Japanese", title: "ja"},
        {name: "Javanese", title: "jv"},
        {name: "Kannada", title: "kn"},
        {name: "Kazakh", title: "kk"},
        {name: "Khmer", title: "km"},
        {name: "Korean", title: "ko"},
        {name: "Kyrgyz", title: "ky"},
        {name: "Lao", title: "lo"},
        {name: "Latin", title: "la"},
        {name: "Latvian", title: "lv"},
        {name: "Lithuanian", title: "lt"},
        {name: "Luxembourgish", title: "lb"},
        {name: "Macedonian", title: "mk"},
        {name: "Malagasy", title: "mg"},
        {name: "Malay", title: "ms"},
        {name: "Malayalam", title: "ml"},
        {name: "Maltese", title: "mt"},
        {name: "Maori", title: "mi"},
        {name: "Mongolian", title: "mn"},
        {name: "Marathi", title: "mr"},
        {name: "Mari", title: "mhr"},
        {name: "Nepali", title: "ne"},
        {name: "Norwegian", title: "no"},
        {name: "Papiamento", title: "pap"},
        {name: "Persian", title: "fa"},
        {name: "Polish", title: "pl"},
        {name: "Portuguese", title: "pt"},
        {name: "Punjabi", title: "pa"},
        {name: "Romanian", title: "ro"},
        {name: "Russian", title: "ru"},
        {name: "Scottish Gaelic", title: "gd"},
        {name: "Sinhalese", title: "si"},
        {name: "Serbian", title: "sr"},
        {name: "Slovak", title: "sk"},
        {name: "Slovenian", title: "sl"},
        {name: "Spanish", title: "es"},
        {name: "Sundanese", title: "su"},
        {name: "Swahili", title: "sw"},
        {name: "Swedish", title: "sv"},
        {name: "Tagalog", title: "tl"},
        {name: "Tajik", title: "tg"},
        {name: "Tamil", title: "ta"},
        {name: "Telugu", title: "te"},
        {name: "Thai", title: "th"},
        {name: "Turkish", title: "tr"},
        {name: "Tatar", title: "tt"},
        {name: "Udmurt", title: "udm"},
        {name: "Ukrainian", title: "uk"},
        {name: "Urdu", title: "ur"},
        {name: "Uzbek", title: "uz"},
        {name: "Vietnamese", title: "vi"},
        {name: "Welsh", title: "cy"},
        {name: "Xhosa", title: "xh"},
        {name: "Yiddish", title: "yi"},
    ]
}
