import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Customer } from './customer';

function ratingRange(c: AbstractControl): { [key: string]: boolean } | null {
  if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
    return { 'range': true }
  }
  return null
}

function emailMatcher(c:AbstractControl) : {[key:string] :boolean} | null {
  let emailController =c.get('email')
  let emailCofirmController =c.get('confirmEmail')

  if(emailCofirmController?.pristine || emailController?.pristine){
    return null
  }

  if(emailCofirmController?.value === emailController?.value){
    return {'match':true}
  }
  return null
}

function phoneMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const phone = c?.value?.toString().replace(/\D/g, ''); // remove all non-numeric characters
  if (phone && phone.length >= 11) {
    return null;
  } else {
    return { 'matchphone': true }; //<-- Error Object
  }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup = new FormGroup({})
  customer = new Customer()

  sendCatalog = new FormControl()
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],

      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required , Validators.email]],
      },{validator:emailMatcher}),

      phone: ['',phoneMatcher],
      rating: [null, ratingRange],
      notification: 'email',
      sendCatalog: false
    })

    this.customerForm.get('notification')?.valueChanges.subscribe((val)=> this.setNotification(val))
  }

  save(): void {
    console.log(this.customerForm.controls);
    console.log('Saved: ' + JSON.stringify(this.customerForm?.value));
  }

  setData(): void {
    this.customerForm.patchValue({
      firstName: 'yassin',
      lastName: 'mohamed',
      email: 'mohamed@gmail.com',
      sendCatalog: true,
    })
  }

  setNotification(notifyVie: string): void {
    let phone = this.customerForm.get('phone')
    if (notifyVie === 'text') {
      phone?.addValidators(Validators.required)
    } else {
      phone?.clearValidators()
    }
    phone?.updateValueAndValidity()
  }
}
