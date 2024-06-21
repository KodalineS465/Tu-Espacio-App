import React, {useState, useContext, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuctionActive from "../../src/screens/auction/AuctionActive";
import AuctionLessorActive from "../../src/screens/auction/AuctionLessorActive";
import Explore from "../../src/screens/explore/Explore";
import Filter from "../../src/screens/filter/Filter";
import AccountAndTerms from "../../src/screens/login/AccountAndTerms";
import Login from "../../src/screens/login/Login";
import Registry from "../../src/screens/login/Registry";
import Message from "../../src/screens/message/Message";
import ChatBotAI from "../../src/screens/message/ChatBotAI";
import Profile from "../../src/screens/profile/Profile";
import Property from "../../src/screens/property/Property";
import CreateProperty from "../../src/screens/property/CreateProperty";
import Search from "../../src/screens/search/Search";
import PasswordReset from "../../src/screens/login/PasswordReset";
import PrivacyPolicy from "../../src/screens/termsAndConditions/PrivacyPolicy";
import {ActivityIndicator, View, Image} from "react-native";
import EditProperty from "../../src/screens/property/EditProperty";
import CreateButton from "../../src/components/CrateButton";
import PropertyDetail from "../../src/screens/property/PropertyDetail";
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import UserContext, {UserProvider} from "../../src/utils/UserProvider";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AuctionLessorFinished from "../../src/screens/auction/AuctionLessorFinished";
import AuctionLessorDetail from "../../src/screens/auction/AuctionLessorDetail";
import Chat from "../../src/screens/message/Chat";
import AuctionFinished from "../../src/screens/auction/AuctionFinished";
import MainHeader from "../../src/components/MainHeader";

const ExploreStack = createNativeStackNavigator()
function ExploreStackScreen() {
    return (
        <ExploreStack.Navigator>
            <ExploreStack.Screen
                name='Explore'
                component={Explore}
                options={{
                    header: () => <MainHeader />
                }}
            />
            <ExploreStack.Screen
                name='ExplorePropertyDetail'
                component={PropertyDetail}
                options={{
                    headerTitle: () => (
                        <Image
                            source={require('../../src/assets/logo.png')}
                            style={{ width: 50, height: 50 }} // ajusta el tamaño según tus necesidades
                        />
                    ),
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                }}
            />
        </ExploreStack.Navigator>
    )
}

const PropertyStack = createNativeStackNavigator()
function PropertyStackScreen({navigation}) {
    return (
        <PropertyStack.Navigator>
            <PropertyStack.Screen
                name='Property'
                component={Property}
                options={{
                    header: () => <CreateButton onPress={() => {navigation.push("CreateProperty")}}/>
                }}
            />
            <PropertyStack.Screen
                name='CreateProperty'
                component={CreateProperty}
            />
            <PropertyStack.Screen
                name='EditProperty'
                component={EditProperty}
            />
        </PropertyStack.Navigator>
    )
}

const SearchStack = createNativeStackNavigator()
function SearchStackScreen() {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name='Search'
                component={Search}
                options={{
                    header: () => <MainHeader />,
                }}
            />
            <SearchStack.Screen
                name='SearchPropertyDetail'
                component={PropertyDetail}
                options={{
                    headerTitle: () => (
                        <Image
                            source={require('../../src/assets/logo.png')}
                            style={{ width: 50, height: 50 }}
                        />
                    ),
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                }}
            />
        </SearchStack.Navigator>
    )
}

const MessageStack = createNativeStackNavigator()
function MessageStackScreen() {
    return (
        <>
            <MessageStack.Navigator>
                <MessageStack.Screen
                    name='Message'
                    component={Message}
                    options={{
                        header: () => <MainHeader />
                    }}
                />
                <MessageStack.Screen
                    name='Chat'
                    component={Chat}
                    options={{
                        headerTitle: () => (
                            <Image
                                source={require('../../src/assets/logo.png')}
                                style={{ width: 50, height: 50 }} // ajusta el tamaño según tus necesidades
                            />
                        ),
                        headerTitleAlign: 'center',
                        headerBackTitleVisible: false,
                    }}
                />
                <MessageStack.Screen
                    name='ChatBotAI'
                    component={ChatBotAI}
                    options={{
                        headerTitle: () => (
                            <Image
                                source={require('../../src/assets/logo.png')}
                                style={{ width: 50, height: 50 }} // ajusta el tamaño según tus necesidades
                            />
                        ),
                        headerTitleAlign: 'center',
                        headerBackTitleVisible: false,
                    }}
                />
            </MessageStack.Navigator>
        </>
    )
}

const ProfileStack = createNativeStackNavigator()
function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name='Profile'
                component={Profile}
                options={{
                    header: () => <MainHeader />
                }}
            />
        </ProfileStack.Navigator>
    )
}

const LoginStack = createNativeStackNavigator()
function LoginStackScreen() {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen
                name='Login'
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            <LoginStack.Screen
                name='Registry'
                component={Registry}
            />
            <LoginStack.Screen
                name='AccountAndTerms'
                component={AccountAndTerms}
            />
            <LoginStack.Screen
                name='PasswordReset'
                component={PasswordReset}
            />
        </LoginStack.Navigator>
    )
}



const AuctionLessorFinishedStack = createNativeStackNavigator()
function AuctionLessorFinishedStackScreen() {
    return (
        <AuctionLessorFinishedStack.Navigator>
            <AuctionLessorFinishedStack.Screen
                name='AuctionLessorFinished'
                component={AuctionLessorFinished}
                options={{
                    headerShown: false,
                }}
            />
            <AuctionLessorFinishedStack.Screen
                name='AuctionLessorDetail'
                component={AuctionLessorDetail}
                options={{
                    headerTitle: '',
                    headerBackTitleVisible: false,
                    headerShown: true,
                }}
            />
        </AuctionLessorFinishedStack.Navigator>
    )
}


const AuctionTopTab = createMaterialTopTabNavigator();

function AuctionTopTabs() {
    return (
        <AuctionTopTab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarIndicatorStyle: {
                    backgroundColor: '#0f1035'
                }
            })}
        >
            <AuctionTopTab.Screen
                name="AuctionTopTabActive"
                component={AuctionActive}
                options={{
                    tabBarLabel: "Activas"
                }}
            />
            <AuctionLessorTopTab.Screen
                name="AuctionTopTabFinished"
                component={AuctionFinished}
                options={{
                    tabBarLabel: "Terminadas"
                }}
            />
        </AuctionTopTab.Navigator>
    );
}

const AuctionLessorTopTab = createMaterialTopTabNavigator();

function AuctionLessorTopTabs() {
    return (
        <AuctionLessorTopTab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarIndicatorStyle: {
                    backgroundColor: '#0f1035'
                }
            })}
        >
            <AuctionLessorTopTab.Screen
                name="AuctionLessorTopTabActive"
                component={AuctionLessorActive}
                options={{
                    tabBarLabel: "Activas"
                }}
            />
            <AuctionLessorTopTab.Screen
                name="AuctionLessorTopTabFinished"
                component={AuctionLessorFinishedStackScreen}
                options={{
                    tabBarLabel: "Terminadas"
                }}
            />
        </AuctionLessorTopTab.Navigator>
    );
}

const Tab = createBottomTabNavigator()
function HomeTabs() {
    const {isLessor} = useContext(UserContext);
    return (
        <Tab.Navigator
            initialRouteName="ExploreTab"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: "#0f1035"
            }}
        >
            {isLessor? (
                <>
                    <Tab.Screen
                        name='PropertyTab'
                        component={PropertyStackScreen}
                        options={{
                            tabBarLabel:'',
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="business" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name='AuctionLessorTab'
                        component={AuctionLessorTopTabs}
                        options={{
                            header: () => <MainHeader />,
                            tabBarLabel:'',
                            headerShown: true,
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome5 name="gavel" size={size} color={color} />
                            ),

                        }}
                    />
                </>
            ) : (
                <>
                    <Tab.Screen
                        name='ExploreTab'
                        component={ExploreStackScreen}
                        options={{
                            tabBarLabel:'',
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="business" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name='SearchTab'
                        component={SearchStackScreen}
                        options={{
                            tabBarLabel:'',
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="map" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name='AuctionTab'
                        component={AuctionTopTabs}
                        options={{
                            header: () => <MainHeader />,
                            tabBarLabel:'',
                            headerShown: true,
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome5 name="gavel" size={size} color={color} />
                            ),

                        }}
                    />
                </>
            )}
            <Tab.Screen
                name='MessageTab'
                component={MessageStackScreen}
                options={{
                    tabBarLabel:'',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="message" size={size} color={color} />
                    ),

                }}
            />
            <Tab.Screen
                name='ProfileTab'
                component={ProfileStackScreen}
                options={{
                    tabBarLabel:'',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const RootStack = createNativeStackNavigator()
function RootNavigator(){
    const {user, setUser} = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    function AuthStateChanged(user) {
        user ? setUser(user) : setUser(null);
        setIsLoading(false);
    }

    useEffect(() => {
        let auth = require('@react-native-firebase/auth').default;
        const unsubscribeAuth = auth().onAuthStateChanged(AuthStateChanged);
        setIsLoading(false);
        return unsubscribeAuth;
    }, [user]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }
    return (
        <NavigationContainer>
            <RootStack.Navigator>
                {user ? (
                    <>
                        <RootStack.Screen
                            name='Home'
                            component={HomeTabs}
                            options={{
                                headerShown: false
                            }}
                        />
                        <RootStack.Screen
                            name='Filter'
                            component={Filter}
                        />
                    </>
                ) : (
                    <RootStack.Screen
                        name='LoginStack'
                        component={LoginStackScreen}
                        options={{
                            headerShown: false
                        }}
                    />
                )}
                <RootStack.Screen
                    name='PrivacyPolicy'
                    component={PrivacyPolicy}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    )
}
export default function Navigation() {
    return (
        <UserProvider>
            <RootNavigator/>
        </UserProvider>
    )
}