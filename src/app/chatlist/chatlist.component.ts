import { Component, OnChanges, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";
import { FirebaseService } from "../service/firebase.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewChild } from '@angular/core';
import { NodemailerService } from "../service/nodemailer.service";

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css'],
  providers: [DatePipe]
})
export class ChatlistComponent implements OnInit {
  @ViewChild('ScrollMe') scrollMe: any;

  usernameList: any[];
  FromChatList: any[];
  ToChatList: any[];
  chatList: any[];
  message = "";
  sessionName = "";
  selectedUser = "Working";
  Date = new Date(Date.now());


  constructor(
    public firebase: FirebaseService,
    public routeData: ActivatedRoute,
    public router: Router,
    public datePipe: DatePipe,
    public http: NodemailerService
  ) { }

  ngOnInit(): void {

    this.firebase.getUserName().snapshotChanges().subscribe(list => {
      this.usernameList = [];
      list.forEach(data => {
        var x = data.payload.toJSON();
        x["$key"] = data.key;
        this.usernameList.push(x);
        console.log("usernameList working " + this.usernameList[0].user);
      });
      var fromUser = this.routeData.snapshot.queryParamMap.get('sessionname');
      this.usernameList = this.usernameList.filter(item => item.user !== fromUser);
    });
    this.routeData.queryParams.subscribe(x => {
      console.log(x);
    })
  }

  getSelectedUserName(toUserName) {

    //filtering the current user from the list
    var fromUser = this.routeData.snapshot.queryParamMap.get('sessionname');
    this.usernameList = this.usernameList.filter(item => item.user !== fromUser);

    for (let i = 0; i < this.usernameList.length; ++i) {
      console.log("usernameList " + this.usernameList[i].user);
    }
    this.selectedUser = toUserName;

    console.log("toUserName " + toUserName);


    var fromUser = this.routeData.snapshot.queryParamMap.get('sessionname');
    this.router.navigate([], {
      relativeTo: this.routeData,
      queryParams: {
        'sessionname': fromUser,
        'fromUser': fromUser,
        'toUser': toUserName,
      }
    });
    this.getChatForChatList(fromUser, toUserName);
    console.log("Today Date " + this.datePipe.transform(Date.now(), 'yyyy-MM-dd:THH:mm:ss.sssZ'));
    console.log("Date.now() " + Date.now());
    console.log("Date " + this.datePipe.transform(Date.now(), 'dd MMM,yyyy'));
    console.log("Time " + this.datePipe.transform(Date.now(), 'HH:mm a'));

  }


  messageSubmit() {
    console.log("Wokring " + this.message);

    var fromUser = this.routeData.snapshot.queryParamMap.get('fromUser');
    var toUser = this.routeData.snapshot.queryParamMap.get('toUser');
    var fromUser = this.routeData.snapshot.queryParamMap.get('sessionname');
    this.message = fromUser + "//\\" + this.message;
    var date = "" + this.datePipe.transform(Date.now(), 'dd MMM,yyyy')
    var time = "" + this.datePipe.transform(Date.now(), 'HH:mm a');
    this.firebase.addChat(
      this.constructFromUser(fromUser, toUser),
      this.constructToUser(fromUser, toUser),
      this.message, date, time)
    this.message = "";
    this.FromChatList = [];
    this.getChatForChatList(fromUser, toUser);
    this.CallNodeMailer();
  }

  getChatForChatList(fromUser: string, toUser: string) {
    this.firebase.getChatForFromUser(this.constructFromUser(fromUser, toUser)).snapshotChanges().subscribe(object => {
      this.chatList = [];
      object.forEach(data => {
        var fromUserChat = data.payload.toJSON();
        fromUserChat["&key"] = data.key;
        this.chatList.push(fromUserChat);
        this.chatList.sort();
        console.log("sort " + this.chatList[0]);
      });
    });
  }

  constructFromUser(fromUser: string, toUser: string) {
    var fromUsertoUser = "from" + fromUser + "to" + toUser;
    return fromUsertoUser;
  }

  constructToUser(fromUser: string, toUser: string) {
    var toUserfromUser = "from" + toUser + "to" + fromUser;
    return toUserfromUser;
  }

  CheckUser(msg: string) {
    var fromUser = this.routeData.snapshot.queryParamMap.get('sessionname');
    var getUser = msg.split("//\\");
    if (getUser[0] == fromUser) {
      return true;
    }
    else {
      return false;
    }
  }

  msgSpliter(msg: string) {
    var getUser = msg.split("//\\");
    var msgList = getUser[1].split(" ");
    var finalmsg = "";
    var returnMsg = "";
    for (let i = 0; i < msgList.length; i++) {
      finalmsg = finalmsg + msgList[i] + " ";
      if (finalmsg.length > 47) {
        var removeMsg = finalmsg.substring(0, finalmsg.length - msgList[i].length - 2)
        returnMsg = returnMsg + removeMsg + "\r\n";
        finalmsg = msgList[i] + " ";
      }
    }
    returnMsg = returnMsg + " " + finalmsg
    return returnMsg;
  }

  scrollToBottom() {
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
  }

  CallNodeMailer() {
    console.log("Called  Node Mailer");
    let mail = "";
    let otp = "1234"
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
