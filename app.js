$(document).ready(function () {

var addressUrl = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyA2-kQRQvjIHDQb3XyyUqyTPxCrT-zuee0&address='

var urlHouseInfo = ''

var states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

createStateDropdown()

$('button').click(submitAddress)

function submitAddress(event){
  event.preventDefault();
  var address = $('input').val().split(' ');
  $.ajax({
    method: "GET",
    url: addressUrl + address
  })
  .then(findHouseRep)
  .then(getHouseRepUrl)
  .then(getHouseRepInfo)
  .then(showMyHouseRep)
  .then(function(data) {
    $.ajax({
      method: "GET",
      url: "https://api.propublica.org/congress/v1/members/senate/CO/current.json",
      headers: {"X-API-Key": "h8MbAqUKVc70UFTS0O4qA7kZ1a5wiIR96PSUQsOm"}
    })
    .then(function(data) {
      console.log(data);
    })
  })
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
function createStateDropdown() {
for(var i = 0; i < states.length; i++) {
      $("select").append("<option>" + states[i] + "</option>")
    }
}


function getHouseRepUrl(data) {
  urlHouseInfo =  data.results[0].api_uri;
      console.log(data.results[0].name);
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
  var name = data.results[0].first_name + " " + data.results[0].last_name
  var image = "https://theunitedstates.io/images/congress/225x275/"+ data.results[0].member_id

  var party = findParty()

  function findParty() {
    if(data.results[0].current_party === "D") {
    return party ="Democrat"
  } else {
    return party ="Republican"
  }
  }

  $('.cards').append("<div class='card col-4'> <div class='card-header'> Representative "+ name +" </div> <img class='card-img-top img-thumbnail' src='"+ image +".jpg" +"' alt='Card image cap'> <div class='card-block'> <p class='card-text'>"+ "Party: "+ "<br>" + party + "<br>" + "Party line vote percentage: "+ "<br>" + data.results[0].roles[0].votes_with_party_pct + "%" + "<br>" + "Missed vote percentage: " + "<br>" + data.results[0].roles[0].missed_votes_pct + "%" + "<br>" + "Phone Number: " + "<br>" + data.results[0].roles[0].phone + "<br>" + "Web page: " + "<br>" + "<a target='blank' href=" + data.results[0].url + ">" + data.results[0].url + "</a> </p> </div> </div>")

}

})
