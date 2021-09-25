import { StudentsService } from './../services/students.service';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { SelectEvent } from "@progress/kendo-angular-upload";
import { request } from 'graphql-request';
import { FormGroup, FormControl} from "@angular/forms";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { PopupService, PopupRef } from "@progress/kendo-angular-popup";
import { NotificationService } from '@progress/kendo-angular-notification';
import * as SC from 'socketcluster-client';

let socket = SC.create({
  hostname: 'localhost',
  port: 8000,
});

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild("templates", { read: TemplateRef })
  notificationTemplate?: TemplateRef<any>;
  students: any=[{}];
  uploadVisible: boolean = false;
  uploadButtonShow: boolean = false;
  file: any;
  addStudVisible: boolean = false;
  editedRowIndex: number = 0;
  editRow: any;
  deleteVisible: boolean = true;
  value: Date = new Date();
  popupRef?: PopupRef;
  

  gridView: GridDataResult = {data: [{}], total: this.students.length}
  pageSize: number = 5;
  skip: number = 0;

  form: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    grade: new FormControl(),
    division: new FormControl(),
    dob: new FormControl()
  });

  format: FormatSettings = {
    displayFormat: "yyyy/MM/dd",
    inputFormat: "yyyy/MM/dd",
  };

  openUpload(){
    this.uploadVisible = true;
  }

  closeUpload(){
    this.uploadVisible = false;
  }

  openAddStud(){
    this.addStudVisible = true;
  }

  closeAddStud(){
    this.addStudVisible = false;
  }

  clearForm(){
    this.form.reset();
  }

  pageChange(event: PageChangeEvent): void {
    console.log("This is the event", event);
    this.skip = event.skip;
    this.loadItems();
  }

  loadItems(): void {
    this.gridView = {
      data: this.students.slice(this.skip, this.skip + this.pageSize),
      total: this.students.length
    }
  }

  constructor(
    private apollo: Apollo,
    private popupService: PopupService,
    private notificationService: NotificationService,
    private studentsService: StudentsService
  ) { }

  ngOnInit(): void {
    this.studentsService.getAllStudents().valueChanges.subscribe((result: any) => {
        console.log("Result", result);
        this.students = result.data.getAllStudents;
        this.loadItems();
    });
  }

  addStudent(){
    console.log("these are the form values", this.form.value);
    
    this.studentsService.createStudent(this.form.value.firstName, this.form.value.lastName, this.form.value.email, this.form.value.grade, this.form.value.division, this.form.value.dob).subscribe((data: any) => {
        console.log("Data received from graphql server", data);
        this.addStudVisible = false;
        this.students = data.data.createStudent;
        this.gridView= {
          data: data.data.createStudent.slice(this.skip, this.skip + this.pageSize),
          total: data.data.createStudent.length
        }
        this.loadItems();
        
    });
      this.clearForm()
  }

  deleteStudent(studentId: any) {
    this.studentsService.deleteStudent(studentId).subscribe((data: any)=> {
        console.log("Item deleted", data);
        this.students = this.students.filter((val: any)=> {
          return val.studentId !== data.data.deleteStudent.studentId
        });
        this.loadItems()
    })
      this.popUpClose();
  }

  editHandler(data: any) {
    this.value = new Date(data.dataItem.dob);
    this.deleteVisible = false;
    console.log("data", data);
    this.editRow = new FormGroup({
      firstName: new FormControl(data.dataItem.firstName),
      lastName: new FormControl(data.dataItem.lastName),
      email: new FormControl(data.dataItem.email),
      grade: new FormControl(data.dataItem.grade),
      division: new FormControl(data.dataItem.division),
      dob: new FormControl(data.dataItem.dob)
    });
    this.editedRowIndex = data.rowIndex;
    data.sender.editRow(data.rowIndex, this.editRow);
  }

  saveHandler(data: any) {
    console.log("data after saving", data);
    console.log("time after saving", this.value.toLocaleDateString());
    
    this.studentsService.updateStudent(data.dataItem.studentId, data.formGroup.value.firstName, data.formGroup.value.lastName, data.formGroup.value.email, data.formGroup.value.grade, data.formGroup.value.division, this.value).subscribe((data: any)=> {
        console.log("data after editing", data);
        this.students = data.data.updateStudent;
        this.gridView= {
          data: data.data.updateStudent.slice(this.skip, this.skip + this.pageSize),
          total: data.data.updateStudent.length
        }
        
    })

    data.sender.closeRow(data.rowIndex);
    this.deleteVisible = true;
    this.loadItems()
  }

  cancelHandler(data: any) {
    data.sender.closeRow(this.editedRowIndex);
    this.deleteVisible = true;
  }

  selectEventHandler(e: SelectEvent): void {
    //e.preventDefault();
    this.file = e.files[0].rawFile;
    console.log("Event", e);

    this.uploadButtonShow = true;
  }

  onDateChange(data:any){
    console.log("Date after changing", data);
    this.value = new Date(data);
  }

  togglePopup(template: TemplateRef<any>, anchor:any) {
    if (this.popupRef) {
      this.popupRef.close();
      this.popupRef = undefined;
    } else {
      this.popupRef = this.popupService.open({
        anchor: anchor,
        content: template
      });
    }
  }

  popUpClose(){
    this.popupRef?.close();
  }

  async onUpload(){
    
    this.studentsService.bulkInsertStudents(this.file).then((data:any) => {
      console.log("data after bulljs", data);
      this.uploadVisible = false;
    }).catch(error => {
      console.log(error);
      this.uploadVisible = false;
    });

    (async () => {
      let channel = socket.subscribe('student');
      for await (let data of channel) {
        console.log("data from cluster server", data);
        if (data == "Job Completed") {
          this.notificationService.show({
            content: this.notificationTemplate || "",
            hideAfter: 3000,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 900 },
            type: { style: 'success', icon: true },
          });
        }
        else if (data == "Job Failed"){
          this.notificationService.show({
            content: "Excel Upload Failed! Please Retry!",
            hideAfter: 3000,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 900 },
            type: { style: 'error', icon: true },
          });
        }
      }
    })();


  }

}
