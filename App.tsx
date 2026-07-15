import React from 'react';
import { Platform, Dimensions, View, ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider, useTheme } from './app/context/ThemeContext';
import { LanguageProvider, useLanguage } from './app/context/LanguageContext';
import { LibraryProvider } from './app/context/LibraryContext';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './app/screens/home';
import CreateScreen from './app/screens/create';
import LibraryScreen from './app/screens/library';
import AiManagerScreen from './app/screens/aimanager';
import ProfileScreen from './app/screens/profile';
import SkillDetailScreen from './app/skill/[id]';
import AuthScreen from './app/screens/auth';
import LegalScreen from './app/screens/legal';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors, scheme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const isVibrant = scheme === 'vibrant';

  // ── หน้าจอขนาดต่างๆ ──────────────────────────────────────────
  const screenW = Dimensions.get('window').width;
  const isSmall  = screenW < 375;   // iPhone SE / mini
  const isLarge  = screenW >= 428;  // iPhone Pro Max / Plus

  // ── ไอคอนและตัวหนังสือ ──────────────────────────────────────
  const iconSize  = isSmall ? 20 : isLarge ? 23 : 22;
  const labelSize = isSmall ? 9 : 10;

  // ── ความสูง tab bar รวม safe-area ──────────────────────────
  // iOS Home Indicator = insets.bottom (34px บน notch, 0 บน SE)
  // ต้องการพื้นที่ icon+label = ~42px + safe area
  const TAB_CONTENT_H = 50;  // icon + label + padding
  const tabBarHeight  = TAB_CONTENT_H + insets.bottom;

  // ── padding: แบ่งพื้นที่ content ให้ icon อยู่กลาง ──────────
  const paddingTop    = 8;
  const paddingBottom = insets.bottom > 0
    ? insets.bottom + 4   // มี Home Indicator → เพิ่ม 4px เพื่อให้ label ไม่ชนขอบ
    : 10;                 // ไม่มี Home Indicator (SE, Android)

  const tabBarStyle = {
    backgroundColor: isVibrant ? 'rgba(255,255,255,0.97)' : colors.background,
    borderTopWidth: isVibrant ? 0 : 1,
    borderTopColor: colors.borders,
    height: tabBarHeight,
    paddingTop,
    paddingBottom,
    // เงาเฉพาะ vibrant scheme
    ...(isVibrant && {
      shadowColor: '#9333EA',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 10,
    }),
  };

  return (
    <Tab.Navigator
      id={undefined as any}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      // แถบล่างแบบกำหนดเองทั้งหมด — คุม layout เอง ไม่ให้ react-navigation ตัด label
      tabBar={({ state, descriptors, navigation }) => {
        const activeName = state.routes[state.index]?.name;
        if (activeName === 'Skill' || activeName === 'Legal') return null;
        return (
          <View style={[tabBarStyle as any, { flexDirection: 'row' }]}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              if (options.tabBarButton) return null; // ซ่อน Skill/Legal
              const focused = state.index === index;
              const color = focused ? colors.primary : colors.text.tertiary;
              const label = (options.title ?? route.name) as string;
              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
              };
              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  onPress={onPress}
                  activeOpacity={0.7}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  {(options.tabBarIcon as any)?.({ focused, color, size: iconSize })}
                  <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={{
                      color,
                      fontSize: labelSize,
                      fontWeight: isVibrant ? '700' : '500',
                      marginTop: 3,
                      textAlign: 'center',
                      includeFontPadding: false,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    >
      <Tab.Screen
        name="Home" component={HomeScreen}
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'home' : 'home-outline'} size={iconSize} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create" component={CreateScreen}
        options={{
          title: t.tabs.create,
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={iconSize + 1} color={color} />,
        }}
      />
      <Tab.Screen
        name="Library" component={LibraryScreen}
        options={{
          title: t.tabs.library ?? 'Library',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'folder' : 'folder-outline'} size={iconSize} color={color} />,
        }}
      />
      <Tab.Screen
        name="AI" component={AiManagerScreen}
        options={{
          title: t.tabs.ai ?? 'AI',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'hardware-chip' : 'hardware-chip-outline'} size={iconSize} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile" component={ProfileScreen}
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'person' : 'person-outline'} size={iconSize} color={color} />,
        }}
      />
      <Tab.Screen
        name="Skill" component={SkillDetailScreen}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="Legal" component={LegalScreen}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  );
}

/** Auth gate: show login until signed in or skipped. */
function RootNavigator() {
  const { user, skipped, isHydrated } = useAuth();
  const { colors } = useTheme();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Image
          source={require('./assets/icon.png')}
          style={{ width: 88, height: 88, borderRadius: 24, marginBottom: 20 }}
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user && !skipped) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <LibraryProvider>
              <RootNavigator />
            </LibraryProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
