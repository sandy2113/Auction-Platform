export const AUCTION_ITEMS = [
    {
      id: "1",
      name: 'iPhone 15 Pro Max',
      currentBid: 1200,
      timeRemaining: '12m 4s',
      status: 'Live',
      image: 'https://m.media-amazon.com/images/I/81CgtwSII3L._UF1000,1000_QL80_.jpg',
      bids: [
        { amount: 1100, user: 'Alice', time: new Date('2025-07-09T09:00:00') },
        { amount: 1150, user: 'Bob', time: new Date('2025-07-09T09:05:00') },
        { amount: 1200, user: 'Charlie', time: new Date('2025-07-09T09:10:00') }
      ]
    },
    {
      id: "2",
      name: 'MacBook Pro',
      currentBid: 2000,
      timeRemaining: '20m 30s',
      status: 'Upcoming',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRik0RVOGYTRci9KdSUu1XI5qRTubeApNfv0NlluWaMQEdCyUvCfAmNw8KLp9MgzijXOYs&usqp=CAU',
      bids: []
    },
    {
      id: "3",
      name: 'Samsung Galaxy S23 Ultra',
      currentBid: 1100,
      timeRemaining: '13m',
      status: 'Live',
      image: 'https://m.media-amazon.com/images/I/71lD7eGdW-L._UF1000,1000_QL80_.jpg',
      bids: [
        { amount: 1000, user: 'David', time: new Date('2025-07-09T09:15:00') },
        { amount: 1050, user: 'Eva', time: new Date('2025-07-09T09:18:00') },
        { amount: 1100, user: 'Frank', time: new Date('2025-07-09T09:22:00') }
      ]
    }
  ];
  