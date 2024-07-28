import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import { AuthContext } from '../providers/AuthProvider';
import { Redirect, useHistory, useLocation } from 'react-router';

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!authContext) {
    return null; // Or render some error UI
  }

  if (authContext.authToken) {
    history.push('/upload');
  }

  const { login } = authContext;

  const handleLogin = async () => {
    setLoading(true);
    await login(username, password);
    setLoading(false);
    //history.push('/upload');
  };

  const queryParams = new URLSearchParams(window.location.search);
  const paramU = queryParams.get('u');
  const paramP = queryParams.get('p');

  if (paramU != null && paramP != null) {
    login(paramU, paramP);
  }

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
            <IonTitle className="ion-justify-content-center" size="large">Aperture</IonTitle>
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
        <IonLoading isOpen={loading} message={'Please wait...'} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
