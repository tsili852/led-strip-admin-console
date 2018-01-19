import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../shared/project/project';
import { Space } from '../shared/space/space';
import { ProjectService } from '../shared/project/project.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private _selectedProject;
  @Input()
  set selectedProject(selectedProject) {
    this._selectedProject = selectedProject;
    this.fillSpaceListFromData();
  }
  spaceList: Array<Space>;
  selectedSpace: Space;

  inputFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.spaceList = new Array<Space>();
  }

  ngOnInit() {
    console.log(`Project: ${JSON.stringify(this.selectedProject)}`);
  }

  fillSpaceListFromData() {
    this.spaceList = new Array<Space>();
    this.spaceList.push({
      description: this._selectedProject.description,
      level: 0,
      status: false,
      id: '',
      colors: '',
      ledIndex: '',
      colorRGB: `rgb(255,255,255)`
    });

    this._selectedProject.buildings.forEach(building => {
      this.spaceList.push(building);
      building.floors.forEach(floor => {
        this.spaceList.push(floor);
        floor.appartments.forEach(appartment => {
          const colorsArray = appartment.colors.split(',');
          const red: number = +colorsArray[0];
          const green: number = +colorsArray[1];
          const blue: number = +colorsArray[2];
          appartment.colorRGB = `rgb(${red},${green},${blue})`;
          this.spaceList.push(appartment);
        });
      });
    });

    this.selectedSpace = this.spaceList[0];
  }

  onSpaceSelect(index) {
    this.selectedSpace = this.spaceList[index];
  }

  onSaveSettings() {
    if (this._selectedProject.description && this._selectedProject.userPassword && this._selectedProject.adminPassword) {
      this.projectService.saveSettings(this._selectedProject)
      .subscribe(response => {
        this.snackBar.open('Project settings saved', 'Close', {
          duration: 2000
        });
      },
      err => {
        console.log(`Error: ${JSON.stringify(err)}`);
      });
    }
  }

  onAddSpace(index) {
    const room = this.spaceList[index];
    if (room) {
      // alert(`Add space bellow: ${room.description}`);
      if (room.level === 0) {
        const newBuilding = {
          status: false,
          level: 1,
          description: 'Batiment X',
          floor: []
        };
        this._selectedProject.buildings.push(newBuilding);
      } else if (room.level === 1) {
        this._selectedProject.buildings.forEach(building => {
          if (building.id === room.id) {
            const newFloor = {
              status: false,
              level: 2,
              description: 'Etage X',
              appartments: []
            };
            building.floors.push(newFloor);
          }
        });
      } else if (room.level === 2) {
        alert('Add Appartment');
      }
    }
  }
}
