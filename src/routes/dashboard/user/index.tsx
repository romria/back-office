import {useCallback, useEffect, useState, type ReactElement} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getUser} from '@/api/users';
import type {User} from '@/types/user';
import Button from '@/components/button';

import classes from './user.module.scss';

const DashboardUser = (): ReactElement => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  // State is tagged with the id it belongs to so values from a previous id are
  // automatically ignored during render — no render-phase or effect-phase reset needed.
  const [fetched, setFetched] = useState<{id: string; user: User} | null>(null);
  const [fetchError, setFetchError] = useState<{id: string; message: string} | null>(null);

  const user = fetched && fetched.id === id ? fetched.user : null;
  const error = fetchError && fetchError.id === id ? fetchError.message : null;

  useEffect(() => {
    if (user !== null || error !== null || id === undefined) return;
    void (async (): Promise<void> => {
      const result = await getUser(id);
      if (result.ok) setFetched({id, user: result.data});
      else setFetchError({id, message: 'User not found.'});
    })();
  }, [id, user, error]);

  const onBack = useCallback((): void => {
    void navigate('/dashboard/users');
  }, [navigate]);

  return (
    <div className={classes.page}>
      <Button onClick={onBack} isPrimary>← Back to Users</Button>

      {error ? <p className={classes.error}>{error}</p> : user ? (
        <>
          <div className={classes.header}>
            <img
              className={classes.avatar}
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <div>
              <h1 className={classes.name}>{user.firstName} {user.lastName}</h1>
              <div className={classes.meta}>
                <span className={classes.username}>@{user.username}</span>
                <span className={classes.badge}>{user.role}</span>
              </div>
            </div>
          </div>

          <div className={classes.sections}>
            <section className={classes.section}>
              <h2 className={classes.sectionTitle}>Personal Info</h2>
              <div className={classes.grid}>
                <div className={classes.field}>
                  <span className={classes.label}>First Name</span>
                  <span className={classes.value}>{user.firstName}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>Last Name</span>
                  <span className={classes.value}>{user.lastName}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>Maiden Name</span>
                  <span className={classes.value}>{user.maidenName !== '' ? user.maidenName : '—'}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>Birth Date</span>
                  <span className={classes.value}>{user.birthDate}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>Age</span>
                  <span className={classes.value}>{user.age}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>Gender</span>
                  <span className={classes.value}>{user.gender}</span>
                </div>
              </div>
            </section>

            <section className={classes.section}>
              <h2 className={classes.sectionTitle}>Contact</h2>
              <div className={classes.grid}>
                <div className={classes.field}>
                  <span className={classes.label}>Email</span>
                  <span className={classes.value}>{user.email}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>Phone</span>
                  <span className={classes.value}>{user.phone}</span>
                </div>
                <div className={classes.field}>
                  <span className={classes.label}>IP Address</span>
                  <span className={classes.value}>{user.ip}</span>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : <p className={classes.loading}>Loading…</p>}

    </div>
  );
};

export default DashboardUser;
