/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model'),
  Order = require('../api/order/order.model'),
  Poster = require('../api/poster/poster.model'),
  Room = require('../api/room/room.model'),
  mongoose = require('mongoose');

// will be used by dummy orders
var METHOD_TAKEAWAY = 'METHOD_TAKEAWAY';
var METHOD_DELIVERY = 'METHOD_DELIVERY';
// will be used by dummy orders
var STATUS_NEW_UNREAD = 'STATUS_NEW_UNREAD';
var STATUS_NEW = 'STATUS_NEW';
var STATUS_IN_PROGRESS = 'STATUS_IN_PROGRESS';
var STATUS_SHIPPED = 'STATUS_SHIPPED';
var STATUS_DELIVERED = 'STATUS_DELIVERED';
var STATUS_CANCELED = 'STATUS_CANCELED';

var userId1 = mongoose.Types.ObjectId();
var userId2 = mongoose.Types.ObjectId();
var userAdmin = mongoose.Types.ObjectId();
var roomId1 = mongoose.Types.ObjectId();
var roomId2 = mongoose.Types.ObjectId();
var roomId3 = mongoose.Types.ObjectId();
var roomId4 = mongoose.Types.ObjectId();
var roomId5 = mongoose.Types.ObjectId();
var roomId6 = mongoose.Types.ObjectId();
var roomId7 = mongoose.Types.ObjectId();
var roomId8 = mongoose.Types.ObjectId();
var roomId9 = mongoose.Types.ObjectId();

User.find({}).remove(function() {
  var dummyUsers = [{
    _id: userId1,
    provider: 'local',
    name: 'Test User1',
    email: 'test1@test.com',
    password: 'test1',
    active: false,
    expiration: Date.now()
  }, {
    _id: userId2,
    provider: 'local',
    name: 'Test User2',
    email: 'test2@test.com',
    password: 'test2',
    active: false,
    expiration: Date.now()
  }, {
    _id: userAdmin,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    active: false,
    expiration: Date.now()
  }];

  User.create(dummyUsers, function() {
    console.log('finished populating users');
  });
});

Order.find({}).remove(function() {
  var dummyOrders = [{
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_NEW_UNREAD,
    deliveryMethod: METHOD_TAKEAWAY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2015
    date: 1421859600000,
    status: STATUS_NEW_UNREAD,
    deliveryMethod: METHOD_DELIVERY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 15,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Item 2',
      quantity: 2,
      variant: 'M',
      unitPrice: 30,
      totalPrice: 60,
      preparationTime: 20,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId2.toString(),
    date: Date.now(),
    status: STATUS_NEW,
    deliveryMethod: METHOD_TAKEAWAY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Item 2',
      quantity: 2,
      variant: 'M',
      unitPrice: 20,
      totalPrice: 40,
      preparationTime: 5,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  },
  {
    userId: userId2.toString(),
    // order was made on 22 January 2015
    date: 1421859600000,
    status: STATUS_NEW,
    deliveryMethod: METHOD_TAKEAWAY,
    restaurant: {
      name: 'ABCD Restaurant',
      address: '900 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum restaurant'
    },
    shipping: {
      fullname: 'Jennifer Millian',
      address: '500 Google Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum shipping notes' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Item 2',
      quantity: 2,
      variant: 'M',
      unitPrice: 20,
      totalPrice: 40,
      preparationTime: 5,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    date: Date.now(),
    status: STATUS_NEW,
    deliveryMethod: METHOD_DELIVERY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 16,
      tax: {
        percentage: 0.15,
        value: 15
      }
    }, {
      name: 'Item 2',
      quantity: 3,
      variant: 'M',
      unitPrice: 20,
      totalPrice: 60,
      preparationTime: 20,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    date: Date.now(),
    status: STATUS_CANCELED,
    deliveryMethod: METHOD_DELIVERY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Item 2',
      quantity: 3,
      variant: 'M',
      unitPrice: 20,
      totalPrice: 60,
      preparationTime: 10,
      tax: {
        percentage: 0.15,
        value: 15
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    date: Date.now(),
    status: STATUS_DELIVERED,
    deliveryMethod: METHOD_DELIVERY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Item 2',
      quantity: 2,
      variant: 'M',
      unitPrice: 30,
      totalPrice: 60,
      preparationTime: 15,
      tax: {
        percentage: 0.15,
        value: 15
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }];

  Order.create(dummyOrders, function() {
    console.log('finished populating orders');
  });
});

Poster.find({}).remove(function() {
  var dummyPosters = [{
    title: 'Quantitative Urine Toxicology Can Help in Improving Compliance and Opioid Dose Adjustment in Chronic Pain Patients',
    presentationType: 'MCC',
    code: 'MCC-01',
    room: roomId1.toString(),
    monitor: 0,
    startDate: 1430157600000,
    duration: 300000,
    createdBy: userId1.toString(),
    createdAt: 1424165760000,
    modifiedAt:1424165796860
  }, {
    title: 'Changes in RNA Expression in Patients With Chronic Pain After Total Knee Replacement',
    presentationType: 'Poster discussion',
    code:'PP-01',
    room: roomId2.toString(),
    monitor: 0,
    startDate: 1430157600000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1424163760000,
    modifiedAt:1424164796860
  }, {
    title: 'An International Survey to Understand Infection Control Practices for Neuromodulation',
    presentationType: 'Poster discussion',
    code:'PP-02',
    room: roomId1.toString(),
    monitor: 1,
    startDate: 1430157600000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1424063760000,
    modifiedAt:1424074796860
  }, {
    title: 'Outcome of Percutaneous Lumbar Synovial Cyst Rupture in Patients with Lumbar Radiculopathy: A Case Series',
    presentationType: 'MCC',
    code:'MCC-02',
    room: roomId2.toString(),
    monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1423063760000,
    modifiedAt:1424074706860
  }, {
    title: 'Prolonged Relief of Chronic Extreme PTSD and Depression Symptoms in Veterans Following a Stellate Ganglion Block',
    presentationType: 'MCC',
    code:'MCC-03',
    room: roomId3.toString(),
    monitor: 0,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1423063660000,
    modifiedAt:1424074716860
  }, {
    title: 'Time to Cessation of Postoperative Opioids: A National-level Cross-sectional Analysis of the Veterans Affairs Healthcare System',
    presentationType: 'Poster discussion',
    code:'PP-03',
    room: roomId3.toString(),
    monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1423063870000,
    modifiedAt:1424074786860
  }, {
    title: 'Systematic Review and Meta-Analysis of Comparative Studies for Lumbosacral Radicular Pain: Transforaminal Versus Interlaminar Approaches to Epidural Steroid Injections',
    presentationType: 'Poster discussion',
    code:'PP-04',
    room: roomId1.toString(),
    monitor: 1,
    startDate: 1430156500000,
    duration: 300000,
    createdBy: userId1.toString(),
    createdAt: 1423063770900,
    modifiedAt:1424074786899
  }, {
    title: 'Goal-Directed Fluid Therapy With Closed-loop Assistance During Moderate Risk Surgery Using Noninvasive Cardiac Output Monitoring',
    presentationType: 'Poster discussion',
    code:'PP-05',
    room: roomId1.toString(),
    monitor: 0,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1423063769999,
    modifiedAt:1424074779999
  }, {
    title: 'A Randomized Study Comparing a Novel Needle Guidance Technology for Cannulation of a Simulated Internal Jugular Vein',
    presentationType: 'Poster discussion',
    code:'PP-06',
    room: roomId2.toString(),
    monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1423063777000,
    modifiedAt:1424074799860
  }, {
    title: 'Response to Noxious Stimuli During Closed-Loop Controlled Propofol Anesthesia at Different Remifentanil Effect Site Concentrations',
    presentationType: 'Poster discussion',
    code:'PP-07',
    room: roomId3.toString(),
    monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: userId1.toString(),
    createdAt: 1423064760000,
    modifiedAt:1424074999999
  }];

  Poster.create(dummyPosters, function() {
    console.log('finished populating posters');
  });
});

Room.find({}).remove(function() {
  var dummyRooms = [{
    _id: roomId1,
    title: 'MCC - Monday morning',
    roomName: 'Hall A',
    body: 'Body room 1',
    createdBy: userId1.toString(),
    createdAt: 1424161760000,
    modifiedAt:1424161999987,
    availability : [{
            startDate : 1441609200000,
            endDate : 1441620000000
        }],
    monitors: [{
            title: "Monitor 1-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 1-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 1-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 1-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 1-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 1-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 1-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 1-8",
            body: "Body monitor 8"
    } ]
  }, {
    _id: roomId2,
    title: 'MCC - Monday evening',
    roomName: 'Hall A',
    body: 'Body room 2',
    createdBy: userId1.toString(),
    createdAt: 1424061760000,
    modifiedAt:1424091999987,
    availability : [{
            startDate : 1441630800000,
            endDate : 1441638000000
        }],
    monitors: [{
            title: "Monitor 2-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 2-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 2-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 2-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 2-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 2-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 2-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 2-8",
            body: "Body monitor 8"
    }]
  }, {
    _id: roomId3,
    title: 'Electronic Posters - Monday morning',
    roomName: 'Hall B',
    body: 'Body room 3',
    createdBy: userId1.toString(),
    createdAt: 1424061860000,
    modifiedAt:1424092999987,
    availability : [{
            startDate : 1441609200000,
            endDate : 1441620000000
        }],
    monitors: [{
            title: "Monitor 3-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 3-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 3-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 3-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 3-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 3-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 3-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 3-8",
            body: "Body monitor 8"
    } ]
    }, {
    _id: roomId4,
    title: 'Electronic Posters - Monday morning',
    roomName: 'Hall C',
    body: 'Body room 4',
    createdBy: userId1.toString(),
    createdAt: 1430417621000,
    modifiedAt:1430418621000,
    availability : [{
            startDate : 1441630800000,
            endDate : 1441638000000
        }],
    monitors: [{
            title: "Monitor 4-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 4-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 4-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 4-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 4-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 4-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 4-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 4-8",
            body: "Body monitor 8"
    }]
  }, {
    _id: roomId5,
    title: 'Poster Discussion - Monday morning',
    roomName: 'Room 101',
    body: 'Body room 5',
    createdBy: userId1.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    availability : [{
            startDate : 1441609200000,
            endDate : 1441620000000
        }],
    monitors: [{
            title: "Monitor 5-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 5-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 5-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 5-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 5-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 5-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 5-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 5-8",
            body: "Body monitor 8"
    }]
  }, {
    _id: roomId6,
    title: 'MCC - Tuesday morning',
    roomName: 'Hall A',
    body: 'Body room 6',
    createdBy: userId1.toString(),
    createdAt: 1430485509000,
    modifiedAt:1430419999000,
    availability : [{
            startDate : 1441695600000,
            endDate : 1441706400000
        }],
    monitors: [{
            title: "Monitor 6-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 6-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 6-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 6-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 6-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 6-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 6-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 6-8",
            body: "Body monitor 8"
    }]
  }, {
    _id: roomId7,
    title: 'MCC - Tuesday evening',
    roomName: 'Hall A',
    body: 'Body room 7',
    createdBy: userId1.toString(),
    createdAt: 1430564759000,
    modifiedAt:1430565859000,
    availability : [{
            startDate : 1441717200000,
            endDate : 1441724400000
        }],
    monitors: [{
            title: "Monitor 7-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 7-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 7-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 7-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 7-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 7-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 7-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 7-8",
            body: "Body monitor 8"
    }]
  }, {
    _id: roomId8,
    title: 'Electronic Posters - Tuesday morning',
    roomName: 'Hall B',
    body: 'Body room 8',
    createdBy: userId1.toString(),
    createdAt: 1430580092000,
    modifiedAt:1430581992000,
    availability : [{
            startDate : 1441695600000,
            endDate : 1441706400000
        }],
    monitors: [{
            title: "Monitor 8-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 8-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 8-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 8-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 6-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 8-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 8-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 8-8",
            body: "Body monitor 8"
    }]
  }, {
    _id: roomId9,
    title: 'Poster Discussion - Tuesday morning',
    roomName: 'Room 101',
    body: 'Body room 9',
    createdBy: userId1.toString(),
    createdAt: 1430590092000,
    modifiedAt: 1430590792000,
    availability : [{
            startDate : 1441695600000,
            endDate : 1441706400000
        }],
    monitors: [{
            title: "Monitor 9-1",
            body: "Body monitor 1"
    }, {
            title: "Monitor 9-2",
            body: "Body monitor 2"
    }, {
            title: "Monitor 9-3",
            body: "Body monitor 3"
    }, {
            title: "Monitor 9-4",
            body: "Body monitor 4"
    }, {
            title: "Monitor 9-5",
            body: "Body monitor 5"
    }, {
            title: "Monitor 9-6",
            body: "Body monitor 6"
    }, {
            title: "Monitor 9-7",
            body: "Body monitor 7"
    }, {
            title: "Monitor 9-8",
            body: "Body monitor 8"
    }]
  } ];

  Room.create(dummyRooms, function() {
    console.log('finished populating rooms');
  });
});
