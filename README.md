# OnRoadBooking — Frontend

React bus ticket booking client for searching trips, selecting seats, completing bookings, and viewing reservation history.

---

## Features

### 1. Home Page

- Search buses by **source city**, **destination city**, and **travel date**
- Responsive search form for desktop and mobile
- Quick access to login from the header

![Home Page](public/home_page.png)

---

### 2. Trip List Page

- View available buses for the selected route and date
- Filter by bus type, price range, departure time, bus partner, and boarding/dropping points
- See bus partner, timings, duration, amenities, starting price, and available seats
- Open seat layout for any trip with **Show Seat**

![Trip List Page](public/trip_details.png)

---

### 3. Seat Layout Page

- Interactive upper and lower deck seat map
- Filter seats by price tier
- Select up to 6 seats per booking
- Choose boarding and dropping points before continuing to payment

![Seat Layout Page](public/seat_layout.png)

---

### 4. My Bookings Page

- View all bookings linked to your logged-in account
- See route, bus details, journey date, seat info, and total fare
- Access bookings anytime from **My Account** in the header

![My Bookings Page](public/mybookings.png)

---

## Tech Stack

- **React 18** — UI
- **React Router** — routing
- **Redux Toolkit** — state management
- **Axios** — API calls
- **Ant Design & Material UI** — components
- **SCSS** — styling

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend API running on `http://localhost:8080` (see `busbooking_updated` repo)

### Install & run

```bash
npm install
npm start
```

App runs at [http://localhost:3000](http://localhost:3000).

### API base URL

Configured in `src/network/endpoints.js`:

```js
const baseUrl = "http://localhost:8080";
```

---

## License

ISC
