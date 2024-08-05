import React, { useState, useEffect, useContext } from 'react';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/react';
import { getFileByIndex } from '../utils/getFileByIndex';
import { AuthContext } from '../providers/AuthProvider';
import { getFileUrlByIndex, getImageCount } from '../utils/getFileUrlByIndex';
import './ContentWall.css'

const ContentWall: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Or render some error UI
  }

  const token = authContext.authToken as string; // Replace with your actual token

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageCount, setImageCount] = useState<number>(0);

  const increaseImageCount = async () => {
    if (imageCount + 1 <= await getImageCount()) {
      setImageCount(imageCount + 1);
    }
  }

  useEffect(() => {
    const fetchInitialImageCount = async () => {
      // Assuming you have a way to determine the number of images. You could use another endpoint for this.
      // For demonstration, let's assume there are 10 images.
      const imageCount = await getImageCount();
      if (imageCount > 10) {
        setImageCount(10);
      } else {
        setImageCount(imageCount);
      }
    };

    fetchInitialImageCount();
  }, []);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = [];
      for (let i = 0; i < imageCount; i++) {
        const url = await getFileUrlByIndex(i, token);
        urls.push("http://vps.thut.tech" + url);
      }
      setImageUrls(urls);
    };

    if (imageCount > 0) {
      fetchImageUrls();
    }
  }, [imageCount]);

  return (
    <div className='ion-margin'>
      <IonGrid class="ion-align-self-center">
        <IonRow class="ion-align-self-center ion-justify-content-evenly">
          {imageUrls.map((url, index) => (
            <IonCol size="6" size-md="4" size-lg="2" key={index}>
              <div className='img-container'>
                <img src={url} />
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
      <IonInfiniteScroll onIonInfinite={(ev) => {
        increaseImageCount();
        setTimeout(() => ev.target.complete(), 500);
      }}>
        <IonInfiniteScrollContent loadingText="Please wait..." loadingSpinner="bubbles"></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </div>
  );
};

export default ContentWall;