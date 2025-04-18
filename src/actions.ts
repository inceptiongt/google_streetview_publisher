"use server"

import { writeFile, unlink } from 'fs/promises';
import { XmpData, PublishInitXmpData } from '@/type';
import type { FormItems } from '@/app/(content)/upload/PhotoForm'
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
    const outputPath = path.replace(/(\.[^.]+)$/, '_xmp$1');
    return await exiftool.write(path, prefixedXmpData, {writeArgs: ['-o', outputPath]});
}

export const writeXmpHandler: (data: FormData) => Promise<{ ok: false, message: string } | { ok: true, data: { path: string } }> = async (data: FormData) => {
    const photo = data.get('photo') as File;
    const uid = data.get('uid') as string;
    const photoCreateDataString = data.get('photoCreateData') as string;
    if (!photo || !uid || !photoCreateDataString) {
        return {
            ok: false,
            message: 'Missing form data'
        }
    }
    const FormItems = JSON.parse(photoCreateDataString) as FormItems;
    const path = await saveUploadPhoto(photo, uid, FormItems.isMirror);
    const xmpData: PublishInitXmpData = {
        ...omit(FormItems, ['isMirror']),
        UsePanoramaViewer: 'true',
        ProjectionType: 'equirectangular',
        InitialViewHeadingDegrees: 0,
        CroppedAreaLeftPixels: 0,
        CroppedAreaTopPixels: 0,
        CroppedAreaImageHeightPixels: FormItems.FullPanoHeightPixels,
        CroppedAreaImageWidthPixels: FormItems.FullPanoWidthPixels
    };
    const rst = await writeXmpData(path, xmpData);
    if (rst.warnings) {
        await unlink(path);
        return {
            ok: false,
            message: rst.warnings.join(',')
        }
    }
    const outputPath = path.replace(/(\.[^.]+)$/, '_xmp$1');
    await unlink(path);
    return {
        ok: true,
        data: { path: outputPath }
    }
}