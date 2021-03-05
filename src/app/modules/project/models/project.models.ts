export interface Project {
  ID: number;
  ProjectNumber: number;
  ParentProjectID?: number;
  ParentProjectName: string;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate?: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface ProjectNavigation {
  Entity: Project[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface ProjectNavigationRootModel {
  StatusCode: number;
  Message: string;
  Entity: ProjectNavigation;
}

export interface ProjectDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: Project;
}
