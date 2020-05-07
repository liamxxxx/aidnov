exports.viewMail = (req, res) => {
  res.status(200).render('mail',{
    Title: 'Mail template test'
  });
} 