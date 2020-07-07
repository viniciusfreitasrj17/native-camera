import React, { createRef, useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const camRef = createRef<Camera>();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === "granted");
    })();
  });

  if (hasPermission === false) {
    return <Text> Acesso Negado! </Text>;
  }

  async function takePicture() {
    if (camRef.current) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        alert("Salvo com sucesso!");
      })
      .catch((error) => {
        console.log("err", error);
      });
  }

  return (
    <SafeAreaView style={styles.androidSaveArea}>
      <Camera style={{ flex: 1 }} type={type} ref={camRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#35aa99",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              width: 70,
              height: 50,
              position: "absolute",
              bottom: 20,
              left: 20,
            }}
            onPress={() => {
              setType((type: any) =>
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 13, color: "#fff" }}>
              Trocar
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          margin: 20,
          borderRadius: 10,
          height: 50,
        }}
        onPress={takePicture}
      >
        <FontAwesome name="camera" size={23} color="#fff" />
      </TouchableOpacity>

      {!!capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              margin: 20,
            }}
          >
            <View style={{ flexDirection: "row", margin: 10 }}>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => setOpen(false)}
              >
                <FontAwesome name="window-close" size={50} color="#f00" />
              </TouchableOpacity>

              <TouchableOpacity style={{ margin: 10 }} onPress={savePicture}>
                <FontAwesome name="upload" size={50} color="#121212" />
              </TouchableOpacity>
            </View>

            <Image
              style={{ width: "100%", height: 450, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  androidSaveArea: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
