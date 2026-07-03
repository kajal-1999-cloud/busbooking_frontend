import { createSlice } from "@reduxjs/toolkit";
// TODO: write the logic as per the need

const MAX_SEATS = 6; //  constant for maximum seat limit

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    tripsResponse: null,
    apiStatus: "init",
    restoreTripId: null,
    // seat Layout states
    allSelectedSeat: {},
  },
  reducers: {
    updateTripsStatus: (state, action) => {
      // { success, data }
      state.apiStatus = action.payload.status;
      if (action.payload.status === "success") {
        state.tripsResponse = action.payload.data;
      }
    },
    setAllSelectedSeat: (state, action) => {
      const seat = action.payload.seat;
      const tripId = action.payload.tripId;
      const points = action.payload.points;
      if (state.allSelectedSeat[tripId]) {
        const seatData = state.allSelectedSeat[tripId];
        if (seatData.seats && seat) {
          if (
            seatData.seats.some((item) => item.seatNumber === seat.seatNumber)
          ) {
            seatData.seats = seatData.seats.filter(
              (item) => item.seatNumber !== seat.seatNumber
            );
          } else {
            if (seatData.seats.length === MAX_SEATS) {
              return;
            }
            seatData.seats.push(seat);
          }
        } else if (seat) seatData.seats = [seat];
        if (points) seatData.points = points;
        state.allSelectedSeat[tripId] = seatData;
      }
    },
    restoreSeatSelection: (state, action) => {
      const { tripId, seats, points } = action.payload;
      state.allSelectedSeat[tripId] = { seats: seats || [], points };
      state.restoreTripId = tripId;
    },
    clearRestoreTripId: (state) => {
      state.restoreTripId = null;
    },
    setTripId: (state, action) => {
      if (!state.allSelectedSeat[action.payload]) {
        state.allSelectedSeat[action.payload] = {};
      }
    },
    clearSelectedSeat: (state, action) => {
      state.allSelectedSeat = {};
      state.restoreTripId = null;
    },
  },
});

export const {
  updateTripsStatus,
  setTripId,
  clearSelectedSeat,
  setAllSelectedSeat,
  restoreSeatSelection,
  clearRestoreTripId,
} = tripsSlice.actions;

export default tripsSlice;
