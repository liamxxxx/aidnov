const crypto = require('crypto');
const User = require('../models/utilisateur');
const Campagne = require('../models/campagne');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/campagnes')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}.${ext}`)
  }
});

const upload = multer({storage: multerStorage});

exports.uploadCampagnePhoto = upload.single('photo');

exports.viewMail = (req, res) => {
  res.status(200).render("home", {
    Title: "Mail template test",
  });
};

// Accueil
exports.home = (req, res) => {
  res.status(200).render('index', {
    title:
      "AidNov™ : la plateforme de collecte de fonds en ligne au profit d'êtres et de causes qui vous sont chers.",
  });
};

// Login
exports.login = (req, res) => {
  if (res.locals.user) return res.redirect('/')
  res.status(200).render('login', {
    title: "AidNov™ : Se connecter",
  });
};

// Register
exports.register = (req, res) => {
  if (res.locals.user) return res.redirect('/')
  res.status(200).render('register', {
    title: "AidNov™ : S'inscrire",
  });
};

// Contacts
exports.contacts = (req, res) => {
  res.status(200).render('contact', {
    title: "AidNov™ : Contact",
  });
};

// Mot de passe oublié
exports.forgotpassword = (req, res) => {
  res.status(200).render("forgotpassword", {
    title: "AidNov™ : Mot de passe oublié",
  });
};

// Change password
exports.changepassword = (req, res) => {
  res.status(200).render("changepassword", {
    title: "AidNov™ : Modifier le mot de passe"
  });
}

// A propos
exports.about = (req, res) => {
  res.status(200).render("about", {
    title: "AidNov™ : A propos",
    bar_title: "Qui sommes nous !",
  });
};

// Créer campagne
exports.create_campagne = async(req, res) => {
  const {
    pays,
    region,
    ville,
    numero_telephone,
    nomCampagne, 
    typeCampagne, 
    montantDemande, 
    raison, 
    } = req.body;

  if (req.file) req.body.photo = req.file.filename;
    
  const campagne = new Campagne({
    pays,
    region,
    ville,
    numero_telephone,
    nomCampagne, 
    typeCampagne, 
    montantDemande, 
    raison,
    photo: req.body.photo
  });


  await campagne.save();

  res.status(201).render('campagne_validate', {});
}

// Demarrer Campagnes
exports.startcampagne = (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  res.status(200).render("startcampagne", {
    title: "AidNov™ : Demarrer une campagne",
    bar_title: "Demarrer une campagne ",
    paiement:
      "  AidNov™ prélève une commission de 5 % sur chaque don reçu. Le processeur de paiements collecte une commission de 3,5 % par don effectué par Mobile Money et de 2.9 % par don effectué par Carte de crédit. En poursuivant, vous acceptez les conditions générales d’utilisation et accusez réception de la politique de confidentialité à AidNov™ – A product of LoHiDi® Group.",
  });
};

// // Email validé
// exports.emailValidate = (req, res) => {
//   if (req.params.token) {
    
//   }
//   res.redirect('/')
// }

exports.emailValidate = async (req, res) => {
  if (req.params.token) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      email_confirmation_token: hashedToken,
      email_confirmation_expires: {
        $gt: Date.now(),
      },
    });

    if (user) {
      user.is_verified = true;
      user.email_confirmation_token = undefined;
      user.email_confirmation_expires = undefined;
      await user.save({
        validateBeforeSave: false,
      });
      res.status(200).render('email_verified', {
        title: "AidNov™ : Email validé"
      });
    } else {
      res.redirect('/');
    }
  }
}
  
exports.logout = async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect('/')
};

// Faire Don
exports.donation = (req, res) => {
  res.status(200).render("donation", {
    title: "AidNov™ : Faire une donation",
  });
};

// Campagnes
exports.campagnes = (req, res) => {
  res.status(200).render("campagne", {
    title: "AidNov™ : Mot de passe oublié",
  });
};

// Cause: Santé
exports.causeSante = (req, res) => {
  res.status(200).render("", {});
};

// Cause: Commemorations
exports.causeCommemo = (req, res) => {
  res.status(200).render("home", {});
};

// Cause: Urgences
exports.causeUrgence = (req, res) => {
  res.status(200).render("home", {});
};

// Cause: Religion
exports.causeReligion = (req, res) => {
  res.status(200).render("home", {});
};

// Cause: Education
exports.causeEducation = (req, res) => {
  res.status(200).render("home", {});
};
// Cause: Mariage
exports.causeMariage = (req, res) => {
  res.status(200).render("home", {});
};
// Cause: Famille
exports.causeFamille = (req, res) => {
  res.status(200).render("home", {});
};
