const l1FilterConfig = {
    attractions: {
        title: 'Filter by Attractions',
        icon: 'fa-star',
        dataKey: 'attractions'
    },
    connectivity: {
        title: 'Filter by Connectivity',
        icon: 'fa-train-subway',
        dataKey: 'connectivity'
    },
    amenities: {
        title: 'Filter by Amenities',
        icon: 'fa-martini-glass-citrus',
        dataKey: 'amenities'
    },
    culture: {
        title: 'Filter by Culture & Vibe',
        icon: 'fa-users',
        dataKey: 'cultureAndVibe'
    }
};

const filterConfig = {
    starRating: [
        { label: '5 Star', value: 5 },
        { label: '4 Star', value: 4 },
        { label: '3 Star', value: 3 }
    ],
    propertyType: ['Hotel', 'Villa', 'Homestay'],
    userRating: [
        { label: 'Excellent: 4.2+', value: 4.2 },
        { label: 'Very Good: 3.5+', value: 3.5 },
        { label: 'Good: 3.0+', value: 3.0 }
    ],
    amenities: ['Wi-Fi', 'Swimming Pool', 'Spa', 'Gym', 'Bar', 'Rooftop Pool', 'Jacuzzi', 'Breakfast Included', 'Free Cancellation']
};

const propertyData = {
    1: { 
        name: 'York Hotel Singapore', 
        price: '15420', 
        rating: 4.3, 
        reviews: 1205, 
        img: 'assets/york_hotel_singapore.png', 
        tags: ['Orchard', 'Swimming Pool', 'Gym', 'Book with ₹0 Payment'], 
        desc: 'Hotel with a Jacuzzi, outdoor pool & a poolside bar', 
        x: 25, y: 40, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=201201221114278651&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.30709&lng=103.83547&locusId=CTSINGAP&locusType=city&rank=9&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    2: { 
        name: 'V Hotel Lavender Singapore', 
        price: '18960', 
        rating: 3.7, 
        reviews: 2370, 
        img: 'assets/v_hotel_lavender.png', 
        tags: ['Little India', 'Indian Veg Food', 'Swimming Pool', 'Gym', 'Book with ₹0 Payment'], 
        desc: 'Offers rooftop dining with pool access & Indian delicacies', 
        x: 55, y: 60, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=201201061057166374&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.30781&lng=103.86276&locusId=CTSINGAP&locusType=city&rank=5&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    3: { 
        name: 'Novotel Singapore on Kitchener', 
        price: '29631', 
        rating: 4.1, 
        reviews: 1445, 
        img: 'assets/novotel_singapore_kitchener.png', 
        tags: ['Little India', 'Indian Veg Food', 'Swimming Pool', 'Gym'], 
        desc: '20% discount included on 2 nights stay', 
        x: 60, y: 65, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=201708291323461832&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.31082&lng=103.85592&locusId=CTSINGAP&locusType=city&rank=6&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    4: { 
        name: 'Hotel Boss Singapore', 
        price: '17555', 
        rating: 3.8, 
        reviews: 3973, 
        img: 'assets/hotel_boss_singapore.png', 
        tags: ['Little India', 'Indian Veg Food', 'Swimming Pool', 'Book with ₹0 Payment'], 
        desc: 'Centrally located hotel with MRT access, Indian food & a pool', 
        x: 58, y: 58, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=20160331155040970&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.30543&lng=103.86026&locusId=CTSINGAP&locusType=city&rank=3&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    5: { 
        name: 'Holiday Inn Singapore Atrium', 
        price: '26081', 
        rating: 4.3, 
        reviews: 1307, 
        img: 'assets/holiday_inn_atrium.png', 
        tags: ['Bukit Merah', 'Indian Veg Food', 'Rooftop Pool', 'Gym', 'Free Cancellation', 'Book with ₹0 Payment', 'Sponsored'], 
        desc: 'Boasts Cantonese dining experience & a tennis court', 
        x: 70, y: 80, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=4190725563791780&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.28901&lng=103.8342&locusId=CTSINGAP&locusType=city&rank=16&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    6: { 
        name: 'The Serangoon House, a Marriott Tribute Portfolio Hotel', 
        price: '42568', 
        rating: 4.1, 
        reviews: 91, 
        img: 'assets/serangoon_house_marriott.png', 
        tags: ['Little India', 'Bar', 'Free Cancellation', 'Book with ₹0 Payment', 'Sponsored'], 
        desc: 'Close to tourist spots, It offers 2 on-site Indian restaurants', 
        x: 45, y: 50, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=202212191258085278&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.31135&lng=103.85476&locusId=CTSINGAP&locusType=city&rank=44&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    7: { 
        name: 'Holiday Inn Express Singapore Serangoon', 
        price: '21948', 
        rating: 4.2, 
        reviews: 809, 
        img: 'assets/holiday_inn_express_serangoon.png', 
        tags: ['Little India', 'Indian Veg Food', 'Gym', 'Breakfast Included'], 
        desc: 'One of the preferred hotels in the city', 
        x: 48, y: 55, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=202006151400218313&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.31018&lng=103.85865&locusId=CTSINGAP&locusType=city&rank=17&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    8: { 
        name: 'Tai Hoe Hotel', 
        price: '7937', 
        rating: 3.6, 
        reviews: 537, 
        img: 'assets/tai_hoe_hotel.png', 
        tags: ['Little India', 'Book with ₹0 Payment'], 
        desc: 'Budget-friendly hotel located in the vibrant Little India district.', 
        x: 80, y: 20, 
        propertyType: 'Hotel', 
        starRating: 2,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=4190725563806551&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.31035&lng=103.85653&locusId=CTSINGAP&locusType=city&rank=11&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    9: { 
        name: 'Hilton Garden Inn Singapore Serangoon', 
        price: '28308', 
        rating: 4.2, 
        reviews: 1848, 
        img: 'assets/hilton_garden_inn_serangoon.png', 
        tags: ['Little India', 'Indian Veg Food', 'Swimming Pool', 'Gym', 'Book with ₹0 Payment', 'Sponsored'], 
        desc: 'Great location and delicious Indian cuisine at the property', 
        x: 52, y: 53, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details?hotelId=201210241534203088&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.30824&lng=103.85193&locusId=CTSINGAP&locusType=city&rank=38&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    10: { 
        name: 'Hotel 81 Elegance', 
        price: '8521', 
        rating: 3.3, 
        reviews: 813, 
        img: 'assets/hotel_81_elegance.png', 
        tags: ['Little India', 'Bar', 'Book with ₹0 Payment'], 
        desc: 'Offering 40+ budget stays in singapore', 
        x: 75, y: 25, 
        propertyType: 'Hotel', 
        starRating: 2,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=4190725563806276&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.31245&lng=103.86025&locusId=CTSINGAP&locusType=city&rank=13&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    11: { 
        name: 'One Farrer Hotel', 
        price: '23010', 
        rating: 4.4, 
        reviews: 1774, 
        img: 'assets/one_farrer_hotel.png', 
        tags: ['Little India', 'Spa', 'Rooftop Pool', 'Gym', 'Book with ₹0 Payment', 'MMT Luxe'], 
        desc: 'Has an Olympic-sized pool & an award-winning collection of art', 
        x: 50, y: 48, 
        propertyType: 'Hotel', 
        starRating: 5,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=317511410340785&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.31255&lng=103.85437&locusId=CTSINGAP&locusType=city&rank=14&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&viewType=LUXE&mtkeys=undefined'
    },
    12: { 
        name: 'Village Hotel Albert Court by Far East Hospitality', 
        price: '22692', 
        rating: 4.1, 
        reviews: 1963, 
        img: 'assets/village_hotel_albert_court.png', 
        tags: ['Rochor', 'Indian Veg Food', 'Gym', 'Free Cancellation', 'Book with ₹0 Payment'], 
        desc: 'Vintage-style hotel offering 4 restaurants, including Indian cuisine', 
        x: 40, y: 30, 
        propertyType: 'Hotel', 
        starRating: 4,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=201901241343458174&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.30412&lng=103.85092&locusId=CTSINGAP&locusType=city&rank=7&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&mtkeys=undefined'
    },
    13: { 
        name: 'Amara Sanctuary Resort Sentosa', 
        price: '22420', 
        rating: 4.1, 
        reviews: 1073, 
        img: 'assets/amara_sanctuary_sentosa.png', 
        tags: ['Sentosa Island', 'Spa', 'Swimming Pool', 'Gym', 'Book with ₹0 Payment', 'MMT Luxe'], 
        desc: 'An island resort with 4 outdoor pools & a tennis court', 
        x: 15, y: 85, 
        propertyType: 'Villa', 
        starRating: 5,
        url: 'https://www.makemytrip.com/hotels/hotel-details/?hotelId=201710311828454544&_uCurrency=INR&checkin=10012025&checkout=10042025&city=CTSINGAP&country=SGP&lat=1.25208&lng=103.82216&locusId=CTSINGAP&locusType=city&rank=8&reference=hotel&roomStayQualifier=2e0e&rsc=1e2e0e&searchText=Singapore&type=city&viewType=LUXE&mtkeys=undefined'
    }
};

const poiData = {
    attractions: {
        'Gardens by the Bay': { x: 30, y: 28, icon: 'fa-tree', radius: 10 },
        'Marina Bay Sands': { x: 28, y: 45, icon: 'fa-building-columns', radius: 8 },
        'Sentosa Island': { x: 15, y: 85, icon: 'fa-umbrella-beach', radius: 12 },
        'Singapore Zoo': { x: 72, y: 32, icon: 'fa-hippo', radius: 9 }
    },
    connectivity: { 
        'Changi Airport': [
            { x: 92, y: 40, icon: 'fa-plane-departure', radius: 5 }
        ], 
        'MRT Station': [
            { x: 40, y: 40, icon: 'fa-train-subway', radius: 5 },
            { x: 45, y: 50, icon: 'fa-train-subway', radius: 5 },
            { x: 50, y: 60, icon: 'fa-train-subway', radius: 5 },
            { x: 55, y: 70, icon: 'fa-train-subway', radius: 5 },
            { x: 60, y: 80, icon: 'fa-train-subway', radius: 5 }
        ] 
    },
    amenities: { 
        'Food & Drinks': { points: [
            { x: 28, y: 35, radius: 6 }, 
            { x: 68, y: 68, radius: 6 }
        ], icon: 'fa-utensils' }, 
        'Shopping': { points: [
            { x: 52, y: 50, radius: 7 }, 
            { x: 78, y: 25, radius: 6 }
        ], icon: 'fa-bag-shopping' }, 
        'Parks & Gardens': { points: [
            { x: 20, y: 50, radius: 8 }
        ], icon: 'fa-tree' } 
    },
    cultureAndVibe: {
        'Family Friendly': { x: 18, y: 80, icon: 'fa-child-reaching', radius: 15 },
        'Veg or Jain Food Hub': { x: 55, y: 62, icon: 'fa-seedling', radius: 10 },
        'Quiet & Relaxed': { x: 70, y: 35, icon: 'fa-person-praying', radius: 12 },
        'Nightlife Hotspot': { x: 25, y: 55, icon: 'fa-martini-glass', radius: 10 }
    }
};

const mockEventData = { 
    'Music Concert': { x: 75, y: 40, icon: 'fa-music', radius: 10 }, 
    'Food Festival': { x: 48, y: 68, icon: 'fa-burger', radius: 12 } 
};