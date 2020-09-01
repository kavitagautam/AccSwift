import { InvoiceDetail } from "@accSwift-modules/sales-invoice/models/sales-invoice.model";
import { State, Selector, Action, StateContext } from "@ngxs/store";

export class SalesInvoiceDetails {
  status: string;
  InvoicesDetails: InvoiceDetail;
}

export class AddInvoiceDetails {
  static readonly type = "[INVOICE] Add";
  constructor(public payLoad: SalesInvoiceDetails) {}
}

export class RemoveInvoiceDetails {
  static readonly type = "[INVOICE] Remove";
  constructor(public payLoad: string) {}
}

export class InvoiceModel {
  invoices: InvoiceDetail[];
}

@State<InvoiceModel>({
  name: "invoices",
  defaults: { invoices: [] },
})
export class InvoiceState {
  @Selector()
  static getInvoice(state: InvoiceModel) {
    return state.invoices;
  }
  @Action(AddInvoiceDetails)
  add(
    { getState, patchState }: StateContext<InvoiceModel>,
    { payLoad }: AddInvoiceDetails
  ) {
    const state = getState();
    patchState({ invoices: [...state.invoices] });
  }

  @Action(RemoveInvoiceDetails)
  remove(
    { getState, patchState }: StateContext<InvoiceModel>,
    { payLoad }: RemoveInvoiceDetails
  ) {
    //patchState({ invoices: getState().invoices.filter(a=>a.name!==payLoad)});
  }
}
