import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [],
    imports: [ CommonModule, MatToolbarModule, MatButtonModule ],
    exports: [ MatToolbarModule, MatButtonModule ],
    providers: [],
})
export class MaterialModule {}
