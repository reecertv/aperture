import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { add, colorPalette, document, globe, playOutline } from 'ionicons/icons';
import './Home.css';
import '../styles/BottomButtons.css';
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
  const [presentAlert] = useIonAlert();

  if (!authContext) {
    return (404); // Or render some error UI
  }

  if (authContext.authToken == null) {
    console.log("AuthToken is null")
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
      <IonContent fullscreen>
        <IonText class="ion-margin ion-text-center">
          <h1 className='ion-margin'>Wir freuen uns, wenn ihr eure Erinnerungen mit uns teilt!</h1>
        </IonText>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle class="ion-text-center">Anleitung</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ul>
              <li>Auf "Hinzufügen" klicken</li>
              <li>Bilder auswählen</li>
              <li>Auswahl bestätigen</li>
            </ul>
          </IonCardContent>
        </IonCard>

        {selectedFiles.length > 0 && (

          <IonCard>
            <IonCardHeader>
              <IonCardTitle class="ion-text-center">Hochladen</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList lines="full">
                {selectedFiles.map((file, index) => (
                  <IonItem key={index}>
                    <IonLabel>{file.name}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <hr />
              <IonButton expand="block" onClick={handleUploadButtonClick}>
                Bestätigen
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <ContentWall />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className="button-container">
          {selectedFiles.length == 0 && (
            <>
              <IonButton className='flexible-item' expand="block" onClick={handleAddButtonClick}>
                Hinzufügen
              </IonButton>

              {/*<IonButton className='fixed-size-item' expand="block" onClick={() => {
                history.push('/explore?src=https://sample-videos.com/img/Sample-jpg-image-50kb.jpg');
              }}>
                <IonIcon icon={playOutline} />
              </IonButton>*/}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
