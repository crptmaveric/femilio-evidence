import { getDatabaseConnection } from '../database';
import { PatientValues } from '../types';
import MMKVStorage from "react-native-mmkv-storage";

const MMKV = new MMKVStorage.Loader().initialize();

export const saveImage = async (photoPath: string): Promise<string | null> => {
    if (!photoPath) {
        console.log("Error: Photo path is null or empty.");
        return null;
    }

    try {
        // Assume photoPath is a base64 string
        const imageKey = `profileImage_${new Date().getTime()}`;
        MMKV.setString(imageKey, photoPath);
        console.log(`Saved image with key: ${imageKey}`);
        return imageKey;
    } catch (error) {
        console.error("Error saving image: ", error);
        return null;
    }
};

export const handleSavePatient = async (values: PatientValues, patientId?: string) => {
    try {
        const db = await getDatabaseConnection();
        const address = `${values.street}, ${values.city}, ${values.postalCode}, ${values.country}`;
        let photoBase64 = null;

        if(values.photo !== null) {
            // Retrieve the photo base64 string from MMKV
            photoBase64 = MMKV.getString(values.photo);
        }

        if (patientId) {
            await db.executeSql(
                'UPDATE Patients SET firstName = ?, lastName = ?, diagnosis = ?, address = ?, birthNumber = ?, photo = ?, doctorId = ? WHERE id = ?',
                [values.firstName, values.lastName, values.diagnosis, address, values.birthNumber, photoBase64, values.doctorId, patientId]
            );
        } else {
            await db.executeSql(
                'INSERT INTO Patients (firstName, lastName, diagnosis, address, birthNumber, photo, doctorId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [values.firstName, values.lastName, values.diagnosis, address, values.birthNumber, photoBase64, values.doctorId]
            );
        }

        console.log("Patient data saved successfully.");
    } catch (error) {
        console.error("Error saving patient data: ", error);
    }
};
