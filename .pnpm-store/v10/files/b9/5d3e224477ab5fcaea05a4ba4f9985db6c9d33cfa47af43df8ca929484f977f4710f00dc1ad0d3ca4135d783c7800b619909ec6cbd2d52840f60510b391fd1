import { CommandModule } from 'yargs';
import { OutputStyle, RunManyOptions } from '../yargs-utils/shared-options';
import { VersionData } from './utils/shared';
export interface NxReleaseArgs {
    groups?: string[];
    projects?: string[];
    dryRun?: boolean;
    verbose?: boolean;
}
interface GitCommitAndTagOptions {
    stageChanges?: boolean;
    gitCommit?: boolean;
    gitCommitMessage?: string;
    gitCommitArgs?: string;
    gitTag?: boolean;
    gitTagMessage?: string;
    gitTagArgs?: string;
}
export type VersionOptions = NxReleaseArgs & GitCommitAndTagOptions & VersionPlanArgs & FirstReleaseArgs & {
    specifier?: string;
    preid?: string;
    stageChanges?: boolean;
    generatorOptionsOverrides?: Record<string, unknown>;
};
export type ChangelogOptions = NxReleaseArgs & GitCommitAndTagOptions & VersionPlanArgs & FirstReleaseArgs & {
    version?: string | null;
    versionData?: VersionData;
    to?: string;
    from?: string;
    interactive?: string;
    gitRemote?: string;
    createRelease?: false | 'github';
};
export type PublishOptions = NxReleaseArgs & Partial<RunManyOptions> & {
    outputStyle?: OutputStyle;
} & FirstReleaseArgs & {
    registry?: string;
    tag?: string;
    otp?: number;
};
export type PlanOptions = NxReleaseArgs & {
    bump?: string;
    message?: string;
};
export type ReleaseOptions = NxReleaseArgs & FirstReleaseArgs & {
    yes?: boolean;
    skipPublish?: boolean;
};
export type VersionPlanArgs = {
    deleteVersionPlans?: boolean;
};
export type FirstReleaseArgs = {
    firstRelease?: boolean;
};
export declare const yargsReleaseCommand: CommandModule<Record<string, unknown>, NxReleaseArgs>;
export {};
