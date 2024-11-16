export class FixXmpData {
    UsePanoramaViewer = 'true' as const;
    ProjectionType = 'equirectangular' as const;
    InitialViewHeadingDegrees: number = 0;
    CroppedAreaLeftPixels: number = 0;
    CroppedAreaTopPixels: number = 0;
}

export class XmpData extends FixXmpData {
    CaptureSoftware?: string;
    StitchingSoftware?: string;
    PoseHeadingDegrees: number = 0;
    PosePitchDegrees?: number;
    PoseRollDegrees?: number;
    InitialViewPitchDegrees?: number;
    InitialViewRollDegrees?: number;
    InitialHorizontalFOVDegrees?: number;
    InitialVerticalFOVDegrees?: number;
    FirstPhotoDate?: Date;
    LastPhotoDate?: Date;
    SourcePhotosCount?: number;
    ExposureLockUsed?: boolean;
    CroppedAreaImageWidthPixels: number = 0;
    CroppedAreaImageHeightPixels: number = 0;
    FullPanoWidthPixels: number = 0;
    FullPanoHeightPixels: number = 0;
    InitialCameraDolly?: number;
    Latitude: number = 0;
    Longitude: number = 0;
    CreateDate: string = new Date().toISOString();
    PlaceId: string = ''
}

export class PhotoCreate extends XmpData {
    mirror: boolean = false
}