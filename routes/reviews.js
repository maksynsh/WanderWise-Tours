const express = require('express')

const { USER_ROLES } = require('../constants/user')

const { protect, restrictTo } = require('../controllers/auth')

const { getAllReviews, createReview, deleteReview } = require('../controllers/review')

const router = express.Router({ mergeParams: true })

// POST /reviews
// or POST /tours/:tourId/reviews (because we added nested routes in toursRouter)

router.route('/').get(protect, getAllReviews).post(protect, restrictTo(USER_ROLES.USER), createReview)

router.route('/:id').delete(protect, restrictTo(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN), deleteReview)

module.exports = router