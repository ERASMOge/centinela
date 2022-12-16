import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from "@angular/forms";
@Component({
  selector: 'app-nuevaimagen',
  templateUrl: './nuevaimagen.component.html',
  styleUrls: ['./nuevaimagen.component.css']
})
export class  NuevaimagenComponent implements OnInit {
  imageURL: string="";
  uploadForm: FormGroup ;

  constructor(public fb: FormBuilder) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    })
  }

  ngOnInit(): void { }


  // Image Preview
  showPreview(event:any) {
    let file = (event.target as HTMLInputElement).files![0];

  this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar')?.updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  // Submit Form
  submit() {
  }

}