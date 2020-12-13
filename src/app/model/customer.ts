
import { CustomerType } from './customerType';

export class Customer {
  readonly id: number;
  type: CustomerType;
  sex?: string;
  taxNumber?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  street: string;
  houseNumber: string;
  boxNumber?: string;
  postalCode: string;
  city: string;
  phone?: string;
  mobile?: string;
  email?: string;
  year: number;
  index: number;
  number: string;

  constructor(id?: number, type?: CustomerType, firstName?:string, lastName?:string) {
    this.id = id;
    this.type = type;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}