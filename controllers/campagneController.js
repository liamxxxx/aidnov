const Campagne = require('../models/campagne');

/**
  @Description  Create campagne
  @Route        /api/v1/camapgne (POST)
  @Access       private
*/
exports.createCampagne = async (req, res) => {
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
}

/* -------------------------------------------------------------------------- */
/**
  @Description  Get all campagne
  @Route        /api/v1/campagne (GET)
  @Access       public
*/
exports.getAllCampagne = async (req, res) => {
  try { 
    const result = await Campagne.find();
    res.status(200).json({
      status: 'success',
      data: {
        campagnes: result
      }
    });

  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'An error occured'
    })
  }
  
}


/* -------------------------------------------------------------------------- */
/**
  @Description  Get campagne
  @Route        /api/v1/campagne/:id (GET)
  @Access       public
*/
exports.getCampagne = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      campagne: campagne
    }
  });
}

/* -------------------------------------------------------------------------- */
/** 
  @Description   Update Campagne
  @Route  /api/v1/campagne/:id  (PUT/PATCH)
  @Access private
*/
exports.updateCampagne = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'update done !'
  });
}

/* -------------------------------------------------------------------------- */
/**
  @Description    Delete Campagne
  @route   /api/v1/campagne/:id (DELETE)
  @Access  private
*/
exports.deleteCampagne = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      campagne: campagne
    }
  });
}
