const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Tour = require('../models/tour')
const Booking = require('../models/booking')
const catchAsync = require('../utils/catch-async')
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory')
const User = require('../models/user')

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId)

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
  })

  // 3) Send session in response
  res.status(200).json({
    status: 'success',
    session,
  })
})

const createBookingCheckout = catchAsync(async (session) => {
  const tour = session.client_reference_id
  const user = (await User.findOne({ email: session.customer_email })).id
  const price = session.amount_total / 100

  await Booking.create({ tour, user, price })
})

exports.webhookCheckout = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object)
  }

  res.status(200).json({ received: true })
})

exports.getAllBookings = getAll(Booking)

exports.getBooking = getOne(Booking)

exports.createBooking = createOne(Booking)

exports.updateBooking = updateOne(Booking)

exports.deleteBooking = deleteOne(Booking)
