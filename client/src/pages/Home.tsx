import { IonButton, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { add, colorPalette, document, globe } from 'ionicons/icons';
import './Home.css';
import { useRef, useState } from 'react';
import { uploadFiles } from '../utils/uploadFiles';

const Home: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleAddButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadButtonClick = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

    const message = await uploadFiles(selectedFiles, '', '');
    //setToastMessage(message);
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
