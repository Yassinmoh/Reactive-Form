import { Component, OnInit } from '@angular/core';
import { FormControl , FormGroup ,FormBuilder, Validators, AbstractControl} from '@angular/forms';

import { Customer } from './customer';

function ratingRange(c:AbstractControl):{[key:string]:boolean }| null{
  if(c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)){
    return {'range':true}
  }
  return null
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup =new FormGroup({})
  customer =new Customer()

  sendCatalog=new FormControl()
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {

    this.customerForm = this.fb.group({
      firstName:['',[Validators.required, Validators.minLength(3)]],
      lastName:['',[Validators.required, Validators.maxLength(50)]],
      email:['',[Validators.required, Validators.email]],
      phone:'',
      rating:[null,ratingRange],
      notification:'email',
      sendCatalog:false
    })
  }

  save(): void {
    console.log(this.customerForm.controls);
    console.log('Saved: ' + JSON.stringify(this.customerForm?.value));
  }

  setData(): void{
    this.customerForm.patchValue({
      firstName:'yassin',
      lastName:'mohamed',
      email:'mohamed@gmail.com',
      sendCatalog:true,
    })
  }

  setNotification(notifyVie:string):void{
    let phone =this.customerForm.get('phone')
    if(notifyVie === 'text'){
      phone?.addValidators(Validators.required)
    }else{
      phone?.clearValidators()
    }
    phone?.updateValueAndValidity()
  }
}
