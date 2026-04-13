import {type FormEvent, type ReactElement, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
// import {login} from '@/api/auth';
import {type RequestResult} from '@/controllers/request';
import {type EmptyObject} from '@/types';
import Input from '@/components/input';
import Button from '@/components/button';
import {useAppStore} from '@/state';

import classes from './login.module.scss';

const Login = (): ReactElement => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const setLoggedUser = useAppStore((s) => s.setLoggedUser);

  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // const result = await login({username, password});
    const result = await Promise.resolve<RequestResult<EmptyObject>>({ok: true, data: {}});

    if (!result.ok) {
      // Narrow result.error.type to handle each failure kind:
      // 'network' | 'timeout' | 'http' | 'parse' | 'unexpected_content_type'
    } else {
      setLoggedUser(username, 'admin');
      setUsername('');
      setPassword('');
      void navigate('/dashboard');
    }
  }, [setLoggedUser, navigate, username /* password */]);

  return (
    <div className={classes.login}>
      <form
        className={classes.form}
        acceptCharset="UTF-8"
        onSubmit={onSubmit}
      >
        <div className={classes.label}>Username</div>
        <Input
          className={classes.input}
          type="text"
          value={username}
          required
          onChange={setUsername}
          placeholder='Any credentials work'
        />
        <div className={classes.label}>Password</div>
        <Input
          className={classes.input}
          type="password"
          value={password}
          required
          onChange={setPassword}
        />
        <Button
          className={classes.submit}
          type="submit"
          isPrimary
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Login;
