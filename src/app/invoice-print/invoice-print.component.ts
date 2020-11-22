import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css']
})
export class InvoicePrintComponent implements OnInit {

  calc2Cols = '2 2 calc(10em + 10px);';
  /** 10px is the missing margin of the missing box */
  calc3Cols = '3 3 calc(15em + 20px)';
  /** 20px is the missing margin of the two missing boxes */
  calc4Cols = '4 4 calc(20em + 40px)';

  constructor() { }

  ngOnInit(): void {
  }

}
