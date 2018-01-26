import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from './shared/project/project.service';
import { Project } from './shared/project/project';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NewProjectDialogComponent } from './new-project-dialog/new-project-dialog.component';

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
  newProjectName: string;

  constructor(private projectService: ProjectService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.allProjectsObs = this.projectService.getAllProjects();
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

  onAddProject() {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      data: { projectName: this.newProjectName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('You have to define a name', 'Close', {
          duration: 2000
        });
      } else {
        this.newProjectName = result;
        this.projectService.createProject(this.newProjectName)
          .subscribe(res => {
            this.snackBar.open(`Project ${this.newProjectName} created`, 'Close', {
              duration: 2000
            });
          },
          err => {
            console.log(`Error on project creation: ${JSON.stringify(err)}`);
          });
      }
    });
  }
}
