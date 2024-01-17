import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import "./HomePage.scss";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import Footer from "../../components/footer/Footer";
import chatService from "../../API/chat";
import SearchService from "../../API/search/search.service";
import { useRecoilState } from "recoil";
import booking from "../../atoms/booking.atom";
import chat from "../../atoms/chatHistory.atom";
import BotBubble from "../../components/ChatBubble/BotBubble";
import { v4 as uuidv4 } from "uuid";
import { SEARCH_API,PRICE_DETAILS } from "../.././Constants";

import axios from "axios";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const [chatHistory, setChatHistory] = useRecoilState(chat);
  const [bookingDetails, setBookingDetails] = useRecoilState(booking);
  // const [chatContext, setChatContext] = useState("");
  const [, setLoading] = useState(false);
  const [flag, setflag] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState();
  const navigate = useNavigate();
  const chatElementRef = useRef(null);

  const getResponseFromChatAPI = async (userInput) => {

    try {
      setLoading(true);
      const data = await chatService.getChatResponse(userInput);
      setLoading(false);
      console.log("chat_api", data);
      console.log({bookingDetails})
      // if (data.tag) setChatContext(data.tag);
      if (data.tag === "") {
        setChatHistory((prev) => {
          return [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: data.statement,
              tag: data.tag,
              time: new Date(),
            },
          ];
        });
      } else if (data.tag === "greeting") {
        setChatHistory((prev) => [
          ...prev,
          {
            id: uuidv4(),
            type: "bot",
            message: data.statement + "\n (Available at Coimbatore, Chennai)",
            tag: data.tag,
            time: new Date(),
          },
        ]);
      } else if (data.tag === "people") {
        const { adult, child } = data.statement;
        if (adult + child == 0) {
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message:
                "Can you specify the number of people more clearly ? (Ex: 1 adult 2 children)",
              tag: data.tag,
              time: new Date(),
            },
          ]);
        } else {
          const validationBubbleId = uuidv4();
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `Ok, you want a room for ${adult} ${
                adult > 1 ? "adults" : "adult"
              } and ${child} ${
                child > 1 ? "children" : "child"
              } (of age less than 12 years), is this accurate ?`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  adults: adult,
                  children: child,
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message:
                      "Can you be more Specific ? (like: 1 Adult 2 Children)",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        }
      } else if (data.tag === "price") {
        if (data.numbers > 5000) {
          const validationBubbleId = uuidv4();
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `You are looking for rooms on the price of  ${data?.numbers} do you want to confirm it`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "ok",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  price: data?.number,
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
              
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message: "Fine provide the price correctly",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        } else {
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: data.statement,
              tag: data.tag,
              time: new Date(),
            },
          ]);
        }
      } else if (data.tag === "date") {
        const validationBubbleId = uuidv4();
        setChatHistory((prev) => [
          ...prev,
          {
            id: uuidv4(),
            type: "bot",
            message: `You are looking for room on ${data?.date} do you want to confirm it`,
            tag: data.tag,
            time: new Date(),
          },
          {
            id: validationBubbleId,
            type: "user",
            input: "yn",
            message: "ok",
            tag: "validation",
            onYes: () => {
              const newBookingDetails = {
                ...bookingDetails,
                date: data?.date,
              };
              setBookingDetails(newBookingDetails);
              setChatHistory((prev) => [
                ...prev.map((chatData) =>
                  chatData.id === validationBubbleId
                    ? { ...chatData, disable: true }
                    : chatData
                ),
            
              ]);
              setBotResponse(newBookingDetails);
            },
            onNo: () => {
              setChatHistory((prev) => [
                ...prev.map((chatData) =>
                  chatData.id === validationBubbleId
                    ? { ...chatData, disable: true }
                    : chatData
                ),
                {
                  id: uuidv4(),
                  type: "bot",
                  message: "Fine provide the date correctly",
                  tag: data.tag,
                  time: new Date(),
                },
              ]);
            },
            time: new Date(),
          },
        ]);
      } else if (data.tag === "roomsDetail") {
        setChatHistory((prev) => [
          ...prev,
          {
            id: uuidv4(),
            type: "bot",
            message: data.statement,
            tag: data.tag,
            time: new Date(),
          },
        ]);
      }
      else if (data.tag === "duration") {
        const validationBubbleId = uuidv4();
        setChatHistory((prev) => [
          ...prev,
          {
            id: uuidv4(),
            type: "bot",
            message: `You are looking for room on duration of ${data?.duration} do you want to confirm it`,
            tag: data.tag,
            time: new Date(),
          },
          {
            id: validationBubbleId,
            type: "user",
            input: "yn",
            message: "ok",
            tag: "validation",
            onYes: () => {
              const newBookingDetails = {
                ...bookingDetails,
                duration: data?.duration,
              };
              setBookingDetails(newBookingDetails);
              setChatHistory((prev) => [
                ...prev.map((chatData) =>
                  chatData.id === validationBubbleId
                    ? { ...chatData, disable: true }
                    : chatData
                ),
            
              ]);
              setBotResponse(newBookingDetails);
            },
            onNo: () => {
              setChatHistory((prev) => [
                ...prev.map((chatData) =>
                  chatData.id === validationBubbleId
                    ? { ...chatData, disable: true }
                    : chatData
                ),
                {
                  id: uuidv4(),
                  type: "bot",
                  message: "Fine provide the date correctly",
                  tag: data.tag,
                  time: new Date(),
                },
              ]);
            },
            time: new Date(),
          },
        ]);
      } else if (data.tag === "roomsDetail") {
        setChatHistory((prev) => [
          ...prev,
          {
            id: uuidv4(),
            type: "bot",
            message: data.statement,
            tag: data.tag,
            time: new Date(),
          },
        ]);
      }
      
      else if (data.tag === "backend") {
        const validationBubbleId = uuidv4();
        const hotelAmenities = data.hotelAmenities;
        const roomAmenities = data.roomAmenities;
        const roomTypes = data.roomTypes;
        // const location = data.location;
        if (roomTypes.length != 0) {
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `You are looking for room type  ${roomTypes} do you want to confirm the room type as it costs the price of ${PRICE_DETAILS[roomTypes]}`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "ok",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  roomTypes: roomTypes,
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
              
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message:
                      "Fine what type of room you are exactly looking for...",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        }
        if (hotelAmenities.length != 0) {
          const validationBubbleId = uuidv4();
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `Hope You are looking for room with  ${hotelAmenities} do you want to confirm the room amenities`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "ok",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  hotelAmenities: hotelAmenities,
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
              
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message:
                      "Fine what are the hotel amenities exactly looking for...",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        }
        if (roomAmenities.length != 0) {
          const validationBubbleId = uuidv4();
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `You are looking for room with  ${roomAmenities} do you want to confirm the room Amenities`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "ok",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  roomAmenities: roomAmenities,
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
              
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message:
                      "Fine what are the room amenities you are exactly looking for...",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        }
        if (data?.date.length != 0) {
          const validationBubbleId = uuidv4();
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `You are looking for room on ${data?.date} do you want to confirm it`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "ok",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  date: data?.date,
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message: "Fine provide the date correctly",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        }
        if (data?.location.length != 0) {
          const validationBubbleId = uuidv4();
          setChatHistory((prev) => [
            ...prev,
            {
              id: uuidv4(),
              type: "bot",
              message: `You are looking for room at ${data?.location} do you want to confirm it`,
              tag: data.tag,
              time: new Date(),
            },
            {
              id: validationBubbleId,
              type: "user",
              input: "yn",
              message: "ok",
              tag: "validation",
              onYes: () => {
                const newBookingDetails = {
                  ...bookingDetails,
                  location: [data?.location],
                };
                setBookingDetails(newBookingDetails);
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                 
                ]);
                setBotResponse(newBookingDetails);
              },
              onNo: () => {
                setChatHistory((prev) => [
                  ...prev.map((chatData) =>
                    chatData.id === validationBubbleId
                      ? { ...chatData, disable: true }
                      : chatData
                  ),
                  {
                    id: uuidv4(),
                    type: "bot",
                    message: "Fine provide the location correctly",
                    tag: data.tag,
                    time: new Date(),
                  },
                ]);
              },
              time: new Date(),
            },
          ]);
        }
        getResponseFromSearch();
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setBotResponse = (bookingDetails) => {
    const {
      adults,
      children,
      location,
      date,
      roomAmenities,
      roomTypes,
      duration,
      price,
    } = bookingDetails;
    let string = "";
  if (location.length === 0) {
      string =
        "Can you provide your prefered location ? (PS: We're available in Coimbatore and Chennai)";
    }
   else if (adults + children === 0) {
      string =
        "Can you specify the number of people ? (Ex: 1 adult 2 children)";
    } 
    else if (roomTypes.length == 0) {
      string =
        "Can you provide details about the room type you are looking for (Ex: Superior, Business, Junior, Suite, Presidential)";
    } else if (date.length == 0) {
      string = "Can you provide the date you want rooms (Ex: 10-12-2024)";
    }
    else if (duration === 0) {
      string =
        "Can you specify the duration ? (Ex: 2 days)";
    }  
    else if (roomAmenities.length == 0) {
      string =
        "Can you provide details about the amenities you are looking for (Ex:Ac,Newspaper...)";
    } else {
      // string = `Hi, you are going good, how about you provide some additional details ?
      // like:
      // -> Hotel Amenities - Swimming Pool, Hill, Beach, Gym, Bar, Parking
      // -> Room Amenities - AC, Beverages, Wifi, Breakfast, TV, Minibar, Newspaper, Jacuzzi, Smart Room
      // -> Room Types - Superior, Business, Junior, Suite, Presidential
      // -> Price - Rs.5000
      // -> No of People - Ex: 1 adult 2 children`;
    }
    if (string.length > 0) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: uuidv4(),
          type: "bot",
          message: string,
          tag: "loop",
          time: new Date(),
        },
      ]);
    }
  };

  const handleUserInput = (userId, message, time) => {
    if (message.length > 0) {
      setChatHistory((prev) => {
        return [
          ...prev,
          {
            type: "user",
            message: message,
            time,
          },
        ];
      });
    }
  };

  const getResponseFromSearch = async () => {
    const apiPath = SEARCH_API;

    try {
      const data = await axios.post(`${apiPath}/search`, {
        roomTypes: [...bookingDetails.roomTypes],
        roomAmenities: [...bookingDetails.roomAmenities],
        hotelAmenities: [...bookingDetails.hotelAmenities],
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        location: [...bookingDetails.location],

        // roomTypes:['junior'],
        // roomAmenities:[],
        // hotelAmenities:['gym'],
        // adults:2,
        // children:0,
        // location:['chennai'],
      });
      console.log(data);
      setRooms(data?.data?.data?.rooms);
      setHotels(data?.data?.data?.Hotel);
      console.log(hotels);
    } catch (e) {
      console.error(e.message || "Something went wrong");
    }
  };

  const getPaymentLink = async (items) => {
    const apiPath = SEARCH_API;

    try {
      const data = await axios.post(`${apiPath}/book`, {
        hotelId: hotels[0]?.hotelId,
        roomId: items.roomId,
        userId: "68df6724-efaf-4112-8014-617c0afad953",
        adult: bookingDetails.adults,
        child: bookingDetails.children,
        checkIn: "12/02/2024",
        checkOut: "13/02/2024",
      });
      console.log(data);

      setflag(!flag);
    } catch (e) {
      console.error(e.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (chatHistory.length === 0) {
      getResponseFromChatAPI("Hi, how are you ?");
    } else if (
      chatHistory[chatHistory.length - 1].type === "user" &&
      chatHistory[chatHistory.length - 1].tag !== "validation"
    ) {
      if (
        ["no", "No", "Nope"].includes(
          chatHistory[chatHistory.length - 1].message
        )
      ) {
        setBotResponse(bookingDetails);
      } else {
        getResponseFromChatAPI(chatHistory[chatHistory.length - 1].message);
      }
    }
    if (chatElementRef) {
      chatElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatHistory.length]);

  useEffect(() => {
    if (chatElementRef) {
      chatElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     bookingDetails.date &&
  //     bookingDetails.adults !== 0 &&
  //     bookingDetails.location.length > 0 &&
  //     bookingDetails.roomTypes.length > 0
  //   ) {
  //     setChatHistory((prev) => [
  //       ...prev,
  //       {
  //         id: uuidv4(),
  //         type: "bot",
  //         suggestion: "room",
  //         message: "",
  //       },
  //     ]);
  //   }
  // }, [bookingDetails]);

  return (
    <div className="homepage-container">
      <div className="home-wrapper">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="scroll-wrapper">
          <div className="chat-wrapper" ref={chatElementRef}>
            {chatHistory.map((chat) => (
              <>
                {chat.type === "bot" ? (
                  <BotBubble key={`${chat.id}`} time={chat.time} message={chat.message || ""} />
                ) : (
                  <ChatBubble key={`${chat.id}`} time={chat.time} chatData={chat} />
                )}
              </>
            ))}
          {bookingDetails.adults != 0 &&
          bookingDetails.location.length != 0 &&
          bookingDetails.date != 0 &&
          (bookingDetails.hotelAmenities.length != 0 ||
            bookingDetails.roomAmenities.length != 0) ? (
            <div className="chat-bubble">
              <div className="botBubbleHotel">
                {!flag ? (
                  <ul style={{ display: "flex", gap: "20px", bottom: "50px" }}>
                    {rooms.map((items) => (
                      <li key={items?.roomId}>
                        <div className="wrapper">
                          <div className="booking-card-wrapper">
                            <div className="booking-card-content">
                              <div className="booking-card-description">
                                <h1>{hotels[0]?.branchName}</h1>
                                <p>
                                  <span>Room Type:</span>
                                  {items.type}
                                </p>
                                <p>
                                  <span>Persons:</span>adults-
                                  {bookingDetails.adults} and child-
                                  {bookingDetails.children}{" "}
                                </p>
                                <p>
                                  <span>BedType:</span>
                                  {items.bedType}
                                </p>
                              </div>
                              <div className="booking-card-details">
                                <div className="flex">
                                  <div>
                                    <span className="price">{items?.cost}</span>{" "}
                                    per room*
                                  </div>
                                  <div className="right-align">
                                    <button
                                      className="btn-primary"
                                      onClick={() => getPaymentLink(items)}
                                    >
                                      Book
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <p>You want to pay {bookingDetails.duration*PRICE_DETAILS[bookingDetails.roomTypes]}</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/success")}
                  >
                    Click here to pay 
                  </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
          </div>
          {/* {bookingDetails.adults != 0 &&
          bookingDetails.location.length != 0 &&
          bookingDetails.date != 0 &&
          (bookingDetails.hotelAmenities.length != 0 ||
            bookingDetails.roomAmenities.length != 0) ? (
            <div className="chat-bubble">
              <div className="botBubbleHotel">
                {!flag ? (
                  <ul style={{ display: "flex", gap: "20px", bottom: "50px" }}>
                    {rooms.map((items) => (
                      <li key={items?.roomId}>
                        <div className="wrapper">
                          <div className="booking-card-wrapper">
                            <div className="booking-card-content">
                              <div className="booking-card-description">
                                <h1>{hotels[0]?.branchName}</h1>
                                <p>
                                  <span>Room Type:</span>
                                  {items.type}
                                </p>
                                <p>
                                  <span>Persons:</span>adults-
                                  {bookingDetails.adults} and child-
                                  {bookingDetails.children}{" "}
                                </p>
                                <p>
                                  <span>BedType:</span>
                                  {items.bedType}
                                </p>
                              </div>
                              <div className="booking-card-details">
                                <div className="flex">
                                  <div>
                                    <span className="price">{items?.cost}</span>{" "}
                                    per room*
                                  </div>
                                  <div className="right-align">
                                    <button
                                      className="btn-primary"
                                      onClick={() => getPaymentLink(items)}
                                    >
                                      Book
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/success")}
                  >
                    Click here to pay
                  </button>
                )}
              </div>
            </div>
          ) : null} */}
        </div>
      </div>
      <Footer handleUserInput={handleUserInput} />
    </div>
  );
}

export default HomePage;
