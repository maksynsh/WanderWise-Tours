const Review = require('../models/review')
const APIFeatures = require('../utils/api-features')
const catchAsync = require('../utils/catch-async')
const { deleteOne } = require('./handlerFactory')

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter
  if (req.params.tourId) filter = { tour: req.params.tourId }

  const { query } = new APIFeatures(Review.find(filter), req.query).filter().sort().limitFields().paginate()
  const reviews = await query

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: {
      reviews,
    },
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id

  const review = await Review.create(req.body)

  res.status(201).json({
    status: 'success',
    data: { review },
  })
})

exports.deleteReview = deleteOne(Review)