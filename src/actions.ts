// "use server"

// import { writeFile, unlink } from 'fs/promises';
// import { XmpData, PublishInitXmpData } from '@/type';
// import type { FormItems } from '@/app/(content)/upload/PhotoForm'
// import { exiftool, WriteTaskResult } from 'exiftool-vendored';
// import sharp from 'sharp';
// import { omit } from 'lodash';

// import { createExiv2Module } from 'exiv2-wasm';


// const saveUploadPhoto: (photo: File, uid: string, mirror: boolean) => Promise<Buffer> = async (photo, uid, mirror) => {
//     const fileName = `${uid}_${photo.name}`;
//     const photoBuffer = await photo.arrayBuffer();
//     let img = sharp(photoBuffer);
//     if (mirror) {
//         img = img.flop(); // Use flip instead of scaleX
//     }
//     const rst = await img.toBuffer();
//     // await writeFile(`./${fileName}`, mirroredBuffer);
//     return rst;
// }

// const writeXmpData: (path: string, xmpData: XmpData) => Promise<WriteTaskResult> = async (path, xmpData) => {
//     const prefixedXmpData = Object.fromEntries(
//         Object.entries(xmpData).map(([key, value]) => [`XMP:${key}`, value])
//     );
//     const outputPath = path.replace(/(\.[^.]+)$/, '_xmp$1');
//     return await exiftool.write(path, prefixedXmpData, {writeArgs: ['-o', outputPath]});
// }

