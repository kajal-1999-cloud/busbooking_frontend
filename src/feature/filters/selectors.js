import { createSelector } from "reselect";

export const boardingDroppingPointsSelector = createSelector(
  (state) => state?.trips?.tripsResponse || {},
  (tripsResponse) => {
    const { boardingPoints = [], dropingPoints = [] } = tripsResponse;
    return { boardingPoints, dropingPoints };
  }
);

export const busPartnerSelector = createSelector(
  (state) => state.trips?.tripsResponse?.trips,
  (trips) => {
    const partners = trips
      ?.map(({ busPartner }) => busPartner)
      .filter(Boolean);
    return new Set(partners);
  }
);
