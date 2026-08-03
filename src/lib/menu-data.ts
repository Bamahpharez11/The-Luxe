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
      '6 Pancakes or 6 Waffles',
      '2 Croissants',
      'Grapes, Strawberries, Pineapples and Berries',
      'Juice Bottle (Apple, Pineapple or Orange Juice) Freshly Squeezed',
    ],
  },
  {
    id: 'luxe-duo-brunch',
    name: 'Luxe Duo Brunch',
    price: 30,
    category: 'breakfast',
    image: '/images/executive-brunch-box.png', // using existing image, but maybe we should use luxe-duo-brunch image? The previous Luxe Duo Brunch used /images/luxe-duo-brunch.png. Let's use that.
    includes: [
      '8 Pancakes or 8 Waffles',
      '4 Croissants',
      '4 Hashbrowns',
      'Grapes, Strawberries, Pineapples and Berries',
      'Juice Bottle (Apple, Pineapple or Orange) Freshly Juiced',
      '4 Sausages',
    ],
    tag: 'Best Value',
    featured: true,
  },
  {
    id: 'signature-luxe-breakfast-tray',
    name: 'Signature Luxe Breakfast Tray',
    price: 50,
    category: 'breakfast',
    image: '/images/signature-luxe-breakfast-tray.png',
    includes: [
      '10 Pancakes',
      '4 Croissants',
      '5 Waffles',
      '5 Hashbrowns',
      '6 Sausages',
      'Scrambled Eggs',
      'Grapes, Pineapples, Strawberries and Blueberries',
      '2 Juice Bottles (Apple, Orange or Pineapple) Freshly Juiced',
      'Yogurt',
    ],
    tag: 'Signature',
    featured: true,
  },

  // ── DESSERT COLLECTION ────────────────────────────────
  {
    id: 'pink-indulgence-box',
    name: 'Pink Indulgence Box',
    price: 25,
    category: 'dessert',
    image: '/images/indulgence-box.png',
    includes: [
      '6 Chocolate Covered Strawberries (White or Milk Chocolate)',
      'Pineapple Cubes',
      'Grapes',
      'Dipping Sauce',
    ],
  },
  {
    id: 'sweet-tooth-luxe-box',
    name: 'Sweet Tooth Luxe Box',
    price: 35,
    category: 'dessert',
    image: '/images/sweet-tooth-luxe-box.png',
    includes: [
      '6 Chocolate Covered Strawberries (White or Milk Chocolate)',
      '3 Cake Bites',
      '3 Cookies',
      'Pineapple Cubes',
      'Grapes',
      'Dipping Sauce',
    ],
    tag: 'Popular',
  },
  {
    id: 'date-night-dessert-box',
    name: 'Date Night Dessert Box',
    price: 50,
    category: 'dessert',
    image: '/images/date-night-dessert-box.png',
    includes: [
      '8 Chocolate Covered Strawberries (White or Milk Chocolate)',
      '4 Cake Bites',
      '4 Cookies',
      'Pineapple Cubes',
      'Grapes',
      '2 Mini Champagne Bottles (Non-Alcoholic)',
    ],
    tag: 'Date Night',
    featured: true,
  },
]

export const addOns: AddOn[] = [
  { name: 'Extra Fruit Cup', price: 4, description: 'Berries or Grapes or Pineapple' },
  { name: 'Extra Sausage', price: 3, description: '2pcs' },
  { name: 'Extra Pancakes', price: 3, description: '2pcs' },
  { name: 'Extra Croissant', price: 2, description: '1pc' },
  { name: 'Extra Juice', price: 4, description: '1 bottle (Orange, Pineapple or Apple)' },
  { name: 'Yogurt Parfait', price: 5 },
]
