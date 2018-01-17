import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../shared/project/project';
import { Space } from '../shared/space/space';
import { ProjectService } from '../shared/project/project.service';

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

  constructor(private projectService: ProjectService) {
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
  }

  onSpaceSelect(description) {
    alert(`You selected : ${description}`);
  }

}
