import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customersUrl = 'api/customers';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET customers from the server */
  getcustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        catchError(this.handleError<Customer[]>('getcustomers', []))
      );
  }

  /** GET customer by id. Return `undefined` when id not found */
  getcustomerNo404<Data>(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/?id=${id}`;
    return this.http.get<Customer[]>(url)
      .pipe(
        map(customers => customers[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
        }),
        catchError(this.handleError<Customer>(`getcustomer id=${id}`))
      );
  }

  /** GET customer by id. Will 404 if id not found */
  getcustomer(id: number): Observable<Customer> {
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
  deletecustomer(customer: Customer | number): Observable<Customer> {
    const id = typeof customer === 'number' ? customer : customer.id;
    const url = `${this.customersUrl}/${id}`;

    return this.http.delete<Customer>(url, this.httpOptions).pipe(
      catchError(this.handleError<Customer>('deletecustomer'))
    );
  }

  /** PUT: update the customer on the server */
  updatecustomer(customer: Customer): Observable<any> {
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
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
