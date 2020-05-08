const Campagne = require('../models/campagne');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const multer = require('multer');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/campagnes')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  }
});

const upload = multer({storage: multerStorage});

exports.uploadCampagnePhoto = upload.single('photo');

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
    } = req.body;

  req.body.photo = req.file.filename;

  const campagne = new Campagne({
    user: req.body.user, 
    nomCampagne, 
    typeCampagne, 
    montantDemande, 
    raison,
    photo: req.body.photo
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
    await Campagne.find()
    .then(result => {
      res.status(200).json({
        status: 'success',
        data: {
          campagnes: result
        }
      });
    });
});

/* -------------------------------------------------------------------------- */
/**
  @Description  Get campagne
  @Route        /api/v1/campagne/:id (GET)
  @Access       public
*/
exports.getCampagne = asyncHandler (async (req, res, next) => {
  const readOneCampagne = await Campagne.findById(req.params.id);
  if (!readOneCampagne) return next(new ErrorHandler('Campagne not found', 401));
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
      campagne: null
    }
  });
});


exports.deactivatedCampagne = asyncHandler(async(req, res) => {
  await Campagne.findByIdAndUpdate(req.params.id, {isActived: false});
  res.status(200).json({
    status: 'success',
    message: 'Campagne desactivé !'
  });
});

exports.verifiedCampagne = asyncHandler(async(req, res) => {
  await Campagne.findByIdAndUpdate(req.params.id, {isVerified: true});
  res.status(200).json({
    status: 'success',
    message: 'Campagne verifié !'
  });
});

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

