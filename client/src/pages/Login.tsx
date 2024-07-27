import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import { AuthContext } from '../providers/AuthProvider';

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!authContext) {
    return null; // Or render some error UI
  }

  const { login } = authContext;

  const handleLogin = async () => {
    setLoading(true);
    await login(username, password);
    setLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            value={username}
            onIonChange={e => setUsername(e.detail.value!)}
            type="text"
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            type="password"
            required
          />
        </IonItem>
        <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
        <IonLoading isOpen={loading} message={'Please wait...'} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
