import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios, {AxiosError} from 'axios';
import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../../App';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignUp({navigation}: SignInScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [name, setname] = useState('');
  const emailref = useRef<TextInput | null>(null);
  const passwordref = useRef<TextInput | null>(null);
  const nameref = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback(text => {
    setemail(text);
  }, []);
  const onChangename = useCallback(text => {
    setname(text);
  }, []);
  const onChangePassword = useCallback(text => {
    setpassword(text);
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(email)) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert('알림', '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.');
    }
    console.log(email, name, password);
    try {
      setLoading(true);
      const response = await axios.post('http://192.168.35.61:3105/user', {
        email,
        name,
        password,
      });
      setLoading(false);
      console.log(response.data);
      Alert.alert('알림', '회원가입 되었습니다.');
      navigation.navigate('SignIn');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
    }
  }, [loading, navigation, email, name, password]);
  const canGoNext = email && name && password;
  return (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          ref={emailref}
          placeholder="이메일을 입력해주세요 "
          onChangeText={onChangeEmail}
          style={styles.textInput}
          value={email}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={() => {
            nameref.current?.focus();
          }}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          ref={nameref}
          placeholder="이름을 입력해주세요"
          value={name}
          onChangeText={onChangename}
          style={styles.textInput}
          importantForAutofill="yes"
          autoCapitalize="none"
          textContentType="name"
          onSubmitEditing={() => {
            passwordref.current?.focus();
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
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          onSubmitEditing={onSubmit}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.buttonzone}>
        <Pressable
          style={canGoNext ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive) : styles.loginButton}
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>회원가입</Text>}
        </Pressable>
      </View>
    </View>
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

export default SignUp;
