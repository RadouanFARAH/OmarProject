import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ResponsableSettingsPageRoutingModule } from './responsable-settings-routing.module';

import { ResponsableSettingsPage } from './responsable-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponsableSettingsPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [ResponsableSettingsPage]
})
export class ResponsableSettingsPageModule {}
