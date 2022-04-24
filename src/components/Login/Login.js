import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (lastState, action) => {
  console.log('email');
  if (action.type === 'USER_INPUT') {
    return {value:action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return {value:lastState.value, isValid: lastState.value.includes('@') }
  }
  return {value:'', isValid: false }
}

const passwordReducer = (lastState, action) => {
  if (action.type === 'USER_INPUT') {
    return {value:action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return {value:lastState.value, isValid: lastState.value.trim().length > 6 }
  }
  return {value:'', isValid: false }
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispathEmail] = useReducer(emailReducer, {
    value:'',
    isValid: null
  });

  const [passwordState, dispathPassword] = useReducer(passwordReducer, {
    value:'',
    isValid: null
  });

  const { isValid:emailIsValid } = emailState;
  const { isValid:passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity');
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 2000);

    return () => {
      console.log("Cleanup")
      clearTimeout(identifier)
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    //setEnteredEmail(event.target.value);
    dispathEmail({
      type: 'USER_INPUT',
      val: event.target.value
    });

    setFormIsValid(
      event.target.value.includes('@') && passwordState.isValid
    )

  };

  const passwordChangeHandler = (event) => {
    //setEnteredPassword(event.target.value);

    dispathPassword({
      type: 'USER_INPUT',
      val: event.target.value
    });

    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    )
  };

  const validateEmailHandler = () => {
    //setEmailIsValid(emailState.value.includes('@'));
    dispathEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    //setPasswordIsValid(enteredPassword.trim().length > 6);
    dispathPassword({type:'INPUT_BLUR'})
  };

  var ctx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLoging(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
