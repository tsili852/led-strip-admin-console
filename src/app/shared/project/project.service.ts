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

  createProject(projectName: string) {
    const newProject = {
      description: projectName,
      status: false,
      adminPassword: 'newProjectAdmin',
      userPassword: 'newProjectUser',
      ip: '',
      buildings: [{
        status: false,
        level: 1,
        description: 'Batiment A',
        floors: [
          {
            status: false,
            level: 2,
            description: 'Etage 1',
            appartments: [
              {
                colors: '0,255,0',
                ledIndex: '0-1',
                status: false,
                level: 3,
                description: 'Appartement 1'
              }
            ]
          }
        ]
      }]
    };

    return this.httpClient.post(`${Config.apiUrl}project`, newProject);
  }

  updateProject(project: any) {
    return this.httpClient.put(`${Config.apiUrl}project/${project.description}`, project);
  }

  saveSpaceDetails(space: any) {
    if (space.level === 3 && space.ledIndex) {
      return this.httpClient.put(`${Config.apiUrl}appartment/${space.id}`, space);
    } else if (space.level === 2) {
      return this.httpClient.put(`${Config.apiUrl}floor/${space.id}`, {
        description: space.description,
        id: space.id
      });
    } else if (space.level === 3) {
      return this.httpClient.put(`${Config.apiUrl}building/${space.id}`, {
        description: space.description,
        id: space.id
      });
    }
  }

  deleteSpace(space: any) {
    if (space.level === 3) {
      return this.httpClient.delete(`${Config.apiUrl}appartment/${space.id}`);
    } else if (space.level === 2) {
      return this.httpClient.delete(`${Config.apiUrl}floor/${space.id}`);
    } else if (space.level === 3) {
      return this.httpClient.delete(`${Config.apiUrl}building/${space.id}`);
    }
  }

}
