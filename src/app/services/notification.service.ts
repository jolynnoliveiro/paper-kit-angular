import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Notifications, NotificationList } from '../models/notifications';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public currentNotificationList: NotificationList;
  public notiCount = 0;
  refreshSubject: Subject<boolean>;
  refreshObservable: Observable<boolean>;

  constructor(private myHttp: HttpService) {    
    this.refreshSubject = new Subject();
    this.refreshObservable = this.refreshSubject.asObservable();
  }

  
  getNotification(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/api/getNotification';
      this.myHttp.postData(url, data)
      .subscribe((res: any) => {
        this.setNotificationList(res);
        resolve(res);

      }, (error) => {
        reject(error);

      })
    })
  }

  setNotificationList(notificationList: NotificationList) {
    this.currentNotificationList = notificationList;
    //this.notiCount = notificationList.notifications.length;
  }

}
