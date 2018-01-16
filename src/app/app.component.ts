import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Led strip';

  allProjectsObs: Observable<any>;
  selectedProjectObj: Observable<any>;
  selectedProject: {
    description: string,
    userPassword: string,
    adminPassword: string,
    ip: string,
    id: string
  };

  constructor(private projectService: ProjectService) {

  }

  ngOnInit() {
    this.allProjectsObs = this.projectService.getAllProjects();
    // this.projectService.getAllProjects()
    //   .subscribe(respose => {
    //       this.projectArray = respose;
    //       this.projectSimpleArray = new Array<{description: string, id: string}>();
    //       this.projectArray.forEach(project => {
    //         this.projectSimpleArray.push({
    //           description: project.description,
    //           id: project.id
    //         });
    //       });
    //   });
    this.selectedProject = {
      description: '',
      id: '',
      adminPassword: '',
      ip: '',
      userPassword: ''
    };
  }

  onProjectSelect(description: string) {
    this.selectedProjectObj = this.projectService.getOne(description);

    this.selectedProjectObj.subscribe(data => {
      this.selectedProject.description = data.description;
      this.selectedProject.ip = data.ip;
      this.selectedProject.adminPassword = data.adminPassword;
      this.selectedProject.userPassword = data.userPassword;
    });
  }
}
