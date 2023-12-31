import classes from './LoginPage.module.css';
// 아이콘 이름 입력해서 바로 사용
import { FaEyeSlash, FaEye } from 'react-icons/fa';
// 상태관리
import { useRef, useState } from 'react';
// 회원가입으로 이동하기
import { NavLink, useNavigate } from 'react-router-dom';
// Auth 컴포넌트 가져오기
import { AuthHeader, AuthInput } from 'common/authComponents/AuthComponents';

import { userLogin } from 'https/utils/AuthFunction';
import { useDispatch } from 'react-redux';
import { failAuthModalActions } from 'store/failAuthModalSlice';

const LoginPage: React.FC = () => {
  // 리덕스
  const dispatch = useDispatch();
  const openErrorModal = () => {
    dispatch(failAuthModalActions.toggle());
  };

  // 비밀번호 보기
  const [wantSee, setWantSee] = useState(false);
  // 이메일 입력
  const emailInputRef = useRef<HTMLInputElement>(null);
  // 비밀번호 입력
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const clickLoginHandle = async () => {
    // 느낌표 없으면 에러
    const email = emailInputRef.current!.value;
    // 이메일 형식이 잘못되거나 입력하지 않은 경우
    // 우선 나중에
    const password = passwordInputRef.current!.value;
    const data = {
      email: email,
      loginPassword: password,
    };
    userLogin(data)
      .then((r) => {
        navigate('/');
        window.location.reload();
      })
      .catch(
        (e) => {
          console.error(e);
          openErrorModal();
        },
        // 로그인 실패했기 때문에 모달
      );
  };

  // 이메일 확인
  // 이메일 형식을 확인하는 함수
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  // 이메일 input의 onChange 이벤트 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      setIsValidEmail(validateEmail(email));
    } else {
      setIsValidEmail(true);
    }
  };

  return (
    <div className={classes.container}>
      <AuthHeader>로그인</AuthHeader>
      <div>
        <AuthInput
          placeholder="이메일"
          ref={emailInputRef}
          onChange={handleEmailChange}
        ></AuthInput>
        {isValidEmail ? (
          <></>
        ) : (
          <p className={classes.notValidEmail}>이메일 형식이 올바르지 않습니다.</p>
        )}
      </div>
      <div style={{ marginBottom: 20 }}>
        <AuthInput
          placeholder="비밀번호"
          ref={passwordInputRef}
          type={wantSee ? undefined : 'password'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              clickLoginHandle();
            }
          }}
        ></AuthInput>
        <div
          className={classes.passwordIcon}
          onClick={() => {
            setWantSee(!wantSee);
          }}
        >
          {wantSee ? <FaEye size={24} color="black" /> : <FaEyeSlash size={24} color="black" />}
        </div>
      </div>
      <button onClick={clickLoginHandle} className={classes.loginBtn} type="button">
        로그인
      </button>
      <NavLink className={classes.navigator} to={'/signup'}>
        회원가입 하러 가기
      </NavLink>
    </div>
  );
};

export default LoginPage;
