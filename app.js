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

$('.button').submit(submitAddress)

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
  .catch(showErrorMsg)
}

function createStateDropdown() {
 states.forEach(state => {
   $("select").append("<option>" + state + "</option>")
 })
}

function displayLoading(){
  loading.removeClass('hide')
  $('.image').attr("src", "http://media.gq.com/photos/5595ba662ca275951298752e/master/w_800/hulkster.gif")
}

function hideLodaing(){
  loading.addClass('hide')
}


function getDistrictNumber(districtInfo) {
  var divisionId = districtInfo.offices[3].divisionId
  return districtNumber = divisionId.replace(/\D/g, '')
}



function findHouseRep(houseRepInfo) {
  var state = $('select').val();
  return $.ajax({
    method: "GET",
    url:"https://api.propublica.org/congress/v1/members/house/"+ state +"/"+ getDistrictNumber(houseRepInfo) +"/current.json",
    headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}

function getHouseRepUrl(houseRepInfo) {
  urlHouseInfo =  houseRepInfo.results[0].api_uri;
  return urlHouseInfo
}

function getHouseRepInfo(houseRepInfo) {
return $.ajax({
method: "GET",
url: urlHouseInfo,
headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
})
}

function showMyHouseRep(houseRepInfo) {
  hideLodaing()
  var houseRep = houseRepInfo.results[0]
  var name = houseRep.first_name + " " + houseRep.last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ houseRep.member_id
  var district = houseRep.roles[0].district
  var url = houseRep.url
  var partyVotePercentage = houseRep.roles[0].votes_with_party_pct
  var missedVotePercentage = houseRepInfo.results[0].roles[0].missed_votes_pct
  var phoneNumber = houseRepInfo.results[0].roles[0].phone

  var party = findParty(houseRepInfo)

  $(".title").append(`<h2> District ${district} </h2>`)

  $('.cards').append(
    `<div class='card col-sm-7 col-md-5 col-lg-3 ${party}'>
      <div class='card-header align-self-center'> <h4> Representative <br> ${name}</h4> </div>
        <a target='blank' href=${url} >
          <img class='card-img-top img-thumbnail' src=' ${image}.jpg' alt='Senator's Photo'>
        </a>
        <div class='card-block'>
        <p class='card-text'>
          <h5> ${party} </h5> <br>
          <strong> Party line vote percentage: </strong>
          <br>    ${partyVotePercentage} %
          <br> <strong> Missed vote percentage: </strong> <br>
          ${missedVotePercentage} %
          <br> <strong> Phone Number: </strong> <br>
          <a href='tel:${phoneNumber}'>${phoneNumber}<a/> <br> <br>
          <a target='blank' href=${url} > ${houseRepInfo.results[0].last_name}.house.gov
          </a>
        </p>
      </div>
    </div>`)
}

function findParty(repInfo) {
  if(repInfo.results[0].current_party === "D") {
    return party = "Democrat"
} else if (repInfo.results[0].current_party === "R"){
    return party = "Republican"
  } else {
    return party = "Independant"
  }
}

function findSenateReps(senateRepInfo) {
  var state = $('select').val();
  return $.ajax({
    method: "GET",
    url: "https://api.propublica.org/congress/v1/members/senate/"+ state +"/current.json",
    headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}
function findSenateRepsUrl(senateRepInfo) {
  urlSenateInfo1 = senateRepInfo.results[0].api_uri
  urlSenateInfo2 = senateRepInfo.results[1].api_uri
}

function getSenateRep1Info(senateRepInfo) {
  return $.ajax({
  method: "GET",
  url: urlSenateInfo1,
  headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}

function getSenateRep2Info(senateRepInfo) {
  return $.ajax({
  method: "GET",
  url: urlSenateInfo2,
  headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
  })
}

function showMySenateRep1(senateInfo) {
  var senateRep = senateInfo.results[0]
  var name = senateRep.first_name + " " + senateRep.last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ senateRep.member_id
  var district = senateRep.roles[0].district
  var url = senateRep.url
  var partyVotePercentage = senateRep.roles[0].votes_with_party_pct
  var missedVotePercentage = senateRep.roles[0].missed_votes_pct
  var phoneNumber = senateRep.roles[0].phone

  var party = findParty(senateInfo)

  $('.cards').append(
    `<div class='card col-sm-7 col-md-5 col-lg-3 ${party}'>
      <div class='card-header align-self-center'> <h4> Senator <br> ${name}</h4> </div>
      <a target='blank' href=${url} >
        <img class='card-img-top img-thumbnail' src=' ${image}.jpg' alt='Senator's Photo'>
        </a>
        <div class='card-block'>
        <p class='card-text'>
          <h5> ${party} </h5> <br>
          <strong> Party line vote percentage: </strong>
          <br>  ${partyVotePercentage} %
          <br> <strong> Missed vote percentage: </strong> <br>
          ${missedVotePercentage} %
          <br> <strong> Phone Number: </strong> <br>
            <a href='tel:${phoneNumber}'>${phoneNumber}<a/> <br> <br>
          <a target='blank' href=${url} > ${senateInfo.results[0].last_name}.senate.gov
          </a>
        </p>
      </div>
    </div>`)
}

function showMySenateRep2(senateInfo) {
  var senateRep = senateInfo.results[0]
  var name = senateRep.first_name + " " + senateRep.last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ senateRep.member_id
  var district = senateRep.roles[0].district
  var url = senateRep.url
  var partyVotePercentage = senateRep.roles[0].votes_with_party_pct
  var missedVotePercentage = senateRep.roles[0].missed_votes_pct
  var phoneNumber = senateRep.roles[0].phone

  var party = findParty(senateInfo)

  $('.cards').append(
    `<div class='card col-sm-7 col-md-5 col-lg-3 ${party}'>
      <div class='card-header align-self-center'> <h4> Senator <br> ${name}</h4> </div>
      <a target='blank' href=${url} >
        <img class='card-img-top img-thumbnail' src=' ${image}.jpg' alt='Senator's Photo'>
        </a>
        <div class='card-block'>
        <p class='card-text'>
          <h5> ${party} </h5> <br>
          <strong> Party line vote percentage: </strong>
          <br>  ${partyVotePercentage} %
          <br> <strong> Missed vote percentage: </strong> <br>
          ${missedVotePercentage} %
          <br> <strong> Phone Number: </strong> <br>
            <a href='tel:${phoneNumber}'>${phoneNumber}<a/> <br> <br>
          <a target='blank' href=${url} > ${senateInfo.results[0].last_name}.senate.gov
          </a>
        </p>
      </div>
    </div>`)
  }

  function showErrorMsg(e) {
    $('.image').attr("src", "https://cdn.dribbble.com/users/266011/screenshots/2455247/404-dribbble.gif")
    $('.cards').append(`<h2 class='errorMsg'> Error: Invalid Address!</h2>`)
  }

})
