import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../config';

@Injectable()
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  getAllProjects(): Observable<any> {
    return this.httpClient.get(`${Config.apiUrl}project/getall`);
  }

  getOne(description: string) {
    return this.httpClient.get(`${Config.apiUrl}project/${description}`);
  }

  saveSettings(project: any) {
    return this.httpClient.put(`${Config.apiUrl}project/settings/${project.id}`, project);
  }

}
