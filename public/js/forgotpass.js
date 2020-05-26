$(document).ready(function () {
  // Submit form
  const mail = $("#forgot_form");
  mail.submit(function(e) {
    e.preventDefault();
    ajaxPost();
  });

  // Function to send ajax request
  function ajaxPost() {
    toastr.options.progressBar = true;

    const formData = {
      email: $("#email").val()
    }

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: "http://localhost:3000/api/v1/users/forgot_password",
      data: JSON.stringify(formData),
      dataType: 'json',
      success: function() {
        toastr.success('Requête envoyé, veuillez consulter votre boîte Mail !');
        setTimeout(() => {
          location.reload();
        }, 1000)
      },
      error: function (e) {
        toastr.error('Erreur lors de la requête !');
    }
  })
}
});