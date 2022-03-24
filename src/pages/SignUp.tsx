import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {RootStackParamList} from '../../App';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [name, setname] = useState('');
  const emailref = useRef<TextInput | null>(null);
  const passwordref = useRef<TextInput | null>(null);
  const nameref = useRef<TextInput | null>(null);
  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    Alert.alert('알림', '로그인 되었습니다.');
  }, [email, password]);

  const onChangeEmail = useCallback(text => {
    setemail(text);
  }, []);
  const onChangename = useCallback(text => {
    setname(text);
  }, []);
  const onChangePassword = useCallback(text => {
    setpassword(text);
  }, []);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

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
          secureTextEntry
          importantForAutofill="yes"
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
          secureTextEntry
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          onSubmitEditing={onSubmit}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.buttonzone}>
        <Pressable>
          <Text style={styles.loginButtonText}>회원가입하기</Text>
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

export default SignIn;
