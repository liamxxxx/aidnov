const Campagne = require('../models/campagne');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

/**
  @Description  Create campagne
  @Route        /api/v1/camapgne (POST)
  @Access       private
*/
exports.createCampagne = asyncHandler(async (req, res, next) => {
  const {
    nomCampagne, 
    typeCampagne, 
    montantDemande, 
    raison, 
    photo,
    } = req.body;

  const campagne = new Campagne({
    user: req.body.user, 
    nomCampagne, 
    typeCampagne, 
    montantDemande, 
    raison, 
    photo
  });

  await campagne.save();

  res.status(201).json({
      status: 'success',
      data: {
        campagne: campagne
      }
    });
});

/* -------------------------------------------------------------------------- */
/**
  @Description  Get all campagne
  @Route        /api/v1/campagne (GET)
  @Access       public
*/
exports.getAllCampagne = asyncHandler(async (req, res) => { 
    const result = await Campagne.find();
    res.status(200).json({
      status: 'success',
      data: {
        campagnes: result
      }
    });  
});

/* -------------------------------------------------------------------------- */
/**
  @Description  Get campagne
  @Route        /api/v1/campagne/:id (GET)
  @Access       public
*/
exports.getCampagne = asyncHandler (async (req, res) => {
  const readOneCampagne = await Campagne.findById(req.params.id);
  if (!readOneCampagne) next(new ErrorHandler('Campagne not found', 401));
  res.status(200).json({
    status: 'success',
    data: {
      campagne: readOneCampagne
    }
  });
});

/* -------------------------------------------------------------------------- */
/** 
  @Description   Update Campagne
  @Route  /api/v1/campagne/:id  (PUT/PATCH)
  @Access private
*/
exports.updateCampagne = asyncHandler (async (req, res) => {
  const putCampagne = await Campagne.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!putCampagne) return next(new ErrorHandler('Campagne introuvable !', 401))
  res.status(200).json({
    status: 'success',
    message: 'Mise à jour reussi'
  });
})

/* -------------------------------------------------------------------------- */
/**
  @Description    Delete Campagne
  @route   /api/v1/campagne/:id (DELETE)
  @Access  private
*/
exports.deleteCampagneAdmin = asyncHandler (async (req, res) => {
  const deleteByAdmin = Campagne.findByIdAndDelete(req.params.id);
  if (!deleteByAdmin) return next(new ErrorHandler('Campagne introuvable !'))
  res.status(200).json({
    status: 'success',
    data: {
      campagne: deleteByAdmin
    }
  });
})

/* -------------------------------------------------------------------------- */
/**
  @Description    Desactived Campagne
  @route   /api/v1/campagne/:id (DELETE)
  @Access  private
*/
exports.deleteCampagne = asyncHandler(async (req, res) => {
    const deleteResult = await Campagne.findByIdAndUpdate(req.params.id, {isActived: false}) ;
    if (!deleteByAdmin) return next(new ErrorHandler('Campagne introuvable !'))
    res.status(200).json({
      status: 'success',
      data: {
        campagne: deleteResult
      }
    });
});

