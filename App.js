import { StyleSheet, Text, View, Image} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef} from 'react';
import Button from './src/Button';

export default function App() {
  const[hasCameraPermission,setHasCameraPermission] = useState(null);
  const[image, setImage] = useState(null);
  const[type, setType] = useState(Camera.Constants.Type.back);
  const[flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  
  useEffect(() => {
    (async() => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, [])

  const takePicture = async () => {
    if(cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  }
  const saveImage = async () => {
    if(image) {
      try{
        await MediaLibrary.createAssetAsync(image);
        alert('Picture save! :))')
        setImage(null);
      } catch(e) {
        console.log(e)
      }
    }
  }
  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      {!image ? 
      <Camera 
      style = {styles.camera}
      type = {type}
      flashMode = {flash}
      ref = {cameraRef}
       >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 40,
          paddingHorizontal: 10
        }}>
          <Button icon={'retweet'} onPress={()=>{
            setType(type === CameraType.back ? CameraType.front : CameraType.back)
          }}/>
          <Button icon={'flash'} 
           color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
           onPress={() =>{
            setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
          }}/>
        </View>
         <Text style= {styles.name}>John Patrick Lachama</Text>
       </Camera>
       :
       <Image source={{uri: image}} style={styles.camera}/>
      }
       <View>
        {image ? 
        <View style={{
          flexDirection: 'row',
          paddingHorizontal:50,
          justifyContent: 'space-between',

        }}>
          <Button title={"Re-take"} icon = "retweet" onPress={()=>setImage(null)} />
          <Button title={"Save"} icon="check" onPress={saveImage}/>
        </View>
        :
        <Button title={'Take a picture'} icon="camera" onPress={takePicture}/>
      }
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 32
  },
  camera: {
    flex: 8,
    borderRadius: 20,
  },
  name: {
    paddingBottom: 30,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: '#f1f1f1',
  },
});
