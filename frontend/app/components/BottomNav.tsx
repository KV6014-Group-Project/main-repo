import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const hiddenRoutes = [
    '/',
    '/auth',
    '/auth/participant',
    '/auth/organiser-login',
    '/auth/promoter-login',
    '/auth/forgot-password',
    '/auth/organiser-signup',
    '/auth/promoter-signup'
  ];

  const shouldHide = hiddenRoutes.includes(pathname);

  // Don't render anything if on a hidden route
  if (shouldHide) return null;

  const tabs = [
    {
      name: 'Home',
      path: '/',
      icon: 'home',
      iconOutline: 'home-outline'
    },
    {
      name: 'Events',
      path: '/events',
      icon: 'calendar',
      iconOutline: 'calendar-outline'
    },
    {
      name: 'Profile',
      path:
        user?.role?.name === 'organiser'
          ? '/organiser/organiserdashboard'
          : user?.role?.name === 'promoter'
            ? '/promoter'
            : '/participant',
      icon: 'person',
      iconOutline: 'person-outline'
    }
  ] as const;

  if (user) {
    return (
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
        style={{ 
          height: 88,
          paddingBottom: 24,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <TouchableOpacity
              key={tab.path}
              className="flex-1 items-center justify-center"
              onPress={() => router.push(tab.path as any)}
            >
              <Ionicons 
                name={isActive ? tab.icon : tab.iconOutline} 
                size={24} 
                color={isActive ? '#28B900' : '#6B7280'} 
              />
              <Text 
                className={`text-xs mt-1 ${
                  isActive ? 'text-[#28B900] font-bold' : 'text-gray-500'
                }`}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  } else {
    return null; // Don't show nav if not logged in
  }
}