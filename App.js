import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Camera } from 'expo-camera';
import MyCamera from './components/MyCamera';

export default function SpectroScanApp() {
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);

  useEffect(() => {
    const permisionFunction = async () => {
      // here is how you can get the camera permission
      const cameraPermission = await Camera.requestPermissionsAsync();

      setCameraPermission(cameraPermission.status === 'granted');

      const imagePermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log(imagePermission.status);

      setGalleryPermission(imagePermission.status === 'granted');

      if (
        imagePermission.status !== 'granted' &&
        cameraPermission.status !== 'granted'
      ) {
        alert('Permission for media access needed.');
      }
    };

    permisionFunction();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MyCamera />
    </View>
  );
}
