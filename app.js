$(document).ready(function () {

var addressUrl = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyA2-kQRQvjIHDQb3XyyUqyTPxCrT-zuee0&address='
var urlSenateInfo1 = ''
var urlSenateInfo2 = ''
var urlHouseInfo = ''
var loading = $('.loading')

var states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

createStateDropdown()

$('select').change(function(){
  $('.input-group').removeClass('hideInput')
})

$('button').click(submitAddress)

function submitAddress(event){
  event.preventDefault();
  $('.cards').empty();
  $('.title').empty();
  displayLoading()
  var address = $('input').val().split(' ');
  $.ajax({
    method: "GET",
    url: addressUrl + address
  })
  .then(findHouseRep)
  .then(getHouseRepUrl)
  .then(getHouseRepInfo)
  .then(showMyHouseRep)
  .then(findSenateReps)
  .then(findSenateRepsUrl)
  .then(getSenateRep1Info)
  .then(showMySenateRep1)
  .then(getSenateRep2Info)
  .then(showMySenateRep2)
}

function createStateDropdown() {
for(var i = 0; i < states.length; i++) {
      $("select").append("<option>" + states[i] + "</option>")
    }
}

function displayLoading(){
  loading.removeClass('hide')
}

function hideLodaing(){
  loading.addClass('hide')
}


function findDistrictNumber(data) {
  var divisionId = data.offices[3].divisionId
  var array = divisionId.split('')
  var districtNumber = array.filter(function(numbers){
      return numbers > 0;
    })
    if(districtNumber.length > 1) {
      return "" + districtNumber[0] + districtNumber[1] + ""
    } else {
      return districtNumber
    }
}

function findHouseRep(data) {
  var state = $('select').val();
  return $.ajax({
    method: "GET",
    url:"https://api.propublica.org/congress/v1/members/house/"+ state +"/"+ findDistrictNumber(data) +"/current.json",
    headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })

}

function getHouseRepUrl(data) {
  urlHouseInfo =  data.results[0].api_uri;
  return urlHouseInfo
}

function getHouseRepInfo(data) {
return $.ajax({
method: "GET",
url: urlHouseInfo,
headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
})
}

function showMyHouseRep(data) {
  hideLodaing()
  var name = data.results[0].first_name + " " + data.results[0].last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ data.results[0].member_id

  var party = findParty()

  function findParty() {
    if(data.results[0].current_party === "D") {
      return party = "Democrat"
  } else if (data.results[0].current_party === "R"){
      return party = "Republican"
    } else {
      return party = "Independant"
    }
  }

  $(".title").append(`<h2> District ${data.results[0].roles[0].district} </h2>`)

  $('.cards').append(
    `<div class='card col-sm-7 col-md-5 col-lg-3 ${party}'>
      <div class='card-header align-self-center'> <h4> Representative <br> ${name}</h4> </div>
        <img class='card-img-top img-thumbnail' src=' ${image}.jpg' alt='Senator's Photo'>
        <div class='card-block'>
        <p class='card-text'>
          <h5> ${party} </h5> <br>
          <strong> Party line vote percentage: </strong>
          <br>    ${data.results[0].roles[0].votes_with_party_pct} %
          <br> <strong> Missed vote percentage: </strong> <br>
          ${data.results[0].roles[0].missed_votes_pct} %
          <br> <strong> Phone Number: </strong> <br>
          ${data.results[0].roles[0].phone} <br> <br>
          <a target='blank' href=${data.results[0].url} > ${data.results[0].last_name}.house.gov
          </a>
        </p>
      </div>
    </div>`)
}

function findSenateReps(data) {
  var state = $('select').val();
  return $.ajax({
    method: "GET",
    url: "https://api.propublica.org/congress/v1/members/senate/"+ state +"/current.json",
    headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}
function findSenateRepsUrl(data) {
  urlSenateInfo1 = data.results[0].api_uri
  urlSenateInfo2 = data.results[1].api_uri
}

function getSenateRep1Info(data) {
  return $.ajax({
  method: "GET",
  url: urlSenateInfo1,
  headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}

function getSenateRep2Info(data) {
  return $.ajax({
  method: "GET",
  url: urlSenateInfo2,
  headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}

function showMySenateRep1(data) {
  var name = data.results[0].first_name + " " + data.results[0].last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ data.results[0].member_id

  var party = findParty()

  function findParty() {
    if(data.results[0].current_party === "D") {
      return party = "Democrat"
  } else if (data.results[0].current_party === "R"){
      return party = "Republican"
    } else {
      return party = "Independant"
    }
  }

  $('.cards').append(
    `<div class='card col-sm-7 col-md-5 col-lg-3 ${party}'>
      <div class='card-header align-self-center'> <h4> Senator <br> ${name}</h4> </div>
        <img class='card-img-top img-thumbnail' src=' ${image}.jpg' alt='Senator's Photo'>
        <div class='card-block'>
        <p class='card-text'>
          <h5> ${party} </h5> <br>
          <strong> Party line vote percentage: </strong>
          <br>  ${data.results[0].roles[0].votes_with_party_pct} %
          <br> <strong> Missed vote percentage: </strong> <br>
          ${data.results[0].roles[0].missed_votes_pct} %
          <br> <strong> Phone Number: </strong> <br>
          ${data.results[0].roles[0].phone} <br> <br>
          <a target='blank' href=${data.results[0].url} > ${data.results[0].last_name}.house.gov
          </a>
        </p>
      </div>
    </div>`)
}

function showMySenateRep2(data) {
  var name = data.results[0].first_name + " " + data.results[0].last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ data.results[0].member_id

  var party = findParty()

  function findParty() {
    if(data.results[0].current_party === "D") {
      return party = "Democrat"
  } else if (data.results[0].current_party === "R"){
      return party = "Republican"
    } else {
      return party = "Independant"
    }
  }

  $('.cards').append(
    `<div class='card col-sm-7 col-md-5 col-lg-3 ${party}'>
      <div class='card-header align-self-center'> <h4> Senator <br> ${name}</h4> </div>
        <img class='card-img-top img-thumbnail' src=' ${image}.jpg' alt='Senator's Photo'>
        <div class='card-block'>
        <p class='card-text'>
          <h5> ${party} </h5> <br>
          <strong> Party line vote percentage: </strong>
          <br>  ${data.results[0].roles[0].votes_with_party_pct} %
          <br> <strong> Missed vote percentage: </strong> <br>
          ${data.results[0].roles[0].missed_votes_pct} %
          <br> <strong> Phone Number: </strong> <br>
          ${data.results[0].roles[0].phone} <br> <br>
          <a target='blank' href=${data.results[0].url} > ${data.results[0].last_name}.house.gov
          </a>
        </p>
      </div>
    </div>`)
  }

})

// https://find-my-rep-22d32.firebaseapp.com
