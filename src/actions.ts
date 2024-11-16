"use server"

import { writeFile } from 'fs/promises';
import { XmpData, PhotoCreate } from '@/type';
import { exiftool, WriteTaskResult } from 'exiftool-vendored';
import sharp from 'sharp';
import { omit } from 'lodash';

const saveUploadPhoto: (photo: File, uid: string, mirror: boolean) => Promise<string> = async (photo, uid, mirror) => {
    const fileName = `${uid}_${photo.name}`;
    const photoBuffer = await photo.arrayBuffer();
    let img = sharp(photoBuffer);
    if (mirror) {
        img = img.flop(); // Use flip instead of scaleX
    }
    const mirroredBuffer = await img.toBuffer();
    await writeFile(`./${fileName}`, mirroredBuffer);
    return `./${fileName}`;
}

const writeXmpData: (path: string, xmpData: XmpData) => Promise<WriteTaskResult> = async (path, xmpData) => {
    const prefixedXmpData = Object.fromEntries(
        Object.entries(xmpData).map(([key, value]) => [`XMP:${key}`, value])
    );
    return await exiftool.write(path, prefixedXmpData);
}

export const writeXmpHandler: (data:FormData) => Promise<{ok: false,message: string}|{ok: true,data: {path: string}}> = async (data: FormData) => {
    const photo = data.get('photo') as File;
    const uid = data.get('uid') as string;
    const photoCreateDataString = data.get('photoCreateData') as string;
    if (!photo || !uid || !photoCreateDataString) {
        return {
            ok: false,
            message: 'Missing form data'
        }
    }
    const photoCreate = JSON.parse(photoCreateDataString) as PhotoCreate;
    const path = await saveUploadPhoto(photo, uid, photoCreate.mirror);
    const xmpData = omit(photoCreate, ['mirror']);
    const rst = await writeXmpData(path, xmpData);
    if (rst.warnings) {
        return {
            ok:false,
            message: rst.warnings.join(',')
        }
    }
    // const fs = require('fs').promises;
    // const editedPhotoBuffer = await fs.readFile(path);
    // return Buffer.from(editedPhotoBuffer).toString('base64');
    return {
        ok: true,
        data: {path}
    }
}