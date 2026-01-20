import type { UploadFile } from "antd";

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

// 正确定义 FormItems 类型（使用 type 而非 interface）
export type FormItems = Omit<EditablePublishInitXmpData, 'CreateDate'> & {
    fileList: UploadFile[];
    CreateDate: Date; // 重新定义为 Date 类型
};

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
