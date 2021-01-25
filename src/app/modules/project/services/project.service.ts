import { ProjectRootModel } from "@accSwift-modules/accswift-shared/models/project.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import {
  ProjectDetailsModel,
  ProjectNavigationRootModel,
} from "../models/project.models";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getProjectDropDown(): Observable<ProjectRootModel> {
    return this.httpService.get(`${this.api_URL}project`);
  }

  getProjectList(body): Observable<ProjectNavigationRootModel> {
    return this.httpService.post(`${this.api_URL}Project/navigate`, body);
  }

  saveProject(body): Observable<any> {
    return this.httpService.post(`${this.api_URL}Project`, body);
  }

  updateProject(body, projectID): Observable<any> {
    return this.httpService.put(`${this.api_URL}Project`, body);
  }

  deleteProjectById(id): Observable<any> {
    return this.http.delete(`${this.api_URL}Project/ ${id}`);
  }

  getProjectDetails(id): Observable<ProjectDetailsModel> {
    return this.httpService.get(`${this.api_URL}Project/${id}`);
  }
}
