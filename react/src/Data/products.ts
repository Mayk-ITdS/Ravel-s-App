import boleroVinyl from "../assets/bolero-vinyl.jpg";

const products = [
  {
    id: 1,
    name: "Ravel - Bolero (Winyl)",
    description: "Limitowana edycja winylowa z klasyką Ravela.",
    price: 99.99,
    image: boleroVinyl,
    category: "vinyl",
  },
  {
    id: 2,
    name: "Koszulka Ravel",
    description: "Bawełniana koszulka z wizerunkiem Ravela.",
    price: 49.99,
    image: "/assets/products/ravel-tshirt.jpg",
    category: "merch",
  },
  {
    id: 3,
    name: "Bilet na koncert Ravela",
    description: "Wejściówka na koncert symfoniczny w Paryżu.",
    price: 129.99,
    image: "/assets/products/ravel-ticket.jpg",
    category: "tickets",
  },
  {
    id: 4,
    name: "Partytura - Daphnis et Chloé",
    description: "Oryginalna partytura baletu Daphnis et Chloé.",
    price: 79.99,
    image: "/assets/products/daphnis-score.jpg",
    category: "scores",
  },
];

export default products;
