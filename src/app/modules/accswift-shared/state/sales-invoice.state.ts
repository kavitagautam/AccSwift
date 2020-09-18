import { InvoiceDetail } from "@accSwift-modules/sales-invoice/models/sales-invoice.model";
import { State, Selector, Action, StateContext } from "@ngxs/store";

export class SalesInvoiceDetails {
  status: string;
  InvoicesDetails: [];
}

export class AddInvoiceDetails {
  static readonly type = "[InvoiceDetail] Add";
  constructor(public payLoad: InvoiceDetail) {}
}

export class RemoveInvoiceDetails {
  static readonly type = "[InvoiceDetail] Remove";
  constructor(public payLoad: number) {}
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
  add(ctx: StateContext<InvoiceModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      invoices: [],
    });
  }
  // @Action(AddInvoiceDetails)
  // add(
  //   { getState, patchState }: StateContext<InvoiceModel>,
  //   { payLoad }: AddInvoiceDetails
  // ) {
  //   const state = getState();
  //   patchState({ invoices: [...state.invoices, payLoad] });
  // }

  @Action(RemoveInvoiceDetails)
  remove(
    { getState, patchState }: StateContext<InvoiceModel>,
    { payLoad }: RemoveInvoiceDetails
  ) {
    patchState({
      invoices: getState().invoices.filter((a) => a.ID !== payLoad),
    });
  }
}
