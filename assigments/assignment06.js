// --- global variables ---

var loans = [
  { loan_year: 2020, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2021, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2022, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2023, loan_amount: 10000.00, loan_int_rate: 0.0453 },
  { loan_year: 2024, loan_amount: 10000.00, loan_int_rate: 0.0453 }
]; 


// --- function: loadDoc() ---

function loadDoc() {
  
  // pre-fill defaults for first loan year
  var defaultYear = loans[0].loan_year;
  // console.log(defaultYear) // debug: defaultYear starts at 2020
  // document.getElementById("loan_year0" + 1).value = defaultYear++; // js
  $("#loan_year01").val(defaultYear++); // jquery
  // console.log(defaultYear) // debug: defaultYear increments
  var defaultLoanAmount = loans[0].loan_amount;
  document.getElementById("loan_amt0" + 1).value 
    = defaultLoanAmount.toFixed(2);
  var defaultInterestRate = loans[0].loan_int_rate;
  document.getElementById("loan_int0" + 1).value 
    = defaultInterestRate;
  var loanWithInterest 
  = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
  document.getElementById("loan_bal0" + 1).innerHTML 
    = toComma(loanWithInterest.toFixed(2));
  
  // pre-fill defaults for other loan years
  for(var i=2; i<6; i++) {
    document.getElementById("loan_year0" + i).value 
      = defaultYear++;
    document.getElementById("loan_year0" + i).disabled 
      = true;
    document.getElementById("loan_year0" + i).style.backgroundColor 
      = "gray";
    document.getElementById("loan_year0" + i).style.color 
      = "white";
    document.getElementById("loan_amt0" + i).value 
      = defaultLoanAmount.toFixed(2);
    document.getElementById("loan_int0" + i).value 
      = defaultInterestRate;
    document.getElementById("loan_int0" + i).disabled 
      = true;
    document.getElementById("loan_int0" + i).style.backgroundColor 
      = "gray";
    document.getElementById("loan_int0" + i).style.color 
      = "white";
   loanWithInterest 
     = (loanWithInterest + defaultLoanAmount) 
     * (1 + defaultInterestRate);
   document.getElementById("loan_bal0" + i).innerHTML 
     = toComma(loanWithInterest.toFixed(2));
    } // end: "for" loop
  
  // all input fields: select contents on focus (jquery) 
  $("input[type=text]").focus(function() {
    $(this).select();
    $(this).css("background-color", "yellow");
  }); 
  $("input[type=text]").blur(function() {
    $(this).css("background-color", "white");
  });
  
  // set focus to first year: messes up codepen
  // $("#loan_year01").focus();
  // update loans array when exiting "year" input field (jquery)
  /*
  $("#loan_year01").blur( function() {
    updateLoansArray();
  });
  */
  //updates all fields after data is updated (unfocused or user enters new data)
  $(".form-control").change( function() {
    //updates the array if it is valid
    if(validate()){
      updateLoansArray();
    }
    });
  
  //localStorage Code
  load();  //loads data
  window.onbeforeunload = save;  //saves before unload
  
  
  populate(); //loads payments
  
} // end: function loadDoc()


function toComma(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateLoansArray() {
  
  // update the loans array
  loans[0].loan_year = parseInt($("#loan_year01").val()); // jquery
  loans[0].loan_int_rate = readNumber($("#loan_int01").val());
  // update all the years in the "year" column
  for(var i=1; i<5; i++) {
    loans[i].loan_year = loans[0].loan_year + i;
    $("#loan_year0"+ (i+1) ).val(loans[i].loan_year); // jquery
    
    //updates intrest
    loans[i].loan_int_rate = loans[0].loan_int_rate;
  }
  //updates amount in array
  $("[id*='loan_amt']").each(function(i){
    loans[i].loan_amount = readNumber($("#loan_amt0" + (i+1)).val())
  })
  
   //updates intrest column
   $("[id*='loan_int']").val($("#loan_int01").val());
  
  //YE Bal
  $("[id*='loan_bal']").html(function(i){
    let ret = readNumber($("#loan_amt0" + (i+1)).val());    //amount in row
    ret += ((i > 0)? readNumber($("#loan_bal0" + i).html()): 0);  //balance of last year
    ret += ret*readNumber($("#loan_int0" + (i+1)).val());     //year intrest
    ret = toComma(ret.toFixed(2));
    return ret;
  });
  
  //Accured Intrest
  $("#loan_int_accrued").html(function(){
  let x = readNumber($("#loan_bal05").html());
  $("[id*='loan_amt']").each(function(){ x -= readNumber($(this).val())}); //adds sum of amounts
  x = "$" + toComma(x.toFixed(2));
  return x;
  })
}

function validate(){
  //year
  if(!checkYear(readNumber($("#loan_year01").val()))){
    $("#loan_year01").css("background-color","red");
    return false;
    }
  
  if(!checkInt(readNumber($("#loan_int01").val()))){
    $("#loan_int01").css("background-color","red");
    return false;
    }
  
  //if any loan_amt is invalid
  return checkAmount($("[id*='loan_amt']").val(function(i, prevData){
    if(!checkAmount($(this).val()))
      $(this).css("background-color","red");
    return prevData;
  }).val())
  
  
  //focus it again (turns it yellow)
  $( "*:focus" ).focus()
  
  return true;
}

function checkYear(value){
  value = "" + value //converts value to String
  //starts with 20 followed by followed by 1-9 then 0-9 then ends
  //2010 - 2099 inclusivley
  let regexTest =/^20[1-9][0-9]$/;
  return regexTest.test(value)
}

function checkInt(value){
  /*
    can start by 0 followed by . followed by atleast 1 number 0-9
  */
  value = "" + value //converts value to String
   let regexTest =/^0?\.[0-9]+$/;
   return regexTest.test(value)
}

function checkAmount(value){
  value = "" + value //converts value to String
  /*
    atleast 1 number 0-9
    or atleast 1 number 0-9 followed by . and two numbers 0-9
  */
  let regexTest =/^([0-9]+)$|(^[0-9]*\.[0-9][0-9])$/;
   return regexTest.test(value)
}

function readNumber(value){
  /*
  removes $ and , and returns a number
  */
  value = "" + value //converts value to String
  //replaces $ or , with a nullstring globally
  return parseFloat(value.replace(/\$|,/g, ""));
}

function toMoney(value){
  return "$" + toComma(value.toFixed(2));
}

function load(){
  if(localStorage.getItem("year") != null){
  $("#loan_year01").val(localStorage.getItem("year")) //loads year
  $("#loan_int01").val(localStorage.getItem("int"))   //loads intrest rate
  $("[id*='loan_amt']").val(function(i){
      return localStorage.getItem("amt" + i);
    });
  }
}

function save(){
  if(validate()){
    localStorage.setItem("year",  $("#loan_year01").val()); //stores first year
    localStorage.setItem("int",  $("#loan_int01").val()); //stores first int
    $("[id*='loan_amt']").each(function(i){
      localStorage.setItem("amt" + i, $(this).val());
    });
  }
}

// ----- ANGULAR -----
//creates the rows relatively easily (pure js or HTML)
var app = angular.module('myApp', []);  //creates angular module named app

app.controller('myCtrl', function($scope) {   //creates app controller
  $scope.payments = [];                       //creates array to store each payment
  $scope.populate = function () {
    
    updateLoansArray();
    
    let total = readNumber($("#loan_bal05").html());
    let iRate = loans[0].loan_int_rate;
    let r = iRate / 12;
    let n = 11;
    //loan payment formula
    //https://www.thebalance.com/loan-payment-calculations-315564
    let pay = 12 * (total / ((((1+r)**(n*12))-1)/(r *(1+r)**(n*12))));  //calculates the each payment
    for (let i = 0; i < 10; i++) {    //for each payment excluding the last one
      total -= pay                    //subtracts payment from total
      let int = total * (iRate);      //interest for that year
      $scope.payments[i] = {          //place in values for each member of payments
        "year":loans[4].loan_year + i + 1,    
        "payment": toMoney(pay), 
        "amt": toMoney(int),
        "ye": toMoney(total += int)
      }
    }
    $scope.payments[10] = {         //that last payment
      "year":loans[4].loan_year + 11,
      "payment": toMoney(total),
      "amt": toMoney(0),
      "ye":toMoney(0)
    }
  }
});
