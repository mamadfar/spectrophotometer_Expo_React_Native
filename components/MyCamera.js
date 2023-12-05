import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { LightSensor } from 'expo-sensors';

export default function MyCamera() {
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturedLight, setCapturedLight] = useState(null);

  const [{ illuminance }, setData] = useState({ illuminance: 0 });

  useEffect(() => {
    _toggle();
    console.log('Image URL: ', imageUri);

    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (this._subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    this._subscription = LightSensor.addListener(setData);
  };

  const _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setCapturedLight(illuminance);
      console.log(data.uri);
      setImageUri(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  return (
    <View style={[styles.container, styles.droidSafeArea]}>
      <Text>Light Sensor:</Text>
      <Text>
        Illuminance:{' '}
        {Platform.OS === 'android'
          ? `${illuminance} lx`
          : `Only available on Android`}
      </Text>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
          flashMode={
            flash
              ? Camera.Constants.FlashMode.torch
              : Camera.Constants.FlashMode.off
          }>
          <View>
            <TouchableOpacity onPress={() => setFlash(!flash)}>
              <FontAwesome name="flash" size={40} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>

      <Button title={'Take Picture'} onPress={takePicture} />
      {!imageUri && <Button title={'Gallery'} onPress={pickImage} />}
      {imageUri && (
        <>
          <Button
            title={'Remove current image'}
            onPress={() => setImageUri(null)}
          />
          <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
          <Text>{capturedLight}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
