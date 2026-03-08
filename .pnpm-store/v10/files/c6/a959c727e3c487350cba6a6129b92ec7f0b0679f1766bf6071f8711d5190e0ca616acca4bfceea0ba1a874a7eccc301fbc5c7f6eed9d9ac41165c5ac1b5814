import { ReleaseType } from 'semver';
import { ReleaseGroupWithName } from './filter-release-groups';
export interface VersionPlanFile {
    absolutePath: string;
    relativePath: string;
    fileName: string;
    createdOnMs: number;
}
export interface RawVersionPlan extends VersionPlanFile {
    content: Record<string, string>;
    message: string;
}
export interface VersionPlan extends VersionPlanFile {
    message: string;
}
export interface GroupVersionPlan extends VersionPlan {
    groupVersionBump: ReleaseType;
}
export interface ProjectsVersionPlan extends VersionPlan {
    projectVersionBumps: Record<string, ReleaseType>;
}
export declare function readRawVersionPlans(): Promise<RawVersionPlan[]>;
export declare function setVersionPlansOnGroups(rawVersionPlans: RawVersionPlan[], releaseGroups: ReleaseGroupWithName[], allProjectNamesInWorkspace: string[]): ReleaseGroupWithName[];
export declare function getVersionPlansAbsolutePath(): string;
