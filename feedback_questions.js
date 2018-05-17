var questions = [ "How well do you understand this text?",
                  "How interesting is this text to you?",
                  "Rewrite this section so that you can understand it better.",
                  "Rewrite this section to be the most interesting to you."]

var response_styles = [ "radio10", "radio10", "text", "text"]

function populateQuestions(formId) {
  var feedback_div;
  questions.forEach(function(e){
      let i=0;
      var question_div = '<div class="form-group"><p>' + e + '</p>' +
          getResponseOptions(i) + '</div>'
      feedback_div += question_div;
  });
  document.getElementById(formId).innerHTML = feedback_div;
}

function getResponseOptions(index) {
  //check if radio buttons are necessary
  var response_div ='<div class="btn-group" data-toggle="buttons">'
  if (response_styles[index].includes('radio')) {
      let numRadios = parseInt(response_styles[index].substring(5));
      for (let i=0; i < numRadios; ++i) {
        response_div += '<button class="btn btn-light btn-success" onclick="this.classList.toggle("btn-light");">' + i.toString() + '</button>';
      }
      response_div += '</div>'
  }
  else if (response_styles[index].includes('text')) {

    response_div += '</div>'

  }
  else {
    response_div += '</div>'
    console.log('ERROR! Not sure what the response type should be for this question.' + questions[index])
  }

  return response_div;
}
