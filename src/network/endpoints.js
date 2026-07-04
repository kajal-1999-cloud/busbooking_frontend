const baseUrl = "http://localhost:8080";
// const baseUrl = "https://busbooking-backend-b71n.onrender.com";

const Endpoints = {
  searchCities: `${baseUrl}/city/cities`,
  tripsList: `${baseUrl}/api/trips/details`,
  seatLayout: `${baseUrl}/api/seat/layout`,
  booking: `${baseUrl}/booking/book`,
  myBookings: `${baseUrl}/booking/list`,
  login: `${baseUrl}/auth/login`,
  singUp: `${baseUrl}/register/signUp`,
};

export default Endpoints;
