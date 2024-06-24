export enum PaidProvider {
  user = 1,
  company,
  branch,
}

export enum PaidStatues {
  Finish = 1,
}

export enum ReasonOfPaid {
  PayForOffer = 1,
  BuyBundle,
  BuyFeatureBundle,
  ReturnMoneyAfterDiscount,
  ReturnMoneyWithoutDiscount,
}

export enum PaidDestination {
  ForHim = 1,
  OnHim = 2,
}
