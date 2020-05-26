$(document).ready(function() { 
  // Submit form
  $("#form__register").submit(function(e) {
    e.preventDefault();
    ajaxPost();
  })
});

function ajaxPost(data) {
  toastr.options.progressBar = true;
  // prepare form data
  var formData = {
    nom : $("#nom").val(),
    prenoms: $("#prenoms").val(),
    email: $("#email").val(),
    password: $("#password").val(),
    password_confirmation : $("#password_confirmation").val() 
  }
 
  // Post data
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: "http://localhost:3000/api/v1/users/register",
    data: JSON.stringify(formData),
    dataType: 'json',
    success: function() {
      // $("#post_result").html("<div class='alert alert-primary' role='alert'>" + "Enregistrement effectué avec succès !" +
      // "</div>");      
      toastr.success('Enregistrement effectué avec succes !');
      setTimeout(() => {
        location.assign('/');
      }, 2000)
    },
    error : function (e) { 
      if (e.responseText.includes('E11000')) {
        toastr.error("Email déjà existant ! ")
      }
      else {
        toastr.error("Erreur lors de l'enregistrement ! ")
      }
      console.log("Error: ", e)
      console.log(formData)
    }
  });
}

