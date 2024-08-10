import React, { useState, useContext, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonLoading, IonText } from '@ionic/react';
import { AuthContext } from '../providers/AuthProvider';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Login: React.FC = () => {

  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const query = useQuery();

  if (!authContext) {
    return null; // Or render some error UI
  }

  /*if (authContext.authToken) {
    history.push('/upload');
  }*/

  const { login } = authContext;

  const handleLogin = async () => {
    setLoading(true);
    await login(username, password);
    setLoading(false);
    history.push('/upload');
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const u = query.get('u');
    const p = query.get('p');

    const funnel = async () => {
      setUsername(u as string);
      setPassword(p as string);
      setLoading(true);
      await login(u as string, p as string);
      setLoading(false);
      history.push('/upload');
    }

    if (u && p) {
      funnel();
    }
  });




  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle className="ion-justify-content-center" size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <IonLabel position="stacked">Benutzer</IonLabel>
          <IonInput
            value={username}
            onIonChange={e => setUsername(e.detail.value!)}
            type="text"
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Passwort</IonLabel>
          <IonInput
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            type="password"
            required
          />
        </IonItem>
        <IonButton className='ion-margin' expand="block" onClick={handleLogin}>Anmelden</IonButton>
        <IonLoading isOpen={loading} message={'Bitte warten...'} />
      </IonContent>
    </IonPage>
  );
};

export default Login;

