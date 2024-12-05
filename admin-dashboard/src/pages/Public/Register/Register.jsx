import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRole] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);
    setErrorMessage('');

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setContactNo(event.target.value);
        break;
      case 'role':
        setRole(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    const data = { email, password, firstName, middleName, lastName, contactNo, role };
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await axios({
        method: 'post',
        url: 'http://localhost:3000/admin/register', 
        data,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      console.log(res);
      localStorage.setItem('accessToken', res.data.access_token);
      navigate('/');
      setStatus('idle');
      alert('Registration Successful!');
    } catch (e) {
      console.log(e);
      setStatus('idle');
      setErrorMessage(e.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Register">
      <div className="mains-container">
        <form>
          <div className="formed-container">
            <h1>Register</h1>
            {errorMessage && <span className="errors">{errorMessage}</span>}

            <div className="form-row">
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
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
                {debounceState && isFieldsDirty && !password && (
                  <span className="errors">*This field is required</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => handleOnChange(e, 'firstName')}
                />
                {debounceState && isFieldsDirty && !firstName && (
                  <span className="errors">*This field is required</span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Middle Name"
                  value={middleName}
                  onChange={(e) => handleOnChange(e, 'middleName')}
                />
                {debounceState && isFieldsDirty && !middleName && (
                  <span className="errors">*This field is required</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => handleOnChange(e, 'lastName')}
                />
                {debounceState && isFieldsDirty && !lastName && (
                  <span className="errors">*This field is required</span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={contactNo}
                  onChange={(e) => handleOnChange(e, 'contactNo')}
                />
                {debounceState && isFieldsDirty && !contactNo && (
                  <span className="errors">*This field is required</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <select value={role} onChange={(e) => handleOnChange(e, 'role')}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {isFieldsDirty && !role && <span className="errors">*This field is required</span>}
            </div>

            <div className="submit-containers">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={handleRegister}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>
            <div className="register-container">
              <p>
                Already have an account? <a href="/">Login here</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
