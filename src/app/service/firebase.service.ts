import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList } from "@angular/fire/database";

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  rootPath : AngularFireList<any>
  date = new Date();

  constructor(
    public firebaseService : AngularFireDatabase
    ) 
    { 
      this.rootPath = firebaseService.list('Pesalamah/');
    }

    add(user : string , chat : string){
      this.rootPath.push({
          user : chat
      })
    }

    getUserName(){
      this.rootPath = this.firebaseService.list('Pesalamah/Usernames');
      return this.rootPath;
    }

    addusername(user : string , gmail:string){
      this.rootPath = this.firebaseService.list('Pesalamah/Usernames');
      this.rootPath.push({
        user : user,
        gmail : gmail
      })
    }

   /* addChat(fromUsertoUser : string , toUserfromUser : string , message : string){
      this.rootPath = this.firebaseService.list('Pesalamah/Chat/'+fromUsertoUser +'/');
      this.rootPath.push({
        fromUsertoUser : message,
        date : this.getdate(),
        time : this.getTime(),
        sortTime : Date.now().toString()
      });
    } */

    addChat(fromUsertoUser : string , toUserfromUser : string , message : string , date : string , time : string){
      this.rootPath = this.firebaseService.list('Pesalamah/Chat/'+fromUsertoUser +'/');
      this.rootPath.push({
        message : message,
        date : date,
        time : time
      });

      this.rootPath = this.firebaseService.list('Pesalamah/Chat/'+toUserfromUser +'/');
      this.rootPath.push({
        message : message,
        date : date,
        time : time
      });
    }

  getChat(){
      this.rootPath = this.firebaseService.list('Chat/');
      return this.rootPath ;
  }

  getChatForFromUser(fromUsertoUser : string){
        this.rootPath = this.firebaseService.list('Pesalamah/Chat/'+fromUsertoUser +'/');
        return this.rootPath;
  }

  getChatForToUser(toUserfromUser : string){
      this.rootPath = this.firebaseService.list('Pesalamah/Chat/'+toUserfromUser +'/');
      return this.rootPath;
  }

  getdate(){
    let date = this.date.toDateString();
    return date;
  }

  getTime(){
    var time =  this.date.toLocaleTimeString();
    let value = time.substring(0,4);
    let value1 = time.substring(time.length-2,time.length);
    let finaltime = value +" "+value1;
    return finaltime;
  }    
}

