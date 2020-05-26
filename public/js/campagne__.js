$(document).ready(function() {
  // submit form
  const campagne =  $("#campagne-form");

  campagne.submit(function(e) {
    e.preventDefault();
    ajaxPost();
  });
  
  // Function to send ajax request
  function ajaxPost() {
    // Get form
    // var photo = $("#photo").files[0];
    // var montantDemande = $("#prix").val();
    // var typeCampagne = $("#cause").val();
    // var nomCampagne = $("#nomCampagne").val();
    // var pays = $("#countryId").val();
    // var region = $("#stateId").val();
    // var ville = $("#cityId").val();
    // var numero_telephone = $("#phone").val;
    // var raison = $("#raison").val();


    // Initialise form
  
     const data = new FormData();

    // Append field
    // data.append('photo',  $("#photo")[0].files[0])
    data.append('montantDemande', $("#prix").val());
    console.log(data.append('montantDemande', $("#prix").val()));
    data.append('typeCampagne', $("#cause").val())
    data.append('nomCampagne', $("#nomCampagne").val())
    data.append('pays', $("#countryId").val())
    data.append('region', $("#stateId").val())
    data.append('ville', $("#cityId").val())
    data.append('numero_telephone', $("#phone").val)
    data.append('raison', $("#raison").val())

    confirm.log(data);

    $.ajax({
      type: 'POST',
      url: "http://localhost:3000/api/v1/campagnes",
      data: data,
      contentType: false,
      processData: false,
      cache: false,
      success: function(data) {
        console.log('SUCCESS', data)
      },
      error: function (e) {
        console.log(data)
        console.log('Erreur', e)
    }
  })
}
});