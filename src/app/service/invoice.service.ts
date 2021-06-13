import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Invoice } from '../model/invoice';
import { InvoiceType } from '../model/invoiceType';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoicesUrl = 'api/invoices';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET invoices from the server */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.invoicesUrl)
      .pipe(
        map( invoices => invoices.filter(i => i.type===InvoiceType.INVOICE)),
        catchError(this.handleError<Invoice[]>('getinvoices', []))
      );
  }

  getCreditNotes(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.invoicesUrl)
      .pipe(
        map( invoices => invoices.filter(i => i.type===InvoiceType.CREDIT_NOTE)),
        catchError(this.handleError<Invoice[]>('getCreditNotes', []))
      );
  }

  getInvoicesOfThisYear(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.invoicesUrl)
      .pipe(
        map( invoices => invoices.filter(i => i.year===new Date().getFullYear() && i.type===InvoiceType.INVOICE))
      );
  }

  getCreditNotesOfThisYear(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.invoicesUrl)
      .pipe(
        map( invoices => invoices.filter(i => i.year===new Date().getFullYear() && i.type===InvoiceType.CREDIT_NOTE))
      );
  }

  /** GET invoice by id. Return `undefined` when id not found */
  getInvoiceNo404<Data>(id: number): Observable<Invoice> {
    const url = `${this.invoicesUrl}/?id=${id}`;
    return this.http.get<Invoice[]>(url)
      .pipe(
        map(invoices => invoices[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
        }),
        catchError(this.handleError<Invoice>(`getinvoice id=${id}`))
      );
  }

  /** GET invoice by id. Will 404 if id not found */
  getInvoice(id: number): Observable<Invoice> {
    const url = `${this.invoicesUrl}/${id}`;
    return this.http.get<Invoice>(url).pipe(
      tap((newInvoice: Invoice) => console.log(`get invoice w/ id=${newInvoice.customer.name}`)),
      catchError(this.handleError<Invoice>(`getinvoice id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new invoice to the server */
  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.invoicesUrl, invoice, this.httpOptions).pipe(
      tap((newInvoice: Invoice) => console.log(`added invoice w/ id=${newInvoice.id}`)),
      catchError(this.handleError<Invoice>('addInvoice'))
    );
  }

  /** DELETE: delete the invoice from the server */
  deleteInvoice(invoice: Invoice | number): Observable<Invoice> {
    const id = typeof invoice === 'number' ? invoice : invoice.id;
    const url = `${this.invoicesUrl}/${id}`;

    return this.http.delete<Invoice>(url, this.httpOptions).pipe(
      catchError(this.handleError<Invoice>('deleteinvoice'))
    );
  }

  /** PUT: update the invoice on the server */
  updateInvoice(invoice: Invoice): Observable<any> {
    return this.http.put(this.invoicesUrl, invoice, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateinvoice'))
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
