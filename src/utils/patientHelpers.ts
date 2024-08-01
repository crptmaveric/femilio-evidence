import fs2 from 'react-native-fs2';
import { getDatabaseConnection } from '../database';
import { PatientValues } from '../types';

export const saveImage = async (photoPath: string): Promise<string | null> => {
    if (!photoPath) {
        return null;
    }

    try {
        const imageDirectory = `${fs2.DocumentDirectoryPath}/images`;
        const imageName = `${new Date().getTime()}_photo.jpg`;
        const newFilePath = `${imageDirectory}/${imageName}`;

        if (!await fs2.exists(imageDirectory)) {
            await fs2.mkdir(imageDirectory);
        }

        await fs2.copyFile(photoPath, newFilePath);

        return newFilePath;
    } catch (error) {
        console.error("Error saving image: ", error);
        return null;
    }
};

export const handleSavePatient = async (values: PatientValues, patientId?: string) => {
    const db = await getDatabaseConnection();
    const address = `${values.street}, ${values.city}, ${values.postalCode}, ${values.country}`;
    if (patientId) {
        await db.executeSql(
            'UPDATE Patients SET firstName = ?, lastName = ?, diagnosis = ?, address = ?, birthNumber = ?, photo = ?, doctorId = ? WHERE id = ?',
            [values.firstName, values.lastName, values.diagnosis, address, values.birthNumber, values.photo, values.doctorId, patientId]
        );
    } else {
        await db.executeSql(
            'INSERT INTO Patients (firstName, lastName, diagnosis, address, birthNumber, photo, doctorId) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [values.firstName, values.lastName, values.diagnosis, address, values.birthNumber, values.photo, values.doctorId]
        );
    }
};
