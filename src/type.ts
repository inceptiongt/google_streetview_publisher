export interface FixedPublishInitXmpData {
    UsePanoramaViewer: 'true';
    ProjectionType: 'equirectangular';
    InitialViewHeadingDegrees: 0;
    CroppedAreaLeftPixels: 0;
    CroppedAreaTopPixels: 0;
    CroppedAreaImageWidthPixels: number;
    CroppedAreaImageHeightPixels: number;
}

export interface EditablePublishInitXmpData {
    FullPanoWidthPixels: number;
    FullPanoHeightPixels: number;
    Latitude: number;
    Longitude: number;
    PlaceId: string;
    PoseHeadingDegrees: number;
    CreateDate: string;
}

export interface FormItems extends EditablePublishInitXmpData {
    isMirror: boolean
}

export interface PublishInitXmpData extends FixedPublishInitXmpData, EditablePublishInitXmpData{

}

export interface XmpData extends PublishInitXmpData {
    CaptureSoftware?: string;
    StitchingSoftware?: string;
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
    InitialCameraDolly?: number;
}
