const Comment = require('../models/commentaire');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

/**
  @Description  Create comment
  @Route        /api/v1/camapgne (POST)
  @Access       private
*/
// TODO Creer un commentaire
exports.createComment = asyncHandler(async (req, res) => {
    const { donateur, message, date, campagne } = req.body;
    const commentaire = new Comment({
    donateur,
    message,
    date,
    campagne
  });
  await commentaire.save(); 
  res.status(201).json({
    status: 'success',
    message: 'Operation effectué'
  });
});

/* -------------------------------------------------------------------------- */
/**
  @Description  Get all comments
  @Route        /api/v1/comment (GET)
  @Access       public
*/
// TODO Recuperé la liste de tous les commentaires
exports.getAllComments = asyncHandler(async (req, res) => {
  const getComments = await Comment.find();
  res.status(201).json({
    status: 'success',
    data: {
      Commentaires: getComments
    }
  });
});

/* -------------------------------------------------------------------------- */
/**
  @Description  Get comment
  @Route        /api/v1/comment/:id (GET)
  @Access       public
*/
// TODO Récupérer un commentaire specifique
exports.getComment = asyncHandler(async (req, res) => {
  const getComment = await Comment.findById(req.params.id);
  if (!getComment) return next(new ErrorHandler('Commentaire introuvable !', 401));
  res.status(201).json({
    status: 'success',
    data: {
      Commentaire: getComment
    }
  });
});

/* -------------------------------------------------------------------------- */
/** 
  @Desc   Update Comment
  @Route  /api/v1/comment/:id  (PUT/PATCH)
  @Access private
*/
// TODO Mettre a jour un commentaire specifique
exports.updateComment = asyncHandler(async (req, res) => {
    const result = await Comment.findByIdAndUpdate(req.params.id, req.body);
    if (!result) return next(new ErrorHandler('Commentaire introuvable !'));
    res.status(201).json({
      status: 'success',
      message: 'Mise a jour effectué !',
    });
});

/* -------------------------------------------------------------------------- */
/**
  @Desc    Delete Comment
  @route   /api/v1/comment/:id (DELETE)
  @Access  private
*/
// TODO Effacer un commentaire
exports.deleteComment = asyncHandler(async (req, res) => {
  const delComment = await Comment.findByIdAndDelete(req.params.id);
  if (!delComment) return next(new ErrorHandler('Commentaire introuvable !'));
  res.status(200).json({
    status: 'success',
    data: {
      deletedComment: delComment
    }
  });
});