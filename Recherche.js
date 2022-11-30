import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Button, TextInput, FlatList, Text, SafeAreaView, Dimensions, Image, TouchableHighlight, ScrollView } from 'react-native'
import Icon from '@expo/vector-icons/FontAwesome';
import Animated, {
    Easing as OldEasing,
    // @ts-ignore
    EasingNode,
  } from 'react-native-reanimated';

  import { DrawerActions } from "react-navigation-drawer";
import DrawerNavigation from '../Navigation/DrawerNavigation';
import { collection, query, where, getDocs, doc} from '@firebase/firestore';
import { auth, db, dbstore } from '../firebase';


const Easing = EasingNode || OldEasing;
const { Value, timing } = Animated

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const myRef = React.createRef()


this.state = {
    data: []
    }

// const q = query(EventsRef, where("isPublic", "==", true));
// const EventsSnapshot = await getDocs(q);

class Recherche extends React.Component {



    


    constructor(props){
        super(props)

        this.state = {
            isFocused: false,
            keyword: ''
        }

        this._input_box_translate_x = new Value(width)
        this._back_button_opacity = new Value(0)
        this._content_translate_y = new Value(height)
        this._content_opacity = new Value(0)

    }

    _onFocus = () =>{
        this.setState({isFocused: true})

        const input_box_translate_x_config = {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }

        const back_button_opacity_config = {
            duration: 200,
            toValue: 1,
            easing: Easing.inOut(Easing.ease)
        }

        const content_translate_y_config = {
            duration: 1,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }

        const content_opacity_config = {
            duration: 200,
            toValue: 1,
            easing: Easing.inOut(Easing.ease)
        }



        timing(this._input_box_translate_x, input_box_translate_x_config).start()
        timing(this._back_button_opacity, back_button_opacity_config).start()
        timing(this._content_translate_y, content_translate_y_config).start()
        timing(this._content_opacity, content_opacity_config).start()


        myRef.current.focus()
    }

    _onBlur = () =>{
        this.setState({isFocused: false})

        const input_box_translate_x_config = {
            duration: 200,
            toValue: width,
            easing: Easing.inOut(Easing.ease)
        }

        const back_button_opacity_config = {
            duration: 50,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }

        const content_translate_y_config = {
            duration: 1,
            toValue: height,
            easing: Easing.inOut(Easing.ease)
        }

        const content_opacity_config = {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }



        timing(this._input_box_translate_x, input_box_translate_x_config).start()
        timing(this._back_button_opacity, back_button_opacity_config).start()
        timing(this._content_translate_y, content_translate_y_config).start()
        timing(this._content_opacity, content_opacity_config).start()


        myRef.current.blur();
    }

    events_list = () => {
        
        
        dbstore.collection("Events").get().then((snapshot) => {
            // snapshot.forEach((doc) => {
            //     console.log(doc.id, " => ", doc.data());
            // });
            this.setState(snapshot)
        })
    }

    componentDidMount() {
        events_list()
    }

    render() {
        return (
        <View style={{backgroundColor:"#302F34",height:"100%"}}>
            <SafeAreaView style={styles.header_safe_area}>
                <View style={styles.header}>
                    <View style={styles.header_inner}>
                        <TouchableHighlight
                            activeOpacity={1}
                            //underlayColor={"#ccd0d5"}
                            //onPress={this.props.navigation.openDrawer}
                            style={styles.search_icon_box}
                            onPress={this.events_list}
                        >
                        <Icon name="user" size={22} color="#ffffff"/>


                        </TouchableHighlight>
                        <View>
                            <Image
                            source={require('../assets/logo_vevent_long_petit.png')}
                            style={{width: 152, height: 40}}
                            />
                        </View>
                        <TouchableHighlight
                            activeOpacity={1}
                            //underlayColor={"#ccd0d5"}
                            onPress={this._onFocus}
                            style={styles.search_icon_box}
                        >
                        <Icon name="search" size={22} color="#ffffff"/>


                        </TouchableHighlight>
                        <Animated.View
                            style={[styles.input_box, {transform: [{translateX: this._input_box_translate_x}]}]}
                        >
                            <Animated.View style={{opacity: this._back_button_opacity}}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    //underlayColor={"#ccd0d5"}
                                    
                                    onPress={this._onBlur}
                                    style={styles.back_icon_box}
                                >
                                    <Icon name="chevron-left" size={22} color="#ffffff" />
                                </TouchableHighlight>
                            </Animated.View>
                                <TextInput
                                    ref={myRef}
                                    placeholder="Rechercher un événement"
                                    //clearButtonMode="always"
                                    placeholderTextColor={'#D6D6D6'}
                                    value={this.state.keyword}
                                    
                                    onChangeText={(value) => this.setState({keyword: value})}
                                    style={styles.input}
                                />
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'grey'}
                                    onPress={()=>this.setState({keyword: ''})}
                                    style={styles.clear_button}
                                >
                                {
                                    this.state.keyword === ''
                                    ?
                                        <Icon name="remove" size={15} color='grey' />
                                    :
                                        <Icon name="remove" size={15} color='white' />
                                }  

                                </TouchableHighlight>
                        </Animated.View>
                    </View>

                </View>
            </SafeAreaView>
            
            
                <SafeAreaView style={styles.content_safe_area}>
                    <View style={styles.content_inner}>
                        <View style={styles.separator} />
                        {
                            this.state.keyword === ''
                            ?
                            
                                <ScrollView>
                                    {this.state.data.map(item => (
                                        <View style={styles.style_event}>
                                            <Text key={item.id}>{item.id}</Text>
                                        </View>
                                    ))}
                                    
                                    
                                </ScrollView>
                            :
                                <ScrollView>
                                    <View style={styles.search_item}>
                                        <Icon style={styles.item_icon} name="search" size={16} color="#cccccc"/>
                                        <Text style={{color: "#cccccc"}}>Test resultat 1</Text>
                                    </View>
                                    <View style={styles.search_item}>
                                        <Icon style={styles.item_icon} name="search" size={16} color="#cccccc"/>
                                        <Text style={{color: "#cccccc"}}>Test resultat 2</Text>
                                    </View>
                                    <View style={styles.search_item}>
                                        <Icon style={styles.item_icon} name="search" size={16} color="#cccccc"/>
                                        <Text style={{color: "#cccccc"}}>Test resultat 3</Text>
                                    </View>
                                    <View style={styles.search_item}>
                                        <Icon style={styles.item_icon} name="search" size={16} color="#cccccc"/>
                                        <Text style={{color: "#cccccc"}}>Test resultat 4</Text>
                                    </View>
                                    <View style={styles.search_item}>
                                        <Icon style={styles.item_icon} name="search" size={16} color="#cccccc"/>
                                        <Text style={{color: "#cccccc"}}>Test resultat 5</Text>
                                    </View>
                                </ScrollView>
                        }
                    </View>
                </SafeAreaView>
           
        </View>

        )
    }
}

const styles = StyleSheet.create({
    header_safe_area: {
        zIndex: 1000
    },
    header: {
        height: 50,
        paddingHorizontal: 16,
        marginTop: 40
    },
    style_event: {
        backgroundColor:'#AB1F82',
        width: '60%',
        margin: 20
    },
    header_inner: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
    },
    search_icon_box: {
        width: 40,
        height: 40,
        borderRadius: 40,
        //backgroundColor: 'e4e6eb',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input_box: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top:0,
        left:0,
        backgroundColor: '#302F34',
        width: width - 32
    },
    back_icon_box: {
        width: 40,
        height: 40,
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: 'grey',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        paddingHorizontal: 16,
        fontSize: 15,
        color: 'white'

    },
    clear_button: {
        height: 40,
        backgroundColor: 'grey',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        paddingHorizontal: 16,
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center'

    },
    content: {
        width: width,
        height: height,
        //position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 999,
    },
    content_event: {
        width: width,
        height: height,
        position: 'absolute',
        marginTop: 90,
        zIndex: 999,
    },
    content_safe_area: {
        flex: 1,
        //backgroundColor: 'white',
        marginTop: 20
    },
    content_inner: {
        flex: 1,
        //paddingTop: 50,
        //backgroundColor: 'white'
    },
    separator: {
        marginTop: 5,
        height: 1,
        //backgroundColor: '#000000'
    },
    image_placeholder_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '-70%'
    },
    image_placeholder: {
        width: 150,
        height: 113,
        alignSelf: 'center'
    },
    image_placeholder_text: {
        textAlign: 'center',
        color: 'grey',
        marginTop: 5
    },
    search_item: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        
        marginLeft: 16
    },
    item_icon: {
        marginRight: 15
    }
})


export default Recherche