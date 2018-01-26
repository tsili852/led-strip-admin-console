import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Project } from '../shared/project/project';
import { Space } from '../shared/space/space';
import { ProjectService } from '../shared/project/project.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ColorPickerService } from 'narik-angular-color-picker';
import * as tinycolor from 'tinycolor2';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private _selectedProject;
  private initialSelectedProject;
  @Input()
  set selectedProject(selectedProject) {
    this._selectedProject = selectedProject;
    this.initialSelectedProject = JSON.stringify(selectedProject);
    this.fillSpaceListFromData();

    this.selectedSpace = this.spaceList[0];
    this.color = this.selectedSpace.colorRGB;
  }
  spaceList: Array<Space>;
  selectedSpace: Space;
  private color = `rgb(255,255,255)`;

  inputFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private cpService: ColorPickerService,
    private zone: NgZone
  ) {
    this.spaceList = new Array<Space>();
  }

  ngOnInit() {
    console.log(`Project: ${JSON.stringify(this.selectedProject)}`);
  }

  onReloadProject() {
    this.projectService.getOne(this._selectedProject.description)
      .subscribe(data => {
        this._selectedProject = data;
        this.fillSpaceListFromData();
      });
    // this._selectedProject = JSON.parse(this.initialSelectedProject);
  }

  onRefresh() {
    this.fillSpaceListFromData();
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

  }

  onSpaceSelect(index) {
    this.selectedSpace = this.spaceList[index];
    this.color = this.selectedSpace.colorRGB;
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
          description: 'New Batiment',
          ledIndex: '',
          colors: '',
          colorRGB: '',
          id: null,
          floor: []
        };
        this._selectedProject.buildings.push(newBuilding);
        this.selectedSpace = newBuilding;
        console.log(`New Building ${JSON.stringify(newBuilding)}`);
      } else if (room.level === 1) {
        this._selectedProject.buildings.forEach(building => {
          if (building.id === room.id) {
            const newFloor = {
              status: false,
              level: 2,
              description: 'New Etage',
              ledIndex: '',
              colors: '',
              colorRGB: '',
              id: null,
              appartments: []
            };
            building.floors.push(newFloor);
            this.selectedSpace = newFloor;
            console.log(`New Floor ${JSON.stringify(newFloor)}`);
          }
        });
      } else if (room.level === 2) {
        this._selectedProject.buildings.forEach(building => {
          building.floors.forEach(floor => {
            if (floor.id === room.id) {
              const newAppartment = {
                colors: '100,100,100',
                ledIndex: '0-1',
                status: false,
                level: 3,
                colorRGB: '',
                id: null,
                description: 'New Appartement'
              };
              floor.appartments.push(newAppartment);
              this.selectedSpace = newAppartment;
            }
          });
        });
      }

      this.projectService.updateProject(this._selectedProject)
        .subscribe(data => {
          this.onReloadProject();
        });
    }
  }

  onColorChange(color: string) {
    this.selectedSpace.colorRGB = color;
    const color2 = tinycolor(color);
    this.selectedSpace.colors = `${color2.toRgb().r},${color2.toRgb().g},${color2.toRgb().b}`;
  }

  onSaveProject() {
    this.projectService.updateProject(this._selectedProject)
      .subscribe(data => {
        this.snackBar.open('Project saved', 'Close', {
          duration: 2000
        });
        this.onReloadProject();
      });
  }

  onSaveSpaceDetails() {
    const colors = this.selectedSpace.colors;
    if (this.selectedSpace.description) {
      this.projectService.saveSpaceDetails(this.selectedSpace)
        .subscribe(data => {
          this.snackBar.open('Space settings saved', 'Close', {
            duration: 2000
          });
          this.onReloadProject();
        },
          err => {
            alert('Error');
          });
      // TODO: Refetch data from server
    }
  }

  onDeleteSpace() {
    if (this.selectedSpace.level === 0) {
      alert('You can not delete the project');
    } else {
      if (confirm(`Are you sure you want to delete ${this.selectedSpace.description}`)) {
        this.projectService.deleteSpace(this.selectedSpace)
          .subscribe(datat => {
            this.snackBar.open('Space deleted', 'Close', {
              duration: 2000
            });
            this.onReloadProject();
            this.selectedSpace = this.spaceList[0];
          });
      }
    }
  }
}
