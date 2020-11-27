import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { $ } from 'protractor';
import { FirebaseService } from "../service/firebase.service";
import { NodemailerService } from "../service/nodemailer.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  exportAs: 'ngForm',
  providers: [DatePipe]
})
export class WelcomeComponent implements OnInit {

  hideUsername = false;
  hidemailInput = false;
  hideOTP = false;
  alreadyAccount = false;
  hideExistingUsername = false;
  hideExistingMailInput = false;
  title = "Pesalamah?"
  username: string;
  usermail: string;
  OTP: string;
  existingUsername: string;
  existingUsermail: string;
  generatedOTP: string;
  existingUsernameList: any[];
  sendUsername: any[] = [];
  Date = new Date(Date.now());

  constructor(
    public router: Router,
    public firebase: FirebaseService,
    public datePipe: DatePipe,
    public http: NodemailerService
  ) { }

  ngOnInit(): void {
  }

  accept() {
    this.alreadyAccount = true;
    this.title = "Pesalamah?"
    this.hideUsername = true;
    this.hideExistingUsername = false;
    this.hideOTP = false;

  }
  reject() {
    this.title = "i hate you..!"
    this.hideUsername = false;
    this.hideExistingUsername = false;
    this.hideOTP = false;
    this.hidemailInput = false;
    this.hideExistingMailInput = false;
    this.alreadyAccount = false;
  }

  getUsername() {
    this.hideUsername = false;
    this.hidemailInput = true;
  }

  getGmail() {
    this.hidemailInput = false;
    console.log("usermail " + this.usermail);
    console.log("username " + this.username);
    this.generatedOTP = "" + this.datePipe.transform(Date.now(), 'ssSSS');
    this.firebase.addusername(this.username, this.usermail);
    this.CallNodeMailer(this.usermail, this.generatedOTP);
    this.hideOTP = true;
    this.alreadyAccount = false;
  }

  verifyOTP() {
    if (this.OTP === this.generatedOTP) {
      console.log("verifyOTP Working");
      this.sendUsernameToChatlist();
    } else {
      console.log("verifyOTP not Working");
    }
  }

  checkExistingUsername() {
    this.hideExistingUsername = true;
    this.hideUsername = false;
    this.hidemailInput = false;
    this.hideOTP = false;
  }

  getExistingUsername() {
    this.hideExistingUsername = false;
    this.hideExistingMailInput = true;
  }

  VerifyExistingUser() {
    
    this.firebase.getUserName().snapshotChanges().subscribe(list => {
      this.existingUsernameList = [];
      list.forEach(data => {
        var x = data.payload.toJSON();
        x["$key"] = data.key;
        this.existingUsernameList.push(x);
        console.log("usernameList working " + this.existingUsernameList[0].user);
      });

      for (let i = 0; i < this.existingUsernameList.length; ++i) {
        if (this.existingUsernameList[i].user == this.existingUsername && this.existingUsernameList[i].gmail == this.existingUsermail) {          
          this.router.navigate(['/chatlist'],
          { queryParams: { 'sessionname': this.existingUsername } });
        }
      }

    });
  }

  sendUsernameToChatlist() {
    console.log("Working");
    if (this.username.length > 0) {
      this.hideUsername = false;
      this.hidemailInput = true;
      // this.firebase.addusername(this.username);
      this.router.navigate(['/chatlist'],
        { queryParams: { 'sessionname': this.username } });
    }
  }

  CallNodeMailer(mail: string, otp: string) {
    console.log("Called  Node Mailer");
    console.log("ONE TIME PASSWORD " + otp);
    this.http.sendmail(mail, otp).subscribe(
      data => {
        let res: any = data;
        console.log("Mail has been sent in Angular");
      }, err => {
        console.log(err);
      }, () => {
        console.log("NodeMailer Completed.");
      }
    )
    console.log("Completed  Node Mailer");
  }
}
