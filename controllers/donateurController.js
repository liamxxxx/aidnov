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
  @Description    Delete Donate
  @Route             /api/v1/Donate/:id (DELETE)
  @Access            private
*/
exports.deleteDonateur = asyncHandler(async (req, res, next) => {
  const donateurID = Donateur.findByIdAndDelete(req.params.id);
  if (!donateurID) return next(new ErrorHandler('Donateur not found', 401));
  res.status(200).json({
    status: 'success',
    message: 'Suppression effectué'
  });
});

/* -------------------------------------------------------------------------- */
/**
  @Description       Give all donations by campagne and the length of it
  @Route             /api/v1/Donate/:id (DELETE)
  @Access            private
*/
exports.getCampagneByDonate = asyncHandler(async(req, res, next) => {
  const totalSolde = await Donateur.aggregate([
    // First stage
    {
      $group: {
        _id: null,
        sommeTotal: { $sum: '$montant' },
        moyenneDonation: { $avg: '$montant' },
        nombreDonateur: {$sum: 1}
      }
    }
  ]);
  const donation = await Donateur.find({campagne: req.params.id});

  res.status(200).json({
    status: 'success',
    data: {
      Donations: donation,
      Stats: totalSolde,
    }
  });
});

/* -------------------------------------------------------------------------- */
/**
  @Description       Give last five donations by campagne
  @Route             /api/v1/Donate/:id (DELETE)
  @Access            private
*/
exports.getLastFiveDonate = asyncHandler(async(req, res, next) => {
  const campagneID = req.params.id;
  const lastFiveDonate = await Donateur.find({campagne: campagneID}).sort({createAt: -1}).limit(5);
  if (!lastFiveDonate) return next(new ErrorHandler('Not found', 401));
  res.status(200).json({
    status: 'success',
    data: {
      FiveLastDonate: lastFiveDonate,
    }
  })
});

exports.statsDonation = asyncHandler(async(req, res, next) => {
  const totalSolde = await Donateur.aggregate([
    // First stage
    {
      $group: {
        _id: null,
        sommeTotal: { $sum: '$montant' },
      }
     }
    // {
    //   $count: "nombreTotalDonateur"
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      Stats: totalSolde,
    }
  });
});
