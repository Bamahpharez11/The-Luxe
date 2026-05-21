export type Category = 'breakfast' | 'dessert'

export interface MenuItem {
  id: string
  name: string
  price: number
  priceNote?: string
  category: Category
  image: string
  includes: string[]
  tag?: string
  featured?: boolean
}

export interface AddOn {
  name: string
  price: number
  description?: string
}

export const menuItems: MenuItem[] = [
  // ── BREAKFAST COLLECTION ──────────────────────────────
  {
    id: 'mini-luxe-breakfast',
    name: 'Mini Luxe Breakfast',
    price: 18,
    category: 'breakfast',
    image: '/images/mini-luxe-breakfast.png',
    includes: [
      '2 Mini Pancakes',
      '1 Hash Brown',
      '1 Croissant',
      '1 Syrup Dip',
      '8 Pineapple Cubes',
      '1 Bunch Grapes',
      '5 Strawberries',
      '5 Blueberries',
      '1 Juice or Hot Chocolate',
    ],
  },
  {
    id: 'executive-brunch-box',
    name: 'Executive Brunch Box',
    price: 28,
    category: 'breakfast',
    image: '/images/executive-brunch-box.png',
    includes: [
      '2 Pancakes or 1 Waffle',
      '2 Sausages',
      '1 Hash Brown',
      '1 Croissant',
      '8 Pineapple Cubes',
      '1 Bunch Grapes',
      '6 Strawberries',
      '6 Blueberries',
      '1 Juice or Smoothie',
    ],
    tag: 'Popular',
  },
  {
    id: 'luxe-duo-brunch',
    name: 'Luxe Duo Brunch',
    price: 45,
    category: 'breakfast',
    image: '/images/luxe-duo-brunch.png',
    includes: [
      '2 Pancakes',
      '1 Waffle',
      '2 Sausages',
      '1 Hash Brown',
      '2 Croissants',
      '8 Pineapple Cubes',
      '1 Bunch Grapes',
      '6 Strawberries',
      '6 Blueberries',
      '1 Juice or Sparkling Drink',
    ],
    featured: true,
    tag: 'Best Value',
  },
  {
    id: 'signature-luxe-breakfast-tray',
    name: 'Signature Luxe Breakfast Tray',
    price: 65,
    priceNote: '$65+',
    category: 'breakfast',
    image: '/images/signature-luxe-breakfast-tray.png',
    includes: [
      '3 Pancakes',
      '2 Waffles',
      '3 Sausages',
      '2 Hash Browns',
      '2 Croissants',
      '2 Eggs (Scrambled)',
      '12 Pineapple Cubes',
      '1 Bunch Grapes',
      '8 Strawberries',
      '10 Blueberries',
      '1 Juice or Smoothie',
    ],
    tag: 'Signature',
    featured: true,
  },

  // ── DESSERT COLLECTION ────────────────────────────────
  {
    id: 'indulgence-box',
    name: 'Pink Indulgence Box',
    price: 20,
    category: 'dessert',
    image: '/images/indulgence-box.png',
    includes: [
      '8 Chocolate Covered Strawberries',
      '8 Pineapple Cubes',
      '1 Bunch Grapes',
      '1 Dipping Sauce',
    ],
  },
  {
    id: 'sweet-tooth-luxe-box',
    name: 'Sweet Tooth Luxe Box',
    price: 32,
    category: 'dessert',
    image: '/images/sweet-tooth-luxe-box.png',
    includes: [
      '6 Chocolate Covered Strawberries',
      '4 Cake Bites',
      '3 Cookies',
      '8 Pineapple Cubes',
      '1 Bunch Grapes',
      '1 Dipping Sauce',
    ],
    tag: 'Popular',
  },
  {
    id: 'signature-dessert-tray',
    name: 'Signature Dessert Tray',
    price: 50,
    priceNote: '$50+',
    category: 'dessert',
    image: '/images/signature-dessert-tray.png',
    includes: [
      '10 Chocolate Covered Strawberries',
      '4 Brownie Bites',
      '4 Cake Bites',
      '10 Pineapple Cubes',
      '1 Bunch Grapes',
      '2 Dipping Sauces',
    ],
    tag: 'Signature',
    featured: true,
  },
  {
    id: 'date-night-dessert-box',
    name: 'Date Night Dessert Box',
    price: 60,
    category: 'dessert',
    image: '/images/date-night-dessert-box.png',
    includes: [
      '8 Chocolate Covered Strawberries',
      '4 Brownie Bites',
      '8 Pineapple Cubes',
      '1 Bunch Grapes',
      '1 Dipping Sauce',
      '2 Mini Sparkling Drinks (Non-Alcoholic)',
    ],
    tag: 'Date Night',
    featured: true,
  },
  {
    id: 'girls-night-sweets-box',
    name: "Girls Night Sweets Box",
    price: 70,
    category: 'dessert',
    image: '/images/girls-night-sweets-box.png',
    includes: [
      '8 Chocolate Covered Strawberries',
      '6 Cake Bites',
      '4 Cookies',
      '10 Pineapple Cubes',
      '1 Bunch Grapes',
      '2 Dipping Sauces',
      '4 Cookies',
    ],
    tag: "Girls' Night",
  },
  {
    id: 'celebration-luxe-tray',
    name: 'Celebration Luxe Tray',
    price: 80,
    priceNote: '$80+',
    category: 'dessert',
    image: '/images/signature-dessert-tray.png', // reuse closest image
    includes: [
      '12 Chocolate Covered Strawberries',
      '6 Brownie Bites',
      '6 Cake Bites',
      '6 Cookies',
      '12 Pineapple Cubes',
      '1 Bunch Grapes',
      '2 Dipping Sauces',
    ],
    tag: 'Celebration',
    featured: true,
  },
]

export const addOns: AddOn[] = [
  { name: 'Extra Fruit Cup', price: 4, description: 'Berries, Grapes, Pineapple' },
  { name: 'Extra Sausage', price: 4, description: '2pcs' },
  { name: 'Extra Pancakes', price: 3, description: '2pcs' },
  { name: 'Extra Croissant', price: 3, description: '1pc' },
  { name: 'Extra Juice', price: 3 },
  { name: 'Yogurt Parfait', price: 4 },
]
