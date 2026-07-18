import React from "react";
import dayjs from "dayjs";
import "./styles/TopDestinations.scss";

const destinations = [
  {
    city: "Delhi",
    route: "Kolkata to Delhi",
    suggestedTrip: "Kolkata to Delhi Express",
    description: "Travel from the cultural hub of Kolkata to the historic capital city of Delhi.",
    image: "/images/delhi.jpg",
    price: "₹1200",
    searchParams: {
      source: "Kolkata",
      sourceId: "6a4818812ae9dabef6f7ee60",
      destination: "Delhi",
      destinationId: "6a4818812ae9dabef6f7ee4e"
    }
  },
  {
    city: "Bengaluru",
    route: "Mumbai to Bengaluru",
    suggestedTrip: "Mumbai to Bengaluru Premium",
    description: "Enjoy a scenic ride from Mumbai to the garden city and tech capital Bengaluru.",
    image: "/images/bengaluru.jpg",
    price: "₹1360",
    searchParams: {
      source: "Mumbai",
      sourceId: "6a4818812ae9dabef6f7ee45",
      destination: "Bengaluru",
      destinationId: "6a4818812ae9dabef6f7ee57"
    }
  },
  {
    city: "Mumbai",
    route: "Delhi to Mumbai",
    suggestedTrip: "Delhi to Mumbai SuperFast",
    description: "Ride from the historic capital to the financial heart of India and city of dreams.",
    image: "/images/mumbai.jpg",
    price: "₹1499",
    searchParams: {
      source: "Delhi",
      sourceId: "6a4818812ae9dabef6f7ee4e",
      destination: "Mumbai",
      destinationId: "6a4818812ae9dabef6f7ee45"
    }
  },
  {
    city: "Kolkata",
    route: "Kolkata to Bengaluru",
    suggestedTrip: "Kolkata to Bengaluru Classic",
    description: "Travel from the cultural heart of Bengal to the bustling tech metropolis of Bengaluru.",
    image: "/images/kolkata.jpg",
    price: "₹1499",
    searchParams: {
      source: "Kolkata",
      sourceId: "6a4818812ae9dabef6f7ee60",
      destination: "Bengaluru",
      destinationId: "6a4818812ae9dabef6f7ee57"
    }
  }
];

const TopDestinations = ({ handleNavigate }) => {
  const handleCardClick = (dest) => {
    if (handleNavigate && dest.searchParams) {
      // Calculate tomorrow's start of day date
      const tomorrow = dayjs().add(1, "day").startOf("day");
      handleNavigate({
        source: dest.searchParams.source,
        sourceId: dest.searchParams.sourceId,
        destination: dest.searchParams.destination,
        destinationId: dest.searchParams.destinationId,
        selectedDate: tomorrow
      });
    }
  };

  return (
    <div className="top-destinations-section">
      <h2 className="section-title">Top Destinations For Tomorrow</h2>
      <div className="destinations-grid">
        {destinations.map((dest, idx) => {
          // Row 1 on desktop (indexes 0 and 1) is light theme, Row 2 (indexes 2 and 3) is dark theme
          const themeClass = idx < 2 ? "theme-light" : "theme-light";
          return (
            <div
              key={idx}
              className={`destination-card ${themeClass}`}
              onClick={() => handleCardClick(dest)}
            >
              <div className="card-image-wrapper">
                <img src={dest.image} alt={dest.city} className="card-image" />
              </div>
              <div className="card-content">
                <div className="card-header-row">
                  <span className="route-badge">{dest.route}</span>
                  <h3 className="city-name">{dest.city}</h3>
                </div>
                <p className="suggested-trip">{dest.suggestedTrip}</p>
                <p className="description">{dest.description}</p>
                <div className="card-footer">
                  <span className="price-label">Starting from</span>
                  <span className="price-tag">{dest.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopDestinations;
