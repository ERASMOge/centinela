import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { billing } from 'src/app/core/guards/billing.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ControlipsComponent } from './controlips/controlips.component';
import { RepetearComponent } from './repetear/repetear.component';
import { RepetearContactComponent } from './repetear-contact/repetear-contact.component';
import { SegmentsComponent } from './segments/segments.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'segments', canActivate:[billing], component: SegmentsComponent },
      { path: 'segments/:id', canActivate:[billing], component: SegmentsComponent },
      { path: 'controlips',canActivate:[billing], component: ControlipsComponent },
      { path: 'repeater', canActivate:[billing], component: RepetearComponent },
      { path: 'repeater/:id',canActivate:[billing], component: RepetearContactComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedRoutingModule { }
