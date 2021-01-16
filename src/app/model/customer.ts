
import { CustomerType } from './customerType';

export class Customer {
  readonly id: number;
  type: CustomerType = CustomerType.INDIVIDUAL;
  name: string;
  street: string;
  houseNumber: string;
  boxNumber?: string;
  postalCode: string;
  city: string;
  phone?: string;
  mobile?: string;
  email?: string;
  taxNumber?: string;
  year: number;
  index: number;
  number: string;
  foreign: boolean = false;
  country: string = "België"

  constructor(id?: number, type?: CustomerType, name?:string) {
    this.id = id;
    this.type = type;
    this.name = name;
  }
}