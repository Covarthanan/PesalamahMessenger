import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NodemailerService {

  constructor(public http : HttpClient) { }

  sendmail(mail : string , otp : string){
    //https://pesalamahnodejs.herokuapp.com/sendmail
    //let url = "http://localhost:3000/sendmail";
    let url = "https://pesalamahnodejs.herokuapp.com/sendmail";
    let info = {
      mail : ""+mail,
      otp : ""+otp,
      subject : "Pesalamah!",
      name : "Covart"
    }
    return this.http.post(url,info);
  }

}
