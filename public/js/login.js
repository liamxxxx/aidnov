$(document).ready(function() {
  // submit form
  const login =  $("#form__login");

  // const logOut = $("#logout");

  // if (logOut) {
  //   logOut.click(function(e) {
  //     e.preventDefault();
  //     ajaxLogout();
  // })};
  
  if (login) {
    login.submit(function(e) {
      e.preventDefault();
      ajaxPost();
    });
  }
  
  // Function to send ajax request
  function ajaxPost() {
    toastr.options.progressBar = true;

    var formData = {
      email: $("#email").val(),
      password : $("#password").val()
    }

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: "http://localhost:3000/api/v1/users/login",
      data: JSON.stringify(formData),
      dataType: 'json',
      success: function() {
        toastr.success('Connexion reussite !');
        setTimeout(() => {
          location.assign('/');
        }, 2000)
      },
      error: function (e) {
        if (e.responseText.includes("Account")) {
          toastr.error("Consultez votre boîte mail pour valider votre compte ! ");
        }
        else if (e.responseText.includes("Incorrect")) {
          toastr.error(" Email ou Mot de passe incorrect! ");
        }
        else { 
          toastr.error("Une erreur inattendue est survenue ! ");
        }
    }
  })
}

// function ajaxLogout() {
//   $.ajax({
//     type: 'GET',
//     url: 'http://localhost:3000/api/v1/users/logout',
//     success: function (user) {
//       console.log(user)
//      location.assign('/');
//     },
//     error: function (e) {
//       toastr.error('Erreur lors de la deconnexion...');
//       console.log(e.responseText)
//     }
//   });
// }

});