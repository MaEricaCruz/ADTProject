import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');

    await axios({
      method: 'post',
      url: '/admin/login',
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        navigate('/main/movies');
        setStatus('idle');
      })
      .catch((e) => {
        setError(e.response.data.message);
        console.log(e);
        setStatus('idle');
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-containers">
        <form>
          <div className="form-containers">
            <h1>Sign In</h1>
            {error && <span className="errors">{error}</span>}
            <div className="form-group">
              <input
                type="text"
                placeholder="Email"
                ref={emailRef}
                value={email}
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {debounceState && isFieldsDirty && !email && (
                <span className="errors">*This field is required</span>
              )}
            </div>
            <div className="form-group">
              <input
                type={isShowPassword ? 'text' : 'password'}
                placeholder="Password"
                ref={passwordRef}
                value={password}
                onChange={(e) => handleOnChange(e, 'password')}
              />
              {debounceState && isFieldsDirty && !password && (
                <span className="errors">*This field is required</span>
              )}
            </div>
            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>
            <div className="submit-container">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={handleLogin}
              >
                {status === 'idle' ? 'Login' : 'Loading...'}
              </button>
            </div>
            <div className="register-container">
              <p>
                New to CineADT? <a href="/register">  Register now</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
