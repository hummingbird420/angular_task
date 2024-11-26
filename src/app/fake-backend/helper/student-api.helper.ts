import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getuid } from 'process';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize } from 'rxjs/operators';
import { DropDownModel } from 'src/app/models/filter-dropdown';
import { DropdownInfo } from '../dropdown-json';
import { RecipientInfo } from '../recipient-json';

const studentKey = 'FAKE_BACKEND_STUDENTS';
const studentJSON = localStorage.getItem(studentKey);
let students: any[] = studentJSON
  ? JSON.parse(studentJSON)
  : [
      { id: 1, name: 'Rakib', email: 'rakib@gmail.com', role: 'Student' },
      { id: 2, name: 'Rakib1', email: 'rakib1@gmail.com', role: 'Student' },
    ];

const optionKey = 'FAKE_BACKEND__MESSAGE_OPTIONS';
const optionJSON = localStorage.getItem(optionKey);
let options: any[] = optionJSON
  ? JSON.parse(optionJSON)
  : {
      fieldTitle: 'Folder',
      fieldName: 'folderId',
      fieldValue: 0,
      fieldType: 'DROPDOWN',
      hints: null,
      maxLength: 0,
      required: false,
      options: [
        {
          value: -2,
          title: 'Inbox',
        },
        {
          value: -1,
          title: 'Sent',
        },
        {
          value: -3,
          title: 'SMS',
        },
        {
          value: 52,
          title: 'test',
        },

        {
          value: 0,
          title: 'Trash',
        },
      ],
    };

const messageKey = 'FAKE_BACKEND_STUDENTS';
const messageJSON = localStorage.getItem(messageKey);
let messages: any[] = messageJSON
  ? JSON.parse(messageJSON)
  : {
      columns: [
        {
          name: 'date',
          title: 'Date',
          type: 'TEXT',
          alignment: 'LEFT',
        },
        {
          name: 'from',
          title: 'From',
          type: 'TEXT',
          alignment: 'LEFT',
        },
        {
          name: 'title',
          title: 'Title',
          type: 'TEXT',
          alignment: 'LEFT',
        },
        {
          name: 'type',
          title: 'Type',
          type: 'TEXT',
          alignment: 'LEFT',
        },
        {
          name: 'status',
          title: 'Status',
          type: 'TEXT',
          alignment: 'LEFT',
        },
      ],
      messages: [
        {
          date: '1/17/2023 04.52 AM',
          recipientName: 'Me',
          type: 'Regular',
          status: 'Read',
          title: {
            name: 'test',
            path: 'view-message?messageid=4042062&originalMessageId=4042062&foldertype=52&usertype=1&aboutuserid=4109804',
          },
        },
      ],
      pageNumber: 0,
      messagePerPage: 50,
      canDelete: true,
      disableMoveTo: false,
    };

const recipientKey = 'FAKE_BACKEND_RECIPIENT';
const recipientJSON = localStorage.getItem(recipientKey);
let recipient: any;

const dropdownKey = 'FAKE_BACKEND_RECIPIENT-DROPDOWN';
const dropdownJSON = localStorage.getItem(dropdownKey);
let dropdown: DropDownModel;
@Injectable()
export class StudentApiHelperInterceptor implements HttpInterceptor {
  constructor(public recipientService: RecipientInfo, public dropdownService: DropdownInfo) {
    recipient = recipientJSON ? JSON.parse(recipientJSON) : this.recipientService.getRecipient();
    dropdown = dropdownJSON ? JSON.parse(dropdownJSON) : this.dropdownService.getDropdown();
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('http://localhost:4200/einstein-galactic/public/session-id') && method === 'GET':
          return getSession();
        case url.endsWith('http://localhost:4200/einstein-galactic/public/translated-words') && method === 'POST':
          return getSession();
        case url.endsWith('http://localhost:4200/einstein-galactic//auth/check-authentication') && method === 'GET':
          return checkAuth();

        case url.endsWith('/einstein-galactic/students') && method === 'GET':
          return getStudents();

        case url.endsWith('/einstein-galactic/students-message-options') && method === 'GET':
          return getMessageOptions();
        case url.endsWith('/einstein-galactic/students-messages') && method === 'GET':
          return getMessages();
        case url.endsWith('/messages-recipient/type-fake') && method === 'GET':
          return getRecipient();
        case url.endsWith('/messages-recipient-dropdown/type-fake') && method === 'GET':
          return getDropdown();
        default:
          return next.handle(request);
      }
    }
    function getRecipient() {
      return ok(recipient);
    }
    function getStudents() {
      return ok(students.map((x) => basicDetails(x)));
    }

    function getSession() {
      return ok({ sessionId: '3F2504E0-4F89-11D3-9A0C-0305E82C3301' });
    }
    function checkAuth() {
      return ok({ userId: 'rks' });
    }
    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    function basicDetails(student: any) {
      const { id, name, email, role } = student;
      return { id, name, email, role };
    }

    function getMessageOptions() {
      return ok(options);
    }
    function getMessages() {
      return ok(messages);
    }
    function getDropdown() {
      return ok(dropdown);
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: StudentApiHelperInterceptor,
  multi: true,
};
