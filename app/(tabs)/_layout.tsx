import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.tabIconSelected,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Fontisto name="home" size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color }) => <AntDesign name="addfile" size={24} color={color} />,
                    headerTitleAlign: "left",
					headerStyle: styles.tabHeader,
					headerTitleStyle: styles.tabTitle,
					headerShadowVisible: false,
                    headerTitle: "Generate Share Code"
                }}
            />
            <Tabs.Screen
                name="receipts"
                options={{
                    title: 'Receipts',
                    tabBarIcon: ({ color }) => 
                        <Ionicons name="receipt-outline" size={24} color={color}/>
                        ,
                    headerTitleAlign: "left",
					headerStyle: styles.tabHeader,
					headerTitleStyle: styles.tabTitle,
					headerShadowVisible: false,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
	tabHeader: {
		height: 105,
	},
	tabTitle: {
		fontFamily: Typography.headline.fontFamily.bold,
		fontSize: Typography.headline.size.meduim
	}
})