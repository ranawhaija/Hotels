
/**
 * Init autocomplete google places fields
 */
function initAutocomplete() {
  var input = document.getElementById("pac-input");
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", () => {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert(`No details available for input: ${place.name}`);
      return;
    }
  });
}
/**
 * define the socket connection
 */
var socket = io.connect("/");

/**
 * set a listener when message is recieved from server
 */
socket.on("message", message => {
  $("#loader").hide();
  message = JSON.parse(message);
  // check if there is result
  if (Object.keys(message.offers).length) {
    message.offers.Hotel.forEach(hotel => {
      // append offers cards to the html parent node
      $("#cards-container").append(`<div class='col-lg-4 col-md-6 mb-4'>
          <div class='card h-100'>
            <img class='card-img-top' src='${
              hotel.hotelInfo.hotelImageUrl
            }' alt=''>
            <div class='card-body'>
              <h5 class='card-title'>
                ${hotel.hotelInfo.hotelName}
                <h6>${hotel.hotelInfo.hotelLongDestination}</h6>
              </h5>
              <h6>${hotel.hotelPricingInfo.percentSavings}% off</h6>
              <p class='card-text'><small> ${hotel.hotelPricingInfo.originalPricePerNight
                .toString()
                .strike()}</small> ${
        hotel.hotelPricingInfo.averagePriceValue
      } ${hotel.hotelPricingInfo.currency}</p>
            </div>
            <div class='card-footer'>
              <small class='text-muted'>${"&#9733".repeat(
                hotel.hotelInfo.hotelStarRating
              )}</small>
            </div>
          </div>
          </div>`);
    });
  } else {
    $("#empty").show();
  }
});

// do actions after the DOM elements of the page are ready to be used
$(function() {
  $("#empty").hide(); // set the empty case as hide
  // handle submit button function
  $("#submit").click(e => {
    // prevent the page from reload
    e.preventDefault();
    // initialize the object
    let queryParamObj = {};
    $("#loader").show();
    $("#empty").hide();

    //add only the filled fields to the query parameter obj
    $("form")
      .serializeArray()
      .filter(inputObj => {
        if (inputObj.value) {
          queryParamObj[inputObj.name] = inputObj.value;
        }
      });
    socket.send(JSON.stringify(queryParamObj));
    //Emptying the text box value using jquery
    $("#cards-container").html("");
  });

  // handle reset button function
  $("#reset").click(e => {
    $("#loader").show();
    $("#empty").hide();
    $("#cards-container").html("");
    socket.send("{}");
  });
});
