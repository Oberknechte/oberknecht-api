import { getUsersResolveType } from "../types/endpoints/_getUsers";
export declare function getUsers(sym: string, logins?: string | string[], ids?: string | string[], noautofilterids?: Boolean, customtoken?: string): Promise<getUsersResolveType>;
