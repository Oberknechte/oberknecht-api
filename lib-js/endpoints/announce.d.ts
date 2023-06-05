import { announcementColorsType } from "../types/announcementColors";
export declare function announce(sym: string, broadcaster_id: string | undefined, message: string, color?: announcementColorsType /** @default color "primary" */, customtoken?: string): Promise<void>;
