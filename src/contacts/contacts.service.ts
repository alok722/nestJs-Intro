/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const filename = './contacts.json';

@Injectable()
export class ContactsService {
    contacts = [];

    constructor() {
        try {
            const content = fs.readFileSync(filename, 'utf-8');
            this.contacts = JSON.parse(content);
        } catch (error) {
            this.contacts = [];
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    writeToFile() {
        fs.writeFileSync(filename, JSON.stringify(this.contacts), 'utf-8');
    }

    exists(id: number): any {
        return this.contacts.findIndex(c => c.id == id) != -1;
    }

    // Using Es6 property of Getter
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    get nextId() {
        if (this.contacts.length == 0) return 1;
        const ids = this.contacts.map(c => c.id);
        return 1 + Math.max(...ids);
    }

    addOneContact(contact) {
        contact.id = this.nextId;
        this.contacts.push(contact);
        this.writeToFile();
        return contact;
    }

    addManyContacts(contacts) {
        const nextId = this.nextId;
        contacts.forEach((element, i) => {
            element.id = i + nextId;
        });
        this.contacts.push(...contacts);
        this.writeToFile();
        return contacts;
    }

    getAllContacts() {
        return [...this.contacts];
    }

}
