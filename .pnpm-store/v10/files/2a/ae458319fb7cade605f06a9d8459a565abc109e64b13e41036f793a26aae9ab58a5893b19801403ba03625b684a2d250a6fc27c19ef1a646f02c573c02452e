import { ProjectGraph } from '../../../config/project-graph';
import { NxReleaseConfig } from './config';
import { GroupVersionPlan, ProjectsVersionPlan } from './version-plans';
export type ReleaseGroupWithName = Omit<NxReleaseConfig['groups'][string], 'versionPlans'> & {
    name: string;
    versionPlans: (ProjectsVersionPlan | GroupVersionPlan)[] | false;
};
export declare function filterReleaseGroups(projectGraph: ProjectGraph, nxReleaseConfig: NxReleaseConfig, projectsFilter?: string[], groupsFilter?: string[]): {
    error: null | {
        title: string;
        bodyLines?: string[];
    };
    releaseGroups: ReleaseGroupWithName[];
    releaseGroupToFilteredProjects: Map<ReleaseGroupWithName, Set<string>>;
};
