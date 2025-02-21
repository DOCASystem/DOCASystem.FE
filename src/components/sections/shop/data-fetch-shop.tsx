export const products = [
  {
    id: 1,
    name: "Thức ăn cho mèo - Whiskas 1.2kg",
    price: 120000,
    category: "Đồ ăn cho mèo",
  },
  {
    id: 2,
    name: "THỨC ĂN CHO CHÓ CON Ganador Puppy 400g",
    price: 50000,
    category: "Đồ ăn cho chó",
  },
  {
    id: 3,
    name: "Combo 2 túi Đồ Ăn Hạt Me-O",
    price: 50000,
    category: "Đồ ăn cho mèo",
  },
  {
    id: 4,
    name: "Reflex plus thức ăn hạt 1.5kg",
    price: 177000,
    category: "Đồ ăn cho mèo",
  },
  {
    id: 5,
    name: "1.3Kg hạt cho mèo MININO TUNA",
    price: 103000,
    category: "Đồ ăn cho mèo",
  },
  {
    id: 6,
    name: "Bánh thưởng nhiều vị Temptations MixUps",
    price: 130000,
    category: "Snack cho mèo",
  },
];

export const fetchProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
};
