import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RootStackParamList} from '../../App';
import {useAppDispatch} from '../store';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from '../slices/user';
import axios, {AxiosError} from 'axios';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const emailref = useRef<TextInput | null>(null);
  const passwordref = useRef<TextInput | null>(null);
  const nameref = useRef<TextInput | null>(null);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3105/login', {
        email,
        password,
      });
      console.log(response.data);
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, email, password]);

  const onChangeEmail = useCallback(text => {
    setemail(text);
  }, []);
  const onChangePassword = useCallback(text => {
    setpassword(text);
  }, []);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <KeyboardAwareScrollView>
      <View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            ref={emailref}
            placeholder="이메일을 입력해주세요 "
            onChangeText={onChangeEmail}
            style={styles.textInput}
            value={email}
            autoCapitalize="none"
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            onSubmitEditing={() => {
              nameref.current?.focus();
            }}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            ref={passwordref}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChangeText={onChangePassword}
            style={styles.textInput}
            // secureTextEntry
            autoCapitalize="none"
            importantForAutofill="yes"
            autoComplete="password"
            textContentType="password"
            onSubmitEditing={onSubmit}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.buttonzone}>
          <Pressable
            style={!email || !password ? styles.loginButton : [styles.loginButton, styles.loginButtonActive]}
            onPress={onSubmit}
            disabled={!email || !password}>
            <Text>로그인</Text>
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text style={styles.loginButtonText}>회원가입하기</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 25,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: '#5585E8',
  },
  loginButtonText: {
    color: '#C4C4C4',
  },
  buttonzone: {
    alignItems: 'center',
  },
});

export default SignIn;
