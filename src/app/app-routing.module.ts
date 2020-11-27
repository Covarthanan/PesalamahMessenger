import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  {path : '',redirectTo :'/welcome' ,pathMatch : 'full'},
  {path : 'welcome' , component: WelcomeComponent},
  {path : 'chatlist',component:ChatlistComponent},
  {path : 'chatroom', component:ChatroomComponent},
  {path : "**",component:PagenotfoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  WelcomeComponent,
  ChatroomComponent,
  ChatlistComponent,
  PagenotfoundComponent
]