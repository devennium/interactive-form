// Declartation of variables
let $total = 0

const $paypalDiv = $('body > div > form > fieldset:nth-child(4) > div:nth-child(5) > p')
const $bitcoinDiv = $('body > div > form > fieldset:nth-child(4) > div:nth-child(6) > p')
const $activitiesFieldSet = $('body > div > form > fieldset.activities')

// Focus on first text field input
$(":text:first").focus()

// Hide other Job role text input
$("#other-title").hide()

// Set t-shirt color to blank
hideAllColorSelections()
showDefaultColorSelection()

//Set payment option default to credit card
$paypalDiv.hide()
$bitcoinDiv.hide()
$('#payment').val("credit card")

// Add running total
$('[name="npm"]').parent().append('<p id="total">Total: $0</p>')

$("#title").change(function(event) {
    if(event.target.value === "other"){
        // Unhide other job role text input on Other selection
        $('#other-title').show()
    } else {
        // Hide other input text when another selection is choosen from Job role
        $('#other-title').hide()
    }
});

// Show default T-shirt color "Please select T-Shirt design"
function showDefaultColorSelection(){
    $('#color').append($('<option/>', { 
        value: "default",
        text : "Please select T-Shirt design" 
    }));
    $("#color option[value='default']").show().prop('selected', true)
}

// Hide all T-shirt colors
function hideAllColorSelections() {
    $("#color option").each(function(){$(this).hide()})
}

// Set t-shirt color options based on design selection
function setColorOptions($designSelectionValue){
    $("#color option").each(function(){    
    $(this).hide()
    
    const $jsShirtColors = /(JS\sshirt\sonly)/
    const $isJScolor = $jsShirtColors.test(this.text)

    const $jsPunShirtColors = /(JS\sPuns\sshirt\sonly)/
    const $isJsPunsColor = $jsPunShirtColors.test(this.text)

    if($designSelectionValue === "heart js"){
        if($isJScolor === true){
        $(this).show()
        $(this).prop('selected', true)
                }
            } 
    if($designSelectionValue === "js puns"){
        if($isJsPunsColor === true){
            $(this).show()
            $(this).prop('selected', true)
            }
        }
    });
    if($designSelectionValue == "Select Theme"){
        console.log("Design Selection Value: " + $designSelectionValue)
        $("#color option[value='default']").prop('selected', true).show()
    }
}

// On Change listener for design selection
$("#design").change(function(){
        setColorOptions($(this).val())
});

//On Change listener for Schedule selections
$(":checkbox").change(function(){
const $checkboxScheduleValue = $(this).parent().text()
const $selectedScheduleTime = checkTimeSchedule($checkboxScheduleValue)
const $checkboxIsChecked = $(this).prop("checked")
const $checkboxAttrName = $(this).attr("name")

if($checkboxIsChecked == true){
    addClassCost($checkboxScheduleValue)
}

if($checkboxIsChecked == false){
    subtractClassCost($checkboxScheduleValue)
}

// Disable and enable schedule selections based on current time selections
$(":checkbox").each(function (){
    const $thisCheckboxValue = $(this).parent().text()
    const $thisSelectedScheduleTime = checkTimeSchedule($thisCheckboxValue)
    const $thisCheckboxAttrName = $(this).attr("name")

    if($thisCheckboxAttrName !== $checkboxAttrName){
        if($selectedScheduleTime === $thisSelectedScheduleTime){
            $(this).attr("disabled", true)
            }
        }

        if($checkboxIsChecked == false){
            if($selectedScheduleTime === $thisSelectedScheduleTime){
            $(this).removeAttr("disabled")
            }
       }

    })
});

function checkTimeSchedule(checkboxScheduleValue) {
    let $sessionTime = "unassigned"
    const $regexSessionCheckTuesdayAM = /(Tuesday)\s(9am)\-(.*?)\,/
    const $regexSessionCheckWednesdayAM = /(Wednesday)\s(9am)\-(.*?)\,/
    const $regexSessionCheckTuesdayPM =  /(Tuesday)\s(1pm)\-(.*?)\,/
    const $regexSessionCheckWednesdayPM = /(Wednesday)\s(1pm)\-(.*?)\,/

        if ($regexSessionCheckTuesdayAM.test(checkboxScheduleValue)){
        $sessionTime = "teusdayam"
        }
        if ($regexSessionCheckTuesdayPM.test(checkboxScheduleValue)){
            $sessionTime = "teusdaypm"
        }
        if ($regexSessionCheckWednesdayAM.test(checkboxScheduleValue)){
            $sessionTime = "wednesdayam"
        }
        if ($regexSessionCheckWednesdayPM.test(checkboxScheduleValue)){
            $sessionTime = "wednesdaypm"
        }
        
    return $sessionTime
}

// Adds cost when user clicks box to running total
function addClassCost(checkboxScheduleValue) {
    const $regexClassCost = /(\$)(\d*)/
    const $classCost = checkboxScheduleValue.match($regexClassCost)
    $total += parseInt($classCost[2])
    $("#total").replaceWith('<p id="total">Total: $' + $total + '</p>')
}

// Subtracts cost when users unclicks box
function subtractClassCost(checkboxScheduleValue){
    const $regexClassCost = /(\$)(\d*)/
    const $classCost = checkboxScheduleValue.match($regexClassCost)
    $total -= parseInt($classCost[2])
    $("#total").replaceWith('<p id="total">Total: $' + $total + '</p>')
}

//Hides and unhides payment divs
$("#payment").change(function(){
    const $paymentValue = $(this).val()

    if($paymentValue === "paypal"){
        $("#credit-card").hide()
        $bitcoinDiv.hide()
        $paypalDiv.show()
    }
    if($paymentValue === "bitcoin"){
        $paypalDiv.hide()
        $("#credit-card").hide()
        $bitcoinDiv.show()
    }
    if($paymentValue === "credit card"){
        $bitcoinDiv.hide()
        $paypalDiv.hide()
        $("#credit-card").show()
    }
});

// Validate form fields and add CSS for invalid inputs
$("input").on("click change keyup blur keydown",function(){
    validateFormFields()
})

//Validate form fields
$("form").submit(function() {
    
    if($('#cvv').is(":visible")){
    if(!(validateName()) || !(validateEmail()) || !(validateCreditCard()) || !(validZipCode()) || !(validCVV()) || !(checkUserActivityIsRegistered())){
        event.preventDefault()
    }
    } else {
        if(!(validateName()) || !(validateEmail()) || !(checkUserActivityIsRegistered())){
            event.preventDefault()
        } 
    }
})

//Validate all form fields
function validateFormFields(){
    validateName()
    validateEmail()
    validateCreditCard()
    validZipCode()
    validCVV()
    checkUserActivityIsRegistered()
}

//Validate name field add CSS styling error if invalid input
function validateName() {
    const $nameInputElement = $("#name")
    if($nameInputElement.val() != ""){
        $nameInputElement.removeClass("error")
        return true
    }
    $nameInputElement.addClass("error")
    return false
}

//Validate email field add css style if invalid input
function validateEmail(){
    const $regexMail = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    const $emailInputElement = $("#mail")

    if(!$regexMail.test($emailInputElement.val()) || $emailInputElement.val() == "") {
        $emailInputElement.addClass("error")
      return false
    }else{
        $emailInputElement.removeClass("error")
      return true
    }
}

//Validate Credit Card add css style if invalid input
function validateCreditCard() {
    const $regexCCNumber = /(\d{16}|\d{13})/
    const $ccNumberInputElement = $("#cc-num")

    if(!$regexCCNumber.test($ccNumberInputElement.val())){
        $ccNumberInputElement.addClass("error")
        return false
    } else {
        $ccNumberInputElement.removeClass("error")
        return true
    }

}

//Validate zip code add css style error if invalid input
function validZipCode() {
    const $zipCode = /(\d{5})/
    const $zipCodeInputElement = $("#zip")
    if(!$zipCode.test($zipCodeInputElement.val())){
        $zipCodeInputElement.addClass("error")
        return false
    } else {
        $zipCodeInputElement.removeClass("error")
        return true
    }
}

//Validate CVV code add css style error if invalid input
function validCVV() {
    const $cvv = /(\d{3})/
    const $cvvInputValue = $("#cvv")

    if(!$cvv.test($cvvInputValue.val())){
        $cvvInputValue.addClass("error")
        console.log("false with cvv visible")
        return false
    } else  {
        $cvvInputValue.removeClass("error")
        console.log("true with cvv visibile")
        return true
        } 
}

//Check if user is registered to at least 1 activity
function checkUserActivityIsRegistered() {
    if($total == 0){
        $activitiesFieldSet.addClass("error")
        return false
    } else {
        $activitiesFieldSet.removeClass("error")
        return true
    }
}
