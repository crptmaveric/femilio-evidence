import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MMKVStorage from 'react-native-mmkv-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Gallery, { GalleryRef } from 'react-native-awesome-gallery';
import RNFS from 'react-native-fs2';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from "react-native-fast-image";
import { GalleryScreenProps } from "../types";
import FeButton from "../components/FeButton";
import CustomHeader from "../components/CustomHeader";
import { appStyle } from "../theme/AppStyle";
import { Icon } from "react-native-elements";

const MMKV = new MMKVStorage.Loader().initialize();

const GalleryScreen = ({ navigation, route } : GalleryScreenProps) => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [fileUris, setFileUris] = useState<string[]>([]);
    const gallery = useRef<GalleryRef>(null);
    const { top, bottom } = useSafeAreaInsets();
    const [mounted, setMounted] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [empty, setEmpty] = useState(false);
    const [infoVisible, setInfoVisible] = useState(true);
    const isFocused = useIsFocused();
    const patientId = route.params.patientId;

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        if (isFocused) {
            const storedPhotos = MMKV.getString(`photos_${patientId}`);
            if (storedPhotos) {
                const parsedPhotos = JSON.parse(storedPhotos);
                setPhotos(parsedPhotos);
                convertBase64ToFileUris(parsedPhotos).then(() => {
                    setMounted(true);
                    setEmpty(false);
                });
            } else {
                setMounted(true);
                setEmpty(true);
            }
        }
    }, [isFocused, empty]);

    useEffect(() => {
        if (mounted && fileUris.length > 0 && gallery.current && typeof gallery.current.setIndex === 'function') {
            // Overenie, že galéria má prístupný aktuálny element
            if (gallery.current) {
                const index = fileUris.length - 1;
                if(index > 0) {
                    gallery.current.setIndex(index, true); // Scroll to the last photo
                }
            }
        } else {
            console.warn('Gallery reference is not ready or setIndex is not a function');
        }
    }, [fileUris, mounted]);


    const convertBase64ToFileUris = async (base64Photos: string[]) => {
        const uris = await Promise.all(base64Photos.map(async (base64) => {
            // Použite timestamp na vytvorenie unikátneho názvu súboru
            const path = `${RNFS.DocumentDirectoryPath}/photo_${patientId}_${Date.now()}.jpg`;
            await RNFS.writeFile(path, base64.split(',')[1], 'base64');
            return `file://${path}`;
        }));
        setFileUris(uris);
    };

    const savePhotos = async (newPhotos: string[]) => {
        MMKV.setString(`photos_${patientId}`, JSON.stringify(newPhotos));
        setPhotos(newPhotos);
        convertBase64ToFileUris(newPhotos).then(() => {
            if (gallery.current && typeof gallery.current.setIndex === 'function') {
                if(newPhotos.length > 1) {
                    gallery.current.setIndex(newPhotos.length - 1, true); // Scroll to the last photo
                }
            } else {
                console.warn('Gallery reference is not ready or setIndex is not a function');
            }
        });
    };

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
            if (response.assets) {
                const newPhotos = response.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
                savePhotos([...photos, ...newPhotos]).then(() => {
                    setEmpty(false);
                });
            }
        });
    };

    const handleTakePhoto = () => {
        launchCamera({ mediaType: 'photo', includeBase64: true , presentationStyle: "fullScreen"}, (response) => {
            if (response.assets) {
                const newPhotos = response.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
                savePhotos([...photos, ...newPhotos]).then(() => {
                    setEmpty(false);
                });
            }
        });
    };

    const handleDeletePhoto = () => {
        if (photos.length === 0) return;

        const photoToDelete = photos[photoIndex];
        const fileUriToDelete = fileUris[photoIndex];

        const newPhotos = photos.filter((_, index) => index !== photoIndex);
        savePhotos(newPhotos).then(() => {
            RNFS.unlink(fileUriToDelete.replace('file://', ''))
                .catch((error) => console.error('Error deleting file:', error));

            if (newPhotos.length === 0) {
                setEmpty(true);
            } else {
                setPhotoIndex(Math.min(photoIndex, newPhotos.length - 1)); // Update index properly
            }
        });
    };

    const onTap = () => {
        StatusBar.setHidden(infoVisible, 'slide');
        setInfoVisible(!infoVisible);
    };

    if (!mounted) {
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
                    <CustomHeader title={`${photoIndex + 1} of ${photos.length} Photos`} showBack={true} onCancel={() => navigation.goBack()} iconOnly={true} otherActions={[
                        { title: 'Delete photo', action: () => {handleDeletePhoto()} }
                    ]}/>
                </Animated.View>
            )}
            <View style={{ marginTop: '-17%' }}>
                <Gallery
                    ref={gallery}
                    style={{}}
                    data={fileUris.map((uri) => ({ uri }))}
                    keyExtractor={(item) => item.uri}
                    renderItem={({ item }) => (
                        <FastImage
                            source={{ uri: item.uri }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={'contain'}
                        />
                    )}
                    initialIndex={0}
                    doubleTapInterval={150}
                    onTap={onTap}
                    onScaleEnd={(scale) => {
                        if (scale < 0.8) {
                            // goBack();
                        }
                    }}
                    onIndexChange={(number) => {
                        setPhotoIndex(number);
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
                        <FeButton severity={"tertiary"} title={'Take photo'} onPress={handleTakePhoto}
                                  containerStyle={styles.textContainer}
                                  icon={<Icon type={'ionicon'} color={appStyle.colors.primary["400"]} iconStyle={{ marginRight: 4 }} name={'camera-outline'} />} />
                        <FeButton severity={"tertiary"} title={'Choose photo'} onPress={handleChoosePhoto}
                                  containerStyle={styles.textContainer}
                                  icon={<Icon type={'ionicon'} color={appStyle.colors.primary["400"]} iconStyle={{ marginRight: 4 }} name={'images-outline'} />} />
                    </View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        margin: 0,
    },
    toolbar: {
        position: 'absolute',
        width: '100%',
        backgroundColor: appStyle.colors.background.brand_2,
        zIndex: 1,
        flexDirection: 'row',
    },
    leftContainer: {
        marginLeft: 12,
        position: 'absolute',
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
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default GalleryScreen;
