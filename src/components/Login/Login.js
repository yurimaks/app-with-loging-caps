import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../context/auth-context';
import Input
 from '../UI/Input';
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

  const emailInputref = useRef();
  const passwordInputref = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLoging(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputref.current.focus();
    } else if (!passwordIsValid) {
      passwordInputref.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input isValid={emailIsValid}
          id="email"
          label="Email"
          type="email"
          value={emailState.value}
          onChangeHandler={emailChangeHandler}
          onBlueHandler={validateEmailHandler}
          ref={emailInputref}
          />
        <Input isValid={passwordIsValid}
          id="password"
          label="Password"
          type="password"
          value={passwordState.value}
          onChangeHandler={passwordChangeHandler}
          onBlueHandler={validatePasswordHandler}
          ref={passwordInputref}
          />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
