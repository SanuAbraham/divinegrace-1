//import bcrypt from 'bcryptjs';
const data = {
    
    users: [
    {
        name: 'Basir',
        email: 'admin@example.com',
  //      password: bcrypt.hashSync('123456'),
        password: '123456',
        isAdmin: true,
    },
    {
        name: 'John',
        email: 'user@example.com',
//        password: bcrypt.hashSync('123456'),
        password: '123456',
        isAdmin: false,
    },
    ],

    products: [
        {
            name: 'Residential Retreat',
            slug: 'residential-retreat',
            category: 'Retreats',
            image: '/images/divinemercy.jpg',
            price: 120,
            countInStock: 10,
            brand: 'USA',
            rating: 4.5,
            numReviews: 10,
            description: 'Miami Residential Retreat'
        },
        {
            name: 'Michigan Retreat',
            slug: 'michigan-retreat',
            category: 'Retreats',
            image: '/images/rosamysticamother.jpg',
            price: 120,
            countInStock: 14,
            brand: 'USA',
            rating: 4.5,
            numReviews: 10,
            description: 'Michigan One Day Retreat'
        },
        {
            name: 'Arizona One Day Retreat',
            slug: 'arizona-one-day-retreat',
            category: 'Retreats',
            image: '/images/tencommandments.jpg',
            price: 120,
            countInStock: 0,
            brand: 'USA',
            rating: 4.5,
            numReviews: 10,
            description: 'Arizona One Day Retreat'
        },
        {
            name: 'Houston Charismatic Center',
            slug: 'houston-charismatic-enter',
            category: 'Retreats',
            image: '/images/stmichaelprayer.jpg',
            price: 120,
            countInStock: 10,
            brand: 'USA',
            rating: 4.5,
            numReviews: 10,
            description: 'Houston Charismatic Center'
        }
    ]
}

export default data;