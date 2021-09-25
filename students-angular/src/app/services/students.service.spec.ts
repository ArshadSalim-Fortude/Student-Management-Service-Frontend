import { addTypenameToDocument } from '@apollo/client/utilities';
import { TestBed } from '@angular/core/testing';

import { StudentsService } from './students.service';
import {
  ApolloTestingModule,
  ApolloTestingController,
  APOLLO_TESTING_CACHE,
  
} from 'apollo-angular/testing';
import {InMemoryCache} from '@apollo/client/core';
import {Apollo, gql} from 'apollo-angular'


fdescribe('StudentsService', () => {
  let studentsServiceSpy: jasmine.SpyObj<StudentsService>;
  let apollo: Apollo;
  let apolloTestingController: ApolloTestingController;

  const testDataGetAll = {
      getAllStudents: [
        {
          studentId: "fa3abd3d-3fae-4423-9e0d-7e7ed9f71f1c",
          firstName: "ddd",
          lastName: "eee",
          email: "ddd@gmail.com",
          grade: "6",
          division: "C",
          dob: "2005-04-28T18:30:00.000Z",
          age: 16
        },
        {
          studentId: "1242bcd6-b7a3-410f-b513-5db3f471b03e",
          firstName: "aaa",
          lastName: "bbb",
          email: "aaa@gmail.com",
          grade: "10",
          division: "A",
          dob: "2000-10-15T18:30:00.000Z",
          age: 20
        },
        {
          studentId: "d3b65c6e-fe73-4aff-8309-bd4b55e9b5b1", 
          firstName: "bbb",
          lastName: "ccc",
          email: "bbb@gmail.com",
          grade: "12",
          division: "B",
          dob: "1999-05-24T18:30:00.000Z",
          age: 22
        }
      ]
  }

  const testDataCreateStudent = {
    createStudent: [
      {
        studentId: "fa3abd3d-3fae-4423-9e0d-7e7ed9f71f1c",
        firstName: "ddd",
        lastName: "eee",
        email: "ddd@gmail.com",
        grade: "6",
        division: "C",
        dob: "2005-04-28T18:30:00.000Z",
        age: 16
      },
      {
        studentId: "1242bcd6-b7a3-410f-b513-5db3f471b03e",
        firstName: "aaa",
        lastName: "bbb",
        email: "aaa@gmail.com",
        grade: "10",
        division: "A",
        dob: "2000-10-15T18:30:00.000Z",
        age: 20
      },
      {
        studentId: "d3b65c6e-fe73-4aff-8309-bd4b55e9b5b1", 
        firstName: "bbb",
        lastName: "ccc",
        email: "bbb@gmail.com",
        grade: "12",
        division: "B",
        dob: "1999-05-24T18:30:00.000Z",
        age: 22
      },
      {
        studentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
        firstName: "fff",
        lastName: "ggg",
        email: "fffggg@gmail.com",
        grade: "8",
        division: "D",
        dob: "2005-12-24T18:30:00.000Z",
        age: 15
      }
    ]
  }

  const testDataUpdateStudent = {
    updateStudent: [
      {
        studentId: "fa3abd3d-3fae-4423-9e0d-7e7ed9f71f1c",
        firstName: "ddd",
        lastName: "eee",
        email: "ddd@gmail.com",
        grade: "6",
        division: "C",
        dob: "2005-04-28T18:30:00.000Z",
        age: 16
      },
      {
        studentId: "1242bcd6-b7a3-410f-b513-5db3f471b03e",
        firstName: "aaa",
        lastName: "bbb",
        email: "aaa@gmail.com",
        grade: "10",
        division: "A",
        dob: "2000-10-15T18:30:00.000Z",
        age: 20
      },
      {
        studentId: "d3b65c6e-fe73-4aff-8309-bd4b55e9b5b1", 
        firstName: "bbb",
        lastName: "ccc",
        email: "bbb@gmail.com",
        grade: "12",
        division: "B",
        dob: "1999-05-24T18:30:00.000Z",
        age: 22
      },
      {
        studentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
        firstName: "fff",
        lastName: "ggg",
        email: "fffggghhh@gmail.com",
        grade: "8",
        division: "A",
        dob: "2006-12-24T18:30:00.000Z",
        age: 14
      }
    ]
  }

  const testDataDeleteStudent = {
    deleteStudent : {
      studentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
      firstName: "fff",
      lastName: "ggg",
    }
  }

  const GET_ALL_STUDENTS = {
    query: gql`
      query getAllStudents{
      getAllStudents {
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
    variables: {},
  };

  const CREATE_STUDENT = {
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
      firstNames: "fff",
      lastNames: "ggg",
      emails: "fffggg@gmail.com",
      grades: "8",
      divisions: "D",
      dobs: "2005-12-24T18:30:00.000Z" 
    }
  }

  const UPDATE_STUDENT = {
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
      edstudentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
      edfirstName: "fff",
      edlastName: "ggg",
      edemail: "fffggghhh@gmail.com",
      edgrade: "8",
      eddivision: "A",
      eddob: "2006-12-24T18:30:00.000Z"
    }
  }

  const DELETE_STUDENT = {
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
      studentId: "1699e195-cb59-457b-98bb-75e29d358e4a"
    }
  }
 
  beforeEach(() => {
    const spy = jasmine.createSpyObj('StudentsService', ['getAllStudents', 'createStudent', 'updateStudent', 'deleteStudent', 'bulkInsertStudents']);
    TestBed.configureTestingModule({ 
      imports: [ApolloTestingModule],
      providers: [
        StudentsService,
        { provide: StudentsService, useValue: spy}
      ],
    });

    apollo = TestBed.inject(Apollo);
    apolloTestingController = TestBed.inject(ApolloTestingController); 
    studentsServiceSpy = TestBed.inject(StudentsService) as jasmine.SpyObj<StudentsService>;
  });

  afterEach(() => {
    apolloTestingController.verify();  
  });

  it('should be created', () => {
    expect(studentsServiceSpy).toBeTruthy();
  });

  it('#getAllStudents should return all students', ()=> {
    const stubValueGetAll: any = testDataGetAll.getAllStudents;
    studentsServiceSpy.getAllStudents.and.returnValue(stubValueGetAll);
    expect(studentsServiceSpy.getAllStudents()).toEqual(stubValueGetAll);
  });

  it('#createStudent should create a student and return all students', ()=> {
    const stubValueCreate: any = testDataCreateStudent.createStudent;
    studentsServiceSpy.createStudent.and.returnValue(stubValueCreate);
    expect(studentsServiceSpy.createStudent("fff", "ggg", "fffggg@gmail.com", "8", "D", "2005-12-24T18:30:00.000Z")).toEqual(stubValueCreate);
  })

  it('#updateStudent should update a student and return all students', () => {
    const stubValueUpdate: any = testDataUpdateStudent.updateStudent;
    studentsServiceSpy.updateStudent.and.returnValue(stubValueUpdate);
    expect(studentsServiceSpy.updateStudent("1699e195-cb59-457b-98bb-75e29d358e4a", "fff", "ggg", "fffggghhh@gmail.com", "8", "A", "2006-12-24T18:30:00.000Z")).toEqual(stubValueUpdate)
  })

  it('#deleteStudent should delete a student and return that student details', ()=> {
    const stubValueDelete: any = testDataDeleteStudent.deleteStudent;
    studentsServiceSpy.deleteStudent.and.returnValue(stubValueDelete);
    expect(studentsServiceSpy.deleteStudent("1699e195-cb59-457b-98bb-75e29d358e4a")).toEqual(stubValueDelete);
  })

  it('#bulkInsertStudents should return Excel Uploaded message', ()=> {
    const stubValueBulk: any = "Excel Uploaded";
    const mockfile: string = "mock file"
    studentsServiceSpy.bulkInsertStudents.and.returnValue(stubValueBulk);
    expect(studentsServiceSpy.bulkInsertStudents(mockfile)).toEqual(stubValueBulk);
  })

  it('apollo should get all students and return it', () => {
    apollo.query<any>(GET_ALL_STUDENTS).subscribe((result) => { 
      expect(result.data).toEqual(testDataGetAll); 
    
    });
  
    const opGetAll = apolloTestingController.expectOne(GET_ALL_STUDENTS.query);   
    opGetAll.flush({
      data: {
        getAllStudents: [ 
          {  
            studentId: "fa3abd3d-3fae-4423-9e0d-7e7ed9f71f1c",
            firstName: "ddd",
            lastName: "eee",
            email: "ddd@gmail.com",
            grade: "6",
            division: "C",
            dob: "2005-04-28T18:30:00.000Z",
            age: 16
          },
          {
            studentId: "1242bcd6-b7a3-410f-b513-5db3f471b03e",
            firstName: "aaa",
            lastName: "bbb",
            email: "aaa@gmail.com",
            grade: "10",
            division: "A",
            dob: "2000-10-15T18:30:00.000Z",
            age: 20
          },
          {
            studentId: "d3b65c6e-fe73-4aff-8309-bd4b55e9b5b1",
            firstName: "bbb",
            lastName: "ccc",
            email: "bbb@gmail.com",
            grade: "12",
            division: "B", 
            dob: "1999-05-24T18:30:00.000Z",
            age: 22
          }
        ]
      }
    });  
    apolloTestingController.verify()

  });


  it('apollo should create a student and return all students', () => {
    apollo.mutate<any>(CREATE_STUDENT).subscribe((result) => {
      expect(result.data).toEqual(testDataCreateStudent);
    })
    const opCreateStudent = apolloTestingController.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(CREATE_STUDENT.mutation.definitions)   
      return true;
    })

    expect(opCreateStudent.operation.variables.firstNames).toEqual("fff");
    expect(opCreateStudent.operation.variables.lastNames).toEqual("ggg");
    expect(opCreateStudent.operation.variables.emails).toEqual("fffggg@gmail.com");
    expect(opCreateStudent.operation.variables.grades).toEqual("8");
    expect(opCreateStudent.operation.variables.divisions).toEqual("D");
    expect(opCreateStudent.operation.variables.dobs).toEqual("2005-12-24T18:30:00.000Z");

    opCreateStudent.flush({
      data: {
        createStudent: [
          {
            studentId: "fa3abd3d-3fae-4423-9e0d-7e7ed9f71f1c",
            firstName: "ddd",
            lastName: "eee",
            email: "ddd@gmail.com",
            grade: "6",
            division: "C",
            dob: "2005-04-28T18:30:00.000Z",
            age: 16
          },
          {
            studentId: "1242bcd6-b7a3-410f-b513-5db3f471b03e",
            firstName: "aaa",
            lastName: "bbb",
            email: "aaa@gmail.com",
            grade: "10",
            division: "A",
            dob: "2000-10-15T18:30:00.000Z",
            age: 20
          },
          {
            studentId: "d3b65c6e-fe73-4aff-8309-bd4b55e9b5b1", 
            firstName: "bbb",
            lastName: "ccc",
            email: "bbb@gmail.com",
            grade: "12",
            division: "B",
            dob: "1999-05-24T18:30:00.000Z",
            age: 22
          },
          {
            studentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
            firstName: "fff",
            lastName: "ggg",
            email: "fffggg@gmail.com",
            grade: "8",
            division: "D",
            dob: "2005-12-24T18:30:00.000Z",
            age: 15
          }
        ]
      }
    })

    apolloTestingController.verify();

  })

  it('apollo should update a student and return all students', () => {
    apollo.mutate<any>(UPDATE_STUDENT).subscribe((result) => {
      expect(result.data).toEqual(testDataUpdateStudent);
    })
    const opUpdateStudent = apolloTestingController.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(UPDATE_STUDENT.mutation.definitions)   
      return true;
    })

    expect(opUpdateStudent.operation.variables.edstudentId).toEqual("1699e195-cb59-457b-98bb-75e29d358e4a");
    expect(opUpdateStudent.operation.variables.edlastName).toEqual("ggg");
    expect(opUpdateStudent.operation.variables.edfirstName).toEqual("fff");
    expect(opUpdateStudent.operation.variables.edemail).toEqual("fffggghhh@gmail.com");
    expect(opUpdateStudent.operation.variables.edgrade).toEqual("8");
    expect(opUpdateStudent.operation.variables.eddivision).toEqual("A");
    expect(opUpdateStudent.operation.variables.eddob).toEqual("2006-12-24T18:30:00.000Z");

    opUpdateStudent.flush({
      data: {
        updateStudent: [
          {
            studentId: "fa3abd3d-3fae-4423-9e0d-7e7ed9f71f1c",
            firstName: "ddd",
            lastName: "eee",
            email: "ddd@gmail.com",
            grade: "6",
            division: "C",
            dob: "2005-04-28T18:30:00.000Z",
            age: 16
          },
          {
            studentId: "1242bcd6-b7a3-410f-b513-5db3f471b03e",
            firstName: "aaa",
            lastName: "bbb",
            email: "aaa@gmail.com",
            grade: "10",
            division: "A",
            dob: "2000-10-15T18:30:00.000Z",
            age: 20
          },
          {
            studentId: "d3b65c6e-fe73-4aff-8309-bd4b55e9b5b1", 
            firstName: "bbb",
            lastName: "ccc",
            email: "bbb@gmail.com",
            grade: "12",
            division: "B",
            dob: "1999-05-24T18:30:00.000Z",
            age: 22
          },
          {
            studentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
            firstName: "fff",
            lastName: "ggg",
            email: "fffggghhh@gmail.com",
            grade: "8",
            division: "A",
            dob: "2006-12-24T18:30:00.000Z",  
            age: 14
          }
        ]
      }
    })

    apolloTestingController.verify();
  })

  it('apollo should delete a student and return that student', ()=> {
    apollo.mutate<any>(DELETE_STUDENT).subscribe((result) => {
      expect(result.data).toEqual(testDataDeleteStudent);
    })

    const opDeleteStudent = apolloTestingController.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(DELETE_STUDENT.mutation.definitions);
      return true;
    })

    expect(opDeleteStudent.operation.variables.studentId).toEqual("1699e195-cb59-457b-98bb-75e29d358e4a");
    opDeleteStudent.flush({
      data: {
        deleteStudent: {
          studentId: "1699e195-cb59-457b-98bb-75e29d358e4a",
          firstName: "fff",
          lastName: "ggg"
        }
      }
    })
    apolloTestingController.verify();
  })


});
