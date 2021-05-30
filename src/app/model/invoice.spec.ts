import { Invoice } from "./invoice";

// Straight Jasmine testing without Angular's testing support
describe('ValueService', () => {
    let invoice: Invoice;
    beforeEach(() => { 
        const fixedDate = new Date(2021, 0, 1);
        jasmine.clock().install();
        jasmine.clock().mockDate(fixedDate);
        invoice = new Invoice();
     });

     afterEach(() => {
        jasmine.clock().uninstall();
      });

    it('#invoice date should be today date', () => {
        expect(invoice.date).toEqual(new Date(2021, 0, 1));
    });

    it('#invoice customer to be new customer', () => {
        expect(invoice.customer).not.toEqual(null);
    });
});