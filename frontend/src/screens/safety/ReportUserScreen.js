import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme, useLanguage } from '../../contexts/AppContext';
import { safetyService } from '../../services/safetyService';

const ReportUserScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { userId, userName } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [description, setDescription] = useState('');
  const [reportingOptions, setReportingOptions] = useState(null);

  // ALWAYS include COLORS constant
  const COLORS = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#0A0A0A',
    textSecondary: '#6B6B6B',
    textTertiary: '#9E9E9E',
    accent: '#FF6B35',
    border: '#E0E0E0',
    shadow: '#000000',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
  };

  useEffect(() => {
    loadReportingOptions();
  }, []);

  const loadReportingOptions = async () => {
    try {
      const response = await safetyService.getSafetyReportingOptions();
      if (response.success) {
        setReportingOptions(response.data);
      }
    } catch (error) {
      console.error('Failed to load reporting options:', error);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    if (description.trim().length < 10) {
      Alert.alert('Error', 'Description must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        reportedUserId: userId,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        description: description.trim(),
        severity: 'MEDIUM',
      };

      const response = await safetyService.createSafetyReport(reportData);
      
      if (response.success) {
        Alert.alert(
          'Report Submitted',
          'Thank you for your report. Our safety team will review it promptly.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to submit report');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${userName || 'this user'}? They will not be able to contact you.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await safetyService.blockUser({
                blockedUserId: userId,
                reason: 'PERSONAL_CHOICE',
                description: 'Blocked via report screen',
              });

              if (response.success) {
                Alert.alert('User Blocked', 'This user has been blocked successfully.');
                navigation.goBack();
              } else {
                Alert.alert('Error', response.error || 'Failed to block user');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to block user');
            }
          },
        },
      ]
    );
  };

  const reportCategories = [
    {
      id: 'INAPPROPRIATE_PHOTOS',
      title: 'Inappropriate Photos',
      description: 'Explicit, offensive, or inappropriate images',
      icon: '📷',
    },
    {
      id: 'HARASSMENT',
      title: 'Harassment',
      description: 'Unwanted messages, stalking, or persistent contact',
      icon: '⚠️',
    },
    {
      id: 'FAKE_PROFILE',
      title: 'Fake Profile',
      description: 'Using someone else\'s photos or false information',
      icon: '🎭',
    },
    {
      id: 'INAPPROPRIATE_BEHAVIOR',
      title: 'Inappropriate Behavior',
      description: 'Rude, offensive, or disrespectful conduct',
      icon: '🚫',
    },
    {
      id: 'SPAM',
      title: 'Spam',
      description: 'Promotional content or repetitive messages',
      icon: '📧',
    },
    {
      id: 'SCAM',
      title: 'Scam',
      description: 'Asking for money or suspicious financial requests',
      icon: '💰',
    },
    {
      id: 'VIOLENCE_THREATS',
      title: 'Threats or Violence',
      description: 'Threatening language or violent behavior',
      icon: '⚡',
    },
    {
      id: 'OTHER',
      title: 'Other',
      description: 'Something else that concerns you',
      icon: '❓',
    },
  ];

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Report User
            </Text>
            
            <View style={{ width: 50 }} />
          </View>

          {userName && (
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginTop: 8,
            }}>
              Reporting: {userName}
            </Text>
          )}
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Instructions */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
            }}>
              Help us keep BLONG safe. Your report will be reviewed by our safety team. 
              All reports are confidential and the user will not know who reported them.
            </Text>
          </View>

          {/* Category Selection */}
          <Text style={{
            fontSize: 16,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 16,
            letterSpacing: 0.5,
          }}>
            What happened?
          </Text>

          {reportCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={{
                backgroundColor: selectedCategory === category.id ? `${COLORS.accent}15` : COLORS.surface,
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.id ? COLORS.accent : COLORS.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>{category.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '300',
                    color: COLORS.text,
                    marginBottom: 4,
                  }}>
                    {category.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                  }}>
                    {category.description}
                  </Text>
                </View>
                {selectedCategory === category.id && (
                  <Text style={{ fontSize: 16, color: COLORS.accent }}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Description */}
          <Text style={{
            fontSize: 16,
            fontWeight: '300',
            color: COLORS.text,
            marginTop: 24,
            marginBottom: 16,
            letterSpacing: 0.5,
          }}>
            Tell us more (required)
          </Text>

          <TextInput
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              fontSize: 14,
              color: COLORS.text,
              textAlignVertical: 'top',
              minHeight: 120,
            }}
            placeholder="Please provide details about what happened. The more information you provide, the better we can help."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            maxLength={1000}
          />

          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'right',
            marginTop: 8,
            marginBottom: 32,
          }}>
            {description.length}/1000 characters
          </Text>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleSubmitReport}
            disabled={loading || !selectedCategory || !description.trim()}
            style={{
              backgroundColor: (!selectedCategory || !description.trim()) ? COLORS.border : COLORS.danger,
              borderRadius: 8,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.background,
            }}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBlockUser}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              paddingVertical: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
              marginBottom: 32,
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.textSecondary,
            }}>
              Block This User
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default ReportUserScreen;
