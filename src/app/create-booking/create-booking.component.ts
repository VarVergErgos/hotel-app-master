import { Component, OnInit } from '@angular/core';
import { Booking } from '../booking';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {

  constructor(
     private router: Router,
     private activatedRoute: ActivatedRoute,
     private bookingService:BookingService,
     private formbuilder : FormBuilder) { }

  booking: Booking = {
    id: 100,
    name: "Your Name",
    roomNumber: 100,
    startDate: new Date(),
    endDate: new Date()
  }

  bookingForm = this.formbuilder.group({
    id:['', Validators.required],
    name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    roomNumber: ['', Validators.required],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });

  ngOnInit(): void {   
    if(this.router.url != '/create'){
      var id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

      this.bookingService.getBookingById(id).subscribe((result) => {

        this.booking = result;

        this.bookingForm.setValue(
          {
            id: this.booking.id,
            roomNumber: this.booking.roomNumber,
            name: this.booking.name,
            startDate: this.booking.startDate,
            endDate : this.booking.endDate

          }
        );

      });   
    }    
  }

  isValidDateFields()
  {
    //  console.log('Sumitted to save: ', this.bookingForm.value);
    var begin : Date =  this.bookingForm.get('startDate')?.value;
    var end: Date = this.bookingForm.get('endDate')?.value;
    var validDate : boolean = false;

    if (begin > end || end < begin){
     validDate = false;
      //console.log('Beginn Datum und Enddatum sind ungültig : ' + begin + " " + end)
    }else{
     validDate = true;
      //console.log('Begin und Enddatum sind gültig : ' +begin + ' ' + end);
    }   
    return validDate;
  }

  invalBegin(control: FormControl){
    var begin : Date =  this.bookingForm.get('startDate')?.value;
    var end: Date = this.bookingForm.get('endDate')?.value;

    if (control.value != null && begin > end) {
      console.log("Datum Enddatum > Enddatum");
      return { invalBegin: true };

    }
    return null;
  }

  save(): void {
   

    this.booking.id = this.bookingForm.get('id')?.value;
    this.booking.name = this.bookingForm.get('name')?.value;
    this.booking.roomNumber = this.bookingForm.get('roomNumber')?.value;
    this.booking.startDate = this.bookingForm.get('startDate')?.value;
    this.booking.endDate = this.bookingForm.get('endDate')?.value;

    this.bookingService.addBooking(this.booking).subscribe();  
    this.router.navigate(['bookings']);
  }

  dateChanged(event: Event, isStart: boolean){
 

    var val = (event.target as HTMLInputElement).value;

    if(isStart){
      this.booking.startDate = new Date(val);
    } else {
      this.booking.endDate = new Date(val);
    }
  }
}
