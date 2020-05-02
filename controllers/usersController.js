const User = require('../models/users');

/**
  @Description  Create User
  @Route        /api/v1/User (POST)
  @Access       private
*/
exports.createUser = async (req, res) => {
  const { nom, prenoms, email, password, passwordConfirm, numero } = req.body;
  const resultUsersCreate = new User({
    nom,
    prenoms,
    email,
    password,
    passwordConfirm,
    numero
  });

  await resultUsersCreate.save();

  res.status(200).json({
    status: 'success',
    data: {
      users: resultUsersCreate
    }
  });
}

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
exports.updateUser = async (req, res) => {

}

/* -------------------------------------------------------------------------- */
/**
  @Desc    Delete User
  @route   /api/v1/User/:id (DELETE)
  @Access  private
*/
exports.deleteUser = async (req, res) => {

}