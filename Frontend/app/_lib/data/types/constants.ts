export enum Severity {
  Low = 1,
  Medium,
  High,
  Critical,
}

export type SeverityType = Severity;

export enum BaggageIncidentEnum {
  None = 0,
  Damaged = 1, // 2^0
  Tagless = 2, // 2^1
  Pilfered = 4, // 2^2
}
export type BaggIncidentEnumType = BaggageIncidentEnum;

export enum YesOrNo {
  Yes = 'Yes',
  No = 'No',
}

export type YesOrNoType = YesOrNo;

export const YesOrNoToBoolean = (value: YesOrNoType): boolean =>
  value === YesOrNo.Yes;

export enum IncidentCategory {
  None = 0,
  BaggageIncident = 1,
  AirCraftIncident = 2,
  TheftIncident = 3,
}
export type IncidentCategoryType = IncidentCategory;

export enum IncidentStatus {
  Documented = 1,
  Reported,
  UnderInvestigation,
  Resolved,
  AwaitingAction,
  Escalated,
  Canceled,
}
export type IncidentStatusType = IncidentStatus;

export enum StolenItemCategory {
  Bag = 1,
  Cargo,
  Mail,
  Other,
}
export type StolenItemCategoryType = StolenItemCategory;
