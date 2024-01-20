const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catch-async')

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new AppError(404, `Document with id ${req.params.id} not found`))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  })