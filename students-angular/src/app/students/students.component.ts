import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { SelectEvent } from "@progress/kendo-angular-upload";
import { request } from 'graphql-request';
import { FormGroup, FormControl} from "@angular/forms";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";



@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: any=[{}];
  uploadVisible: boolean = false;
  uploadButtonShow: boolean = false;
  file: any;
  addStudVisible: boolean = false;

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

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: gql`
          {
            getAllStudents {
              studentId
              firstName
              lastName
              dob
              age
              email
              grade
              division
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        console.log("Result", result);
        this.students = result.data.getAllStudents;
      });
  }

  addStudent(){
    console.log("these are the form values", this.form.value);
    this.apollo
      .mutate({
        mutation: gql`
          mutation($firstNames: String!, $lastNames: String!, $emails: String!, $grades: String!, $divisions: String!, $dobs: DateTime!){
            createStudent(createstudent: {
              firstName: $firstNames
              lastName : $lastNames
              email : $emails
              grade : $grades
              division : $divisions
              dob : $dobs
            }) {
              studentId
              firstName
              lastName
              email
              grade
              division
              dob
              age
            }
          }
        `,
        variables: {
          firstNames: this.form.value.firstName,
          lastNames: this.form.value.lastName,
          emails: this.form.value.email,
          grades: this.form.value.grade,
          divisions: this.form.value.division,
          dobs: this.form.value.dob 
        }
      })
      .subscribe((data: any) => {
        console.log("Data received from graphql server", data.data.createStudent);
        this.addStudVisible = false;
        // this.students =[...this.students, {
        //   studentId: data.data.createStudent.studentId,
        //   firstName: data.data.createStudent.firstName,
        //   lastName: data.data.createStudent.lastName,
        //   email: data.data.createStudent.email,
        //   grade: data.data.createStudent.grade,
        //   division: data.data.createStudent.division,
        //   dob: data.data.createStudent.dob,
        //   age: data.data.createStudent.age
        // }]
        this.students = data.data.createStudent;
        
      });
      this.clearForm()
  }

  deleteStudent(studentId: any) {
    this.apollo
      .mutate({
        mutation: gql`
        mutation($studentId: String!){
          deleteStudent(studentId: $studentId){
            studentId
            firstName
            lastName
          }
        }
        `,
        variables: {
          studentId: studentId
        }
      })
      .subscribe((data: any)=> {
        console.log("Item deleted", data.data.deleteStudent.studentId);
        this.students = this.students.filter((val: any)=> {
          return val.studentId !== data.data.deleteStudent.studentId
        })
      })
  }

  selectEventHandler(e: SelectEvent): void {
    //e.preventDefault();
    this.file = e.files[0].rawFile;
    console.log("Event", e);

    this.uploadButtonShow = true;
  }

  async onUpload(){
    request(
      'http://localhost:4000/graphql', 
      gql`
        mutation ($file: Upload!){
          uploadexcel(file: $file)
        }
      `,
      {
        file: this.file
      }
    ).then((data:any) => {
      console.log("data after bulljs", data);
      this.uploadVisible = false;
    }).catch(error => {
      console.log(error);
      this.uploadVisible = false;
    });
  }

}
