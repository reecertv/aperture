import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonModal, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/react';
import './ImageWithPlaceholder.css'
import ImageMagnifier from './ImageMaginfier';
import { closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  placeholder?: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({ src, alt, placeholder }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const page = useRef(null);
  const history = useHistory();

  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  /*
  <IonModal trigger={`open-modal-${src}`} canDismiss presentingElement={presentingElement!}>
        <IonHeader>
          <IonToolbar>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-no-padding">
          <div className="scroll-container">
            <img src={src} className="scroll-image" alt="Modal Content" />
          </div>
        </IonContent>
      </IonModal>
  */

  return (
    <div>
      <IonCard className='ion-no-margin'>
        <IonImg
          class='preview'
          id={`open-modal-${src}`}
          src={src}  onClick={() => {
            history.push(`/explore?src=${src}`);
          }} />
      </IonCard>
    </div>


  );
};

export default ImageWithPlaceholder;