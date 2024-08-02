import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Button,
    Image,
    ScrollView,
    Alert,
    StatusBar,
    Text,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MMKVStorage from 'react-native-mmkv-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Gallery, { GalleryRef, RenderItemInfo } from 'react-native-awesome-gallery';
import RNFS from 'react-native-fs2';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from "react-native-fast-image";

const MMKV = new MMKVStorage.Loader().initialize();

const GalleryScreen = ({ navigation }) => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [fileUris, setFileUris] = useState<string[]>([]);
    const gallery = useRef<GalleryRef>(null);
    const { top, bottom } = useSafeAreaInsets();
    const [mounted, setMounted] = useState(false);
    const [infoVisible, setInfoVisible] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        if (isFocused) {
            const storedPhotos = MMKV.getString('photos');
            if (storedPhotos) {
                const parsedPhotos = JSON.parse(storedPhotos);
                // console.log('Stored Photos:', parsedPhotos); // Log the stored photos
                setPhotos(parsedPhotos);
                convertBase64ToFileUris(parsedPhotos).then(r => {
                    setMounted(true);
                });

            }
        }
    }, [isFocused]);

    const convertBase64ToFileUris = async (base64Photos: string[]) => {
        const uris = await Promise.all(base64Photos.map(async (base64, index) => {
            const path = `${RNFS.DocumentDirectoryPath}/photo_${index}.jpg`;
            await RNFS.writeFile(path, base64.split(',')[1], 'base64');
            // Verify file existence
            const exists = await RNFS.exists(path);
            if (exists) {
                console.log(`File exists: ${path}`);
            } else {
                console.log(`File does not exist: ${path}`);
            }
            return `file://${path}`;
        }));
        setFileUris(uris);
    };

    const savePhotos = async (newPhotos: string[]) => {
        MMKV.setString('photos', JSON.stringify(newPhotos));
        setPhotos(newPhotos);
        await convertBase64ToFileUris(newPhotos);
    };

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
            if (response.assets) {
                const newPhotos = response.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
                savePhotos([...photos, ...newPhotos]);
            }
        });
    };

    const handleTakePhoto = () => {
        launchCamera({ mediaType: 'photo', includeBase64: true }, (response) => {
            if (response.assets) {
                const newPhotos = response.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
                savePhotos([...photos, ...newPhotos]);
            }
        });
    };

    const onTap = () => {
        StatusBar.setHidden(infoVisible, 'slide');
        setInfoVisible(!infoVisible);
    };

    if(!mounted){
        return (<Text>Loading...</Text>);
    }

    return (
        <SafeAreaView style={styles.container}>
            {infoVisible && (
                <Animated.View
                    entering={mounted ? FadeInUp.duration(250) : undefined}
                    exiting={FadeOutUp.duration(250)}
                    style={[
                        styles.toolbar,
                        {
                            height: top + 60,
                            paddingTop: top,
                        },
                    ]}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>{photos.length} Photos</Text>
                    </View>
                </Animated.View>
            )}
            <View>
                <Gallery
                    ref={gallery}
                    data={fileUris.map((uri) => ({ uri }))}
                    keyExtractor={(item) => item.uri}
                    renderItem={({ item }) => (
                        <FastImage
                            source={{ uri: item.uri }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    )}
                    initialIndex={0}
                    numToRender={3}
                    doubleTapInterval={150}
                    onTap={onTap}
                    loop
                    onScaleEnd={(scale) => {
                        if (scale < 0.8) {
                            // goBack();
                        }
                    }}
                />
            </View>
            {infoVisible && (
                <Animated.View
                    entering={FadeInDown.duration(250)}
                    exiting={FadeOutDown.duration(250)}
                    style={[
                        styles.toolbar,
                        styles.bottomToolBar,
                        {
                            height: bottom + 100,
                            paddingBottom: bottom,
                        },
                    ]}
                >
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.textContainer} onPress={handleTakePhoto}>
                            <Text style={styles.buttonText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textContainer} onPress={handleChoosePhoto}>
                            <Text style={styles.buttonText}>Choose Photo</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    toolbar: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomToolBar: {
        bottom: 0,
    },
    headerText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default GalleryScreen;
