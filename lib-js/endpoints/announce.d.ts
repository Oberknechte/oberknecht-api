import { announcementColorsType } from "../types/endpoints/annoucement";
export declare function announce(sym: string, broadcasterID: string | undefined, message: string, color?: announcementColorsType /** @default color "primary" */, customToken?: string): Promise<void>;
