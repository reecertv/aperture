import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { AuthContext } from '../providers/AuthProvider';
import { getImageCount } from '../utils/getFileUrlByIndex';
import './ContentWall.css'
import ImageWithPlaceholder from './ImageWithPlaceholder';

const IMAGES_PER_LOAD = 20;

const ContentWall: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Or render some error UI
  }

  const token = authContext.authToken as string; // Replace with your actual token

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageCount, setImageCount] = useState<number>(0);
  //const [loadedImageCount, setLoadedImageCount] = useState<number>(0);

  const increaseImageCount = async () => {
    const svrImgCount = await getImageCount(); // Server Image Count

    console.log("image count: " + imageCount);
    console.log("server image count: " + svrImgCount)
    if (imageCount >= svrImgCount) {
      return;
    }

    const loadableImgCount = svrImgCount - imageCount;
    console.log("loadable images: " + loadableImgCount);

    if (loadableImgCount < IMAGES_PER_LOAD) {
      setImageCount(imageCount + loadableImgCount)
    } else {
      setImageCount(imageCount + IMAGES_PER_LOAD);
    }

    /*if (imageCount + 1 <= await getImageCount()) {
      setImageCount(imageCount + 1);
    }*/
  }

  const page = useRef(null);

  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    const fetchInitialImageCount = async () => {
      // Assuming you have a way to determine the number of images. You could use another endpoint for this.
      // For demonstration, let's assume there are 10 images.
      const imageCount = await getImageCount();
      if (imageCount > IMAGES_PER_LOAD) {
        setImageCount(IMAGES_PER_LOAD);
      } else {
        setImageCount(imageCount);
      }
    };

    fetchInitialImageCount();
  }, []);

  useEffect(() => {
    const fetchImageUrls = async () => {
      /*const urls = [];
      const serverImageCount = await getImageCount();
      for (let i = 0; i < imageCount; i++) {
        //const url = await getFileUrlByIndex(i, token);
        //urls.push("https://vps.thut.tech" + url);
        urls.push(`https://vps.thut.tech/uploads/${i}.jpeg`);
      }
      setImageUrls(urls);*/

      const urls = [];
      const serverImageCount = await getImageCount();

      console.log();
      for (let i = serverImageCount - 1; i > serverImageCount - imageCount - 1; i--) {
        //const url = await getFileUrlByIndex(i, token);
        //urls.push("https://vps.thut.tech" + url);
        urls.push(`https://vps.thut.tech/uploads/${i}.jpeg`);
      }
      setImageUrls(urls);
    };

    if (imageCount > 0) {
      fetchImageUrls();
    }
  }, [imageCount]);

  return (
    <>
      <div className='ion-margin'>
        <IonGrid class="ion-align-self-center">
          <IonRow class="ion-align-self-center ion-justify-content-evenly">
            {imageUrls.map((url, index) => (
              <IonCol size="6" size-md="4" size-lg="2" key={index}>
                <div className='img-container'>
                  <ImageWithPlaceholder src={url} alt='...' />
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonInfiniteScroll onIonInfinite={(ev) => {
          increaseImageCount();
          setTimeout(() => ev.target.complete(), 1000);
        }}>
          <IonInfiniteScrollContent loadingSpinner="bubbles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </div>
    </>

  );
};

export default ContentWall;