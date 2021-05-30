import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public customersUrl = 'api/customers';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET customers from the server */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl)
    .pipe(
      tap(customers => console.log(`fetched customers`)),
      catchError(this.handleError('getCustomers'))
    ) as Observable<Customer[]>;
  }

  getCustomersOfThisYear(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        map( customers => customers.filter(r => r.year==new Date().getFullYear()) ),
        catchError(this.handleError('getCustomers'))
      ) as Observable<Customer[]>;
  }

  /** GET customer by number. Return `undefined` when number not found */
  getCustomerByNumberNo404<Data>(number: string): Observable<Customer> {
    return this.http.get<Customer>(this.customersUrl)
      .pipe(
        map(customers => customers[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
        }),
        catchError(this.handleError<Customer>(`getcustomer number=${number}`))
      );
  }

  /** GET customer by id. Will 404 if id not found */
  getCustomer(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/${id}`;
    return this.http.get<Customer>(url).pipe(
      catchError(this.handleError<Customer>(`getcustomer id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new customer to the server */
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer, this.httpOptions).pipe(
      tap((newCustomer: Customer) => console.log(`added customer w/ id=${newCustomer.id}`)),
      catchError(this.handleError<Customer>('addCustomer'))
    );
  }

  /** DELETE: delete the customer from the server */
  deleteCustomer(customer: Customer | number): Observable<Customer> {
    const id = typeof customer === 'number' ? customer : customer.id;
    const url = `${this.customersUrl}/${id}`;

    return this.http.delete<Customer>(url, this.httpOptions).pipe(
      catchError(this.handleError<Customer>('deletecustomer'))
    );
  }

  /** PUT: update the customer on the server */
  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(this.customersUrl, customer, this.httpOptions).pipe(
      catchError(this.handleError<any>('updatecustomer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
       `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      throw new Error(`${operation} failed: ${message}`);
    };

  }
}
