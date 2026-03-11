import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Registration {
    teamName: string;
    captainName: string;
    tournament: string;
    phoneNumber: string;
}
export interface backendInterface {
    getAllRegistrations(): Promise<Array<Registration>>;
    getAllRegistrationsByTournament(): Promise<Array<Registration>>;
    getMyRegistration(): Promise<Registration>;
    isRegistered(): Promise<boolean>;
    submitRegistration(teamName: string, captainName: string, phoneNumber: string, tournament: string): Promise<void>;
}
