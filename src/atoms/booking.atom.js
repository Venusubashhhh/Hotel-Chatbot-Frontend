import { atom } from "recoil";

const booking = atom({
  key: "bookingDetails",
  default: {
    roomTypes: [],
    roomAmenities: [],
    hotelAmenities: [],
    duration:0,
    adults: 0,
    children: 0,
    location: [],
    date: "",
    price: "",
  },
});

export default booking;
