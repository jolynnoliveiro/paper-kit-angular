import { Component, Injectable, Input, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NgbModal, NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split("-");
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { day: toInteger(dateParts[0]), month: null, year: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {
          year: null,
          month: toInteger(dateParts[0]),
          day: toInteger(dateParts[1]),
        };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {
          year: toInteger(dateParts[0]),
          month: toInteger(dateParts[1]),
          day: toInteger(dateParts[2]),
        };
      }
      /* return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10),
      }; */
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    //return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
    return date ? `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ""}-${isNumber(date.day) ? padNumber(date.day) : ""}` : null;
  }
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return "";
  }
}

@Component({
  selector: 'app-booking-order',
  templateUrl: './booking-order.component.html',
  styleUrls: ['./booking-order.component.css']
})
export class BookingOrderComponent implements OnInit {

  bookingDate: any[] = [];
  contentDate: string = '';
  contentStartTime: string = '';
  contentEndTime: string = '';
  dateSelection: any = [];
  timeSelection: any = [];
  selected_time: string = "";

  isTodayDate: boolean = false;

  selectedTimeArray: number = 0;
  endTimeArray: any = [];

  selectedFile: any;
  model1: string;

  errorMessage: string = "";

  constructor(public bookingService: BookingService, 
              public snackBar: MatSnackBar, 
              public router: Router,
              public accountService: AccountService,
              public modalService: NgbModal,
              private ngbCalendar: NgbCalendar,
              private config: NgbDatepickerConfig, 
              private dateAdapter: NgbDateAdapter<string>) {
                const current = new Date();
                config.minDate = { year: current.getFullYear(), month: 
                current.getMonth() + 1, day: current.getDate() };
                config.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() + 6 };
                config.outsideDays = 'hidden';

              }

  ngOnInit(): void {
    this.initDatePicker();
    this.initTimePicker();
  }

  getBookingDateTime() {
    var currentDate = new Date();
    var currentDateTime = currentDate.toISOString();

    var nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + 1);
    var nextDayDateTime = nextDay.toISOString();

    var next7Day = new Date();
    next7Day.setDate(currentDate.getDate() + 7);
    var next7DayDateTime = next7Day.toISOString();

    console.log(next7DayDateTime.substring(0, 10))

    const dateObj = Object.assign({});
    dateObj.startDate = nextDayDateTime.substring(0, 10);
    dateObj.endDate = next7DayDateTime.substring(0, 10);
    this.bookingService.getBookingDateTime(dateObj).then(
      (res) => {
        console.log(res);
        console.log(res, length);
        if (res.length > 0) {
        this.bookingDate = res;
        }

      }, rej => {
        this.snackBar.open(rej.error, '', {
          duration: 2000
        });
      }
    )
}

onConfirm() {
  if (this.contentStartTime == '') {
    this.errorMessage = '*Please choose your booking time';
    this.snackBar.open('Please choose your booking time', '', {
      duration: 2000
    });
    return;
  }


  const createBookingObj = Object.assign({});
  createBookingObj.userId = this.accountService.currentUser.id;
  createBookingObj.bookingDate = this.contentDate;
  createBookingObj.startTime = this.contentStartTime;
  createBookingObj.endTime = this.contentEndTime;
  this.bookingService.createBookingOrder(createBookingObj).then(
    (res) => {
      console.log(res);
      console.log(res, length);
      this.modalService.dismissAll();
      this.contentDate = '';
      this.selected_time = '';
      if (res.length > 0) {
        this.snackBar.open('Your booking is successfully created', '', {
          duration: 2000
        });
      }

    }, rej => {
      this.modalService.dismissAll();
      this.contentDate = '';
      this.selected_time = '';
      this.snackBar.open(rej.error, '', {
        duration: 2000
      });
    }
  )
}
onClose() {

  }
  
  onDateClickV2(x: any){
    console.log(x);

    this.contentStartTime = '';

    var myDate = new Date(x);

    this.isTodayDate = this.isToday(myDate);
    console.log(this.isTodayDate);

    this.contentDate = x;
    //M.Modal.getInstance($('#modal1')).open();

    this.initTimePicker();
  }

  initDatePicker() {
    let d = new Date ();
    this.dateSelection = [];

    for (let i = 0; i < 7; i++) {
      const ymd = this.getYMD(d);

      const blockedDate = ['2021-08-16', '2021-08-20'];

      if (!blockedDate.includes(ymd)) {
        this.dateSelection.push(ymd); //['2021-08-15', '2021-07-17', '2021-08-18];
      }
      d.setTime(d.getTime() + 86400000);
    }
  }

  getYMD(date: Date): string {
    const dt = date || new Date();
    return dt.getFullYear() + '-' + ('00' + (dt.getMonth() + 1)).substr(-2) + '-' + ('00' + dt.getDate()).substr(-2);
  }

  initTimePicker() {
    var x = 15; // minutes interval
    var times = []; // time array
    var start_time = 540; // start time
    var end_time = 1380; // end time

    var currentTimeHours = 0;
    var currentTimeMinutes = 0;

    var addedMinutes = 30; //booking time duration in minutes

    var d = new Date();
    if (this.isTodayDate) {
      currentTimeHours = d.getHours();
      currentTimeMinutes = d.getMinutes();
      start_time = ((d.getHours()) * 60);

      // if current time = 9:13
      // 9:00 + 45 = 9:45

      // if current time = 9:24
      // 9:00 +60 = 10:00

      // if current time = 9:43
      // 9:00 + 75 = 10:15

      if (currentTimeMinutes < 15) {
        start_time =  start_time + 45;

      } else {
        if (currentTimeMinutes < 30) {
          start_time = start_time + 60;

        } else {
          if (currentTimeMinutes < 45) {
            start_time = start_time + 75;

          } else {
            start_time = start_time + 90;
          }
        }
      }
    }

    //loop to increment the time and push results in array
    for (var i = 0; start_time <= end_time; i++) {
      var hh =  Math.floor(start_time / 60);  // getting hours of day in 0-24 format
      var mm = (start_time % 60);  // geting minutes 0-55 format

      var newHH = Math.floor((start_time + addedMinutes) / 60);
      var newMM = ((start_time + addedMinutes) % 60);

      times[i] = ("0" + (hh)).slice(-2) + ":" + ("0" + mm).slice(-2);
      this.endTimeArray[i] = ("0" + (newHH)).slice(-2) + ':' + ("0" + newMM).slice(-2);

      start_time = start_time + x;
    }
    //console.log(times);
    this.timeSelection = times;
  }

  onTimeChange(event: any) {
    const value = event.target.value;
    this.selected_time = value;

    this.selectedTimeArray = event.currentTarget.options.selectedIndex;

    this.contentStartTime = this.selected_time;
    this.contentEndTime = this.endTimeArray[this.selectedTimeArray];


    this.errorMessage = '';
    console.log(this.selected_time);
  }
 
  isToday(someDate: any) {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  }

  triggerModal(content) {
    
    this.contentStartTime = '';
    console.log(this.model1);
    
    var myDate = new Date(this.model1);

    this.isTodayDate = this.isToday(myDate);
    console.log(this.isTodayDate);

    this.contentDate = this.model1;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});

    this.initTimePicker();
  }
  
  selectToday() {
    this.model1 = this.dateAdapter.toModel(this.ngbCalendar.getToday());
  }

}
