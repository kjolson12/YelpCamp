const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            author: '601b72100d01a212059defd5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur recusandae ea temporibus similique cumque quod ducimus soluta, quos ab cupiditate aliquid ipsam quidem maiores ad placeat impedit labore repellat commodi.',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dbjkn8jxg/image/upload/v1612554292/YelpCamp/bdwntnievo3toojhwxsw.jpg',
                    filename: 'YelpCamp/bdwntnievo3toojhwxsw'
                },
                {
                    url: 'https://res.cloudinary.com/dbjkn8jxg/image/upload/v1612554294/YelpCamp/qpjizgx1dqjzfr5n5ova.jpg',
                    filename: 'YelpCamp/qpjizgx1dqjzfr5n5ova'
                },
                {
                    url: 'https://res.cloudinary.com/dbjkn8jxg/image/upload/v1612554298/YelpCamp/h1qpjxyhyjbqzzmx7hyv.jpg',
                    filename: 'YelpCamp/h1qpjxyhyjbqzzmx7hyv'
                }
            ]
        });
        await c.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});