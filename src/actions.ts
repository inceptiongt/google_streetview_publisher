"use server"

import { RcFile } from 'antd/es/upload';
import { writeFile } from 'fs/promises';
import {XmpData} from '@/app/upload/page';
import { exiftool } from 'exiftool-vendored';

const saveUploadPhoto: (photo:File, uid:string) => Promise<string> = async(photo, uid) => {
    try {
        if (photo) {
            const fileName = `${uid}_${photo.name}`;
            await writeFile(`./${fileName}`, Buffer.from(await photo.arrayBuffer()));
            return `./${fileName}`
        } else {
            throw new Error('No photo uploaded');
        }
    } catch (error) {
        console.error('Error in saveUploadPhoto:', error);
        throw error;
    }
}

const writeXmpData: (path: string, xmpData: XmpData) => Promise<void> = async(path, xmpData) => {
    try {
        const prefixedXmpData = Object.fromEntries(
            Object.entries(xmpData).map(([key, value]) => [`XMP:${key}`, value])
        );
        await exiftool.write(path, prefixedXmpData);
    } catch (error) {
        console.error('Error in writeXmpData:', error);
        throw error;
    }
}

const writeXmpHandler: (data: FormData) => Promise<string> = async(data) => {
    try {
        const photo = data.get('photo') as File;
        const uid = data.get('uid') as string;
        const path = await saveUploadPhoto(photo, uid);
        const xmpDataString = data.get('xmpData');
        if (typeof xmpDataString !== 'string') {
            throw new Error('xmpData is missing or invalid');
        }
        const xmpData = JSON.parse(xmpDataString) as XmpData;
        await writeXmpData(path, xmpData);

        const fs = require('fs').promises;
        const editedPhotoBuffer = await fs.readFile(path);
        return Buffer.from(editedPhotoBuffer).toString('base64');
    } catch (error) {
        console.error('Error in writeXmpHandler:', error);
        throw error;
    }
}

export { writeXmpHandler }
