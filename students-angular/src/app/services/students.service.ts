import { Injectable } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { request } from 'graphql-request';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private apollo: Apollo) { }

  getAllStudents(){
    return this.apollo
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
  }

  createStudent(firstname:string, lastname:string, email:string, grade:string, division:string, dob: any){
    return this.apollo
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
          firstNames: firstname,
          lastNames: lastname,
          emails: email,
          grades: grade,
          divisions: division,
          dobs: dob 
        }
    })
  }

  updateStudent(studentId:string, firstname:string, lastname:string, email:string, grade:string, division:string, dob:any){

    return this.apollo
      .mutate({
        mutation: gql`
        mutation($edstudentId: String!, $edfirstName: String!, $edlastName: String!, $edemail: String!, $edgrade: String!, $eddivision: String!, $eddob: DateTime!){
          updateStudent(updatestudent: {
            studentId: $edstudentId
            firstName: $edfirstName
            lastName: $edlastName
            email: $edemail
            grade: $edgrade
            division: $eddivision
            dob: $eddob
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
          edstudentId: studentId,
          edfirstName: firstname,
          edlastName: lastname,
          edemail: email,
          edgrade: grade,
          eddivision: division,
          eddob: dob
        }
    })

  }

  deleteStudent(studentId: string) {

    return this.apollo
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

  }

  bulkInsertStudents(files: any){
    return request(
      'http://localhost:4000/graphql', 
      gql`
        mutation ($file: Upload!){
          uploadexcel(file: $file)
        }
      `,
      {
        file: files
      }
    )
  }
}
