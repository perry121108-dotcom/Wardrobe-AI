import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

type Props = { onLogin: () => void };

const REQUEST_TIMEOUT_MS = 15000;

export function LoginScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchJson(path: string, init?: RequestInit) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      return { response, data };
    } finally {
      clearTimeout(timer);
    }
  }

  async function enterDemoMode() {
    await AsyncStorage.multiSet([
      ['access_token', 'demo_access_token'],
      ['refresh_token', 'demo_refresh_token'],
      ['wardrobe_demo_mode', 'true'],
    ]);
    onLogin();
  }

  async function handleSubmit() {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      Alert.alert('資料不足', '請輸入 Email 與密碼。');
      return;
    }

    if (password.length < 8) {
      Alert.alert('密碼太短', '密碼至少需要 8 碼。');
      return;
    }

    setLoading(true);

    try {
      const health = await fetchJson('/health/db', { method: 'GET' });
      if (!health.response.ok) {
        throw new Error('目前伺服器或資料庫尚未連線。');
      }

      if (mode === 'register') {
        const { response: registerResponse, data: registerData } = await fetchJson('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password }),
        });

        if (!registerResponse.ok && registerResponse.status !== 409) {
          Alert.alert(
            '註冊失敗',
            (registerData as { error?: string }).error ?? `HTTP ${registerResponse.status}`
          );
          return;
        }
      }

      const { response: loginResponse, data: loginData } = await fetchJson('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      if (!loginResponse.ok) {
        Alert.alert(
          '登入失敗',
          (loginData as { error?: string }).error ?? `HTTP ${loginResponse.status}`
        );
        return;
      }

      const tokens = loginData as {
        access_token: string;
        refresh_token: string;
      };

      await AsyncStorage.multiSet([
        ['access_token', tokens.access_token],
        ['refresh_token', tokens.refresh_token],
        ['wardrobe_demo_mode', 'false'],
      ]);

      onLogin();
    } catch (error: any) {
      Alert.alert(
        '連線失敗',
        `${error?.message || '無法連線到伺服器。'}\n\n你也可以先按「進入展示模式」直接查看 App 主畫面。`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <Text style={styles.appIcon}>WA</Text>
            <Text style={styles.appName}>Wardrobe AI</Text>
            <Text style={styles.appSub}>AI wardrobe assistant</Text>
          </View>

          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.modeTxt, mode === 'login' && styles.modeTxtActive]}>登入</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'register' && styles.modeBtnActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.modeTxt, mode === 'register' && styles.modeTxtActive]}>註冊</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.fieldLabel}>密碼{mode === 'register' ? '（至少 8 碼）' : ''}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="至少 8 碼"
              placeholderTextColor="#aaa"
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitTxt}>{mode === 'login' ? '登入' : '註冊並登入'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoBtn} onPress={enterDemoMode} disabled={loading}>
              <Text style={styles.demoTxt}>進入展示模式</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            {mode === 'login'
              ? '已有帳號可直接登入；展示模式可先進入 App 主畫面。'
              : '第一次使用可先建立帳號，也可以使用展示模式查看功能。'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 28, paddingTop: 42, flexGrow: 1 },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  appIcon: { fontSize: 42, fontWeight: '900', marginBottom: 8, color: '#222' },
  appName: { fontSize: 28, fontWeight: '900', color: '#1a1a1a' },
  appSub: { fontSize: 15, color: '#888', marginTop: 5 },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTxt: { fontSize: 16, fontWeight: '800', color: '#888' },
  modeTxtActive: { color: '#222' },
  form: { gap: 6, marginBottom: 20 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#dedede',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fafafa',
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#222',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitTxt: { color: '#fff', fontSize: 17, fontWeight: '900' },
  demoBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  demoTxt: { color: '#222', fontSize: 16, fontWeight: '900' },
  hint: { textAlign: 'center', fontSize: 14, color: '#999', marginTop: 8, lineHeight: 20 },
});
