import { IonButton, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, colorPalette, document, globe } from 'ionicons/icons';
import './Home.css';
import { useContext, useRef, useState } from 'react';
import { uploadFiles } from '../utils/uploadFiles';
import { AuthContext } from '../providers/AuthProvider';
import { useHistory } from 'react-router';
import ContentWall from '../components/ContentWall';

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!authContext) {
    return null; // Or render some error UI
  }

  if (authContext.authToken == null) {
    history.push('/login');
    return null;
  }

  const handleAddButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadButtonClick = async () => {

    const message = await uploadFiles(selectedFiles, authContext.authToken as string);
    console.log(message);
    if (message === 'Files uploaded successfully') {
      setSelectedFiles([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Aperture</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle className="ion-justify-content-center" size="large">Aperture</IonTitle>
          </IonToolbar>
        </IonHeader>

        <ContentWall />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {selectedFiles.length > 0 && (
          <IonList lines='none'>
            {selectedFiles.map((file, index) => (
              <IonItem key={index}>
                <IonLabel>{file.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        <div className="button-container">
          {selectedFiles.length > 0 && (
            <IonButton expand="block" onClick={handleUploadButtonClick}>
              Bestaetigen
            </IonButton>
          ) || (
              <IonButton expand="block" onClick={handleAddButtonClick}>
                Hinzufuegen
              </IonButton>
            )}

        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
