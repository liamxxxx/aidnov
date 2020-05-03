const Donateur = require('../models/donateur');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
/**
  @Description  Create Donate
  @Route        /api/v1/camapgne (POST)
  @Access       private
*/
exports.createDonateur = asyncHandler(async (req, res) => {
  const { nom, prenoms, email, montant, campagne } = req.body;
  const createD = new Donateur({
    nom,
    prenoms,
    email,
    montant,
    campagne
  });
  await createD.save();
  res.status(201).json({
    status:'success',
    data: {
      donateur_cree: createD
    }
  });
});

/* -------------------------------------------------------------------------- */
/**
  @Description  Get all Donate
  @Route        /api/v1/Donate (GET)
  @Access       public
*/
exports.getAllDonateur = asyncHandler(async (req, res) => {
  const getDonateurs = await Donateur.find();
  res.status(200).json({
    status: 'success',
    data: {
      Donateurs: getDonateurs
    }
  });
});


/* -------------------------------------------------------------------------- */
/**
  @Description  Get Donate
  @Route        /api/v1/Donate/:id (GET)
  @Access       public
*/
exports.getDonateur = asyncHandler(async (req, res) => {
  const donateur = await Donateur.findById(req.params.id);
  if (!donateur) return next(new ErrorHandler('Donateur not found', 401));
  res.status(200).json({
    status: 'success',
    data: {
      Donateur: donateur
    }
  });
})

/* -------------------------------------------------------------------------- */
/** 
  @Description   Update Donate
  @Route         /api/v1/Donate/:id  (PUT/PATCH)
  @Access        private
*/
exports.updateDonateur = async (req, res) => {

}

/* -------------------------------------------------------------------------- */
/**
  @riptionription    Delete Donate
  @route             /api/v1/Donate/:id (DELETE)
  @Access            private
*/
exports.deleteDonateur = asyncHandler(async (req, res) => {
  const donateurID = Donateur.findByIdAndDelete(req.params.id);
  if (!donateurID) return next(new ErrorHandler('Donateur not found', 401));
  res.status(200).json({
    status: 'success',
    message: 'Suppression effectué'
  });
});