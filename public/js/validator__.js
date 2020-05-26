$(document).ready(function () {
  $("#form__register").submit(function (e) {
    e.preventDefault();
    var first_name = $("#nom").val();
    var last_name = $("#prenoms").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var repassword = $("#password_confirmation").val();

    if (first_name.length < 1) {
      $("#first_name").after('<span class="erreur">Ce champ est requis</span>');
    }
    if (last_name.length < 1) {
      $("#last_name").after('<span class="erreur">Ce champ est requis</span>');
    }
    if (email.length < 1) {
      $("#email").after('<span class="erreur">Ce champ est requis</span>');
    } else {
      var regEx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      var validEmail = regEx.test(email);
      if (!validEmail) {
        $("#email").after('<span class="erreur">Entrez un email valide</span>');
      }
    }
    if (password.length < 8) {
      $("#password").after(
        '<span class="erreur">Le mot de passe doit avoir au minimum 8 caractères</span>'
      );
    }

    if (password !== repassword) {
      $("#confirm_password").after(
        '<span class="erreur">Les mots de passe ne sont pas identiques</span>'
      );
    }
  });
});
