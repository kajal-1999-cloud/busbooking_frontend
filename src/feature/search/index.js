import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import SearchBar from "./SearchBar";
import SearchBarMobile from "./SearchBarMobile";
import TopDestinations from "./TopDestinations";
import Footer from "../../components/Footer/Footer";
import { addDate } from "./slice";
import { getTravelDateEpoch } from "../../utils/travelDate";
import { showError } from "../../utils/toast";

const CitySearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (navigationInfo) => {
    const {
      source,
      sourceId,
      destination,
      destinationId,
      selectedDate,
    } = navigationInfo;

    if (!source || !destination || !sourceId || !destinationId) {
      showError("Please select both source and destination cities.");
      return;
    }

    const travelEpoch = getTravelDateEpoch(selectedDate);
    dispatch(addDate(travelEpoch));

    navigate(
      `/trips/search/${encodeURIComponent(source)}/${sourceId}/${encodeURIComponent(destination)}/${destinationId}/${travelEpoch}`
    );
  };

  return (
    <div className="search-page">
      <Header />
      <div className="desktop-search-component search-container">
        <div className="search-bg-img"></div>
        <div className="search-form-container">
          <div className="bg-white">
            <SearchBar handleNavigate={handleNavigate} />
          </div>
        </div>
      </div>
      <div className="mobile-search-component">
        <SearchBarMobile handleNavigate={handleNavigate} />
      </div>
      <TopDestinations handleNavigate={handleNavigate} />
      <Footer />
    </div>
  );
};

export default CitySearch;
