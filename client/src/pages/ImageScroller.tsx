import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper/modules';

import './ImageScroller.css';
import '../styles/BottomButtons.css';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css';

import '@ionic/react/css/ionic-swiper.css';
import { IonButton, IonContent, IonIcon, IonImg, IonPage } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { closeOutline, playOutline } from 'ionicons/icons';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ImageScroller: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const history = useHistory();

  const hasRun = useRef(false);
  const slides = [
    { id: 1, contentUrl: "Video 1" },
    // Add more slides as needed
  ];

  const query = useQuery();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const src = query.get('src');

    if (src) {
      setImageUrls([src]);
    }
  });

  return (
    <IonPage>
      <IonContent>

        <Swiper
          modules={[Pagination, Mousewheel]}
          direction={'vertical'}   // Enable vertical scrolling
          slidesPerView={1}        // Show one slide at a time
          spaceBetween={0}         // No space between slides
          mousewheel               // Allow mouse wheel control
          pagination={{ clickable: true }}  // Enable pagination
          className="img-swiper"
        >
          {imageUrls.map((src, index) => (
            <SwiperSlide>
              <div className="img-slide">
                <IonImg
                  src={src}
                  className="image-displayer"
                />
              </div>
            </SwiperSlide>
          ))}



          {/*
          <SwiperSlide>
            <div className="video-slide">
              <video
                src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4"
                className="video-player"
                autoPlay
                loop
                muted
              />
            </div>
          </SwiperSlide>
          */}

          {/* Add more SwiperSlides as needed */}
        </Swiper>

        <div className="button-container">
          <IonButton className='flexible-item' expand="block" onClick={() => {
            history.goBack();
          }}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ImageScroller;