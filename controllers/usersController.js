const User = require('../models/utilisateur');
const asyncHandler = require('../utils/asyncHandler');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/* -------------------------------------------------------------------------- */
/**
  @Description  Get all User
  @Route        /api/v1/User (GET)
  @Access       public
*/
exports.getAllUsers = async (req, res) => {
  try {
    const resultUsersGet = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        users: resultUsersGet
      }
    });
  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: 'An error occured'
    });
  }
}

/* -------------------------------------------------------------------------- */
/**
  @Description  Get User
  @Route        /api/v1/User/:id (GET)
  @Access       public
*/
exports.getUser = async (req, res) => {

}

/* -------------------------------------------------------------------------- */
/** 
  @Desc   Update User
  @Route  /api/v1/User/:id  (PUT/PATCH)
  @Access private
*/
exports.updateMe = asyncHandler (async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'nom', 'prenoms', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });

})

/* -------------------------------------------------------------------------- */
/**
  @Desc    Delete User
  @route   /api/v1/User/:id (DELETE)
  @Access  private
*/
exports.deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});