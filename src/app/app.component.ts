import { Component, OnInit } from '@angular/core';
import { ProjectService } from './shared/project/project.service';
import { Project } from './shared/project/project';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  providers: [ProjectService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  allProjectsObs: Observable<any>;
  selectedProjectObj: Observable<any>;
  selectedProject;
  projectSubscription: Subscription;

  constructor(private projectService: ProjectService) {

  }

  ngOnInit() {
    this.allProjectsObs = this.projectService.getAllProjects();
    // this.selectedProject = {
    //   description: 'Select',
    //   adminPassword: '',
    //   id: '',
    //   ip: '',
    //   userPassword: ''
    // };
    this.allProjectsObs.subscribe(data => {
      this.selectedProjectObj = this.projectService.getOne(data[0].description);

      this.selectedProjectObj.subscribe(prj => {
        this.selectedProject = prj;
      });
    });
  }

  onProjectSelect(description: string) {
    this.selectedProjectObj = this.projectService.getOne(description);

    this.selectedProjectObj.subscribe(prj => {
      this.selectedProject = prj;
    });
  }
}
