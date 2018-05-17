var questions = [ "How well do you understand this text?",
                  "How interesting is this text to you?",
                  "Rewrite this section so that you can understand it better.",
                  "Rewrite this section to be the most interesting to you."];

var response_styles = [ "radio10", "radio10", "text", "text"];

var num_questions_per_section = 4;


//SIMPLE STATE MACHINE
var arrayForEachForm;



// identify location of mouse then identify location of nearest text div
$(document).ready(function(){

  var sections = document.getElementsByClassName('page_section');
  var arr_sections = Array.from(sections);
  var num_forms = arr_sections.length;
  // console.log(arr_sections)

  //Append feedback to all the sections
  var i = 0;
  arr_sections.forEach(function(e){
    appendFeedback(e, e.textContent, i);
    i++;
  });

  $(document.getElementById("yolo")).on('click', function(event) {
    event.preventDefault();
    var elt = $(event.target);
    var form = elt[0].parentElement;
    console.log(elt[0].parentElement);
      // console.log(event);
  });

  //Hide the cards used for getting feedback
  // var feedback_cards = document.getElementsByClassName("card");
  // arr_feedback_cards = Array.from(feedback_cards)
  // arr_feedback_cards.forEach(function(e){
  //   e.style.display = "none";
  // }).callback(function(){
  //   showFeedback();
  // })

  //TODO: TIMER!!

  // showFeedback()
});

//After a time delay, show feedback for all sections
// TODO: Could show feedback depending on mouse movement/hover

function showFeedback() {
  var form_groups = document.getElementsByClassName("form-group");
  var arr_form_groups = Array.from(form_groups);
  // console.log(form_groups)

  for (let i=0; i <arr_form_groups.length; ++i) {
    // Show only the first
    if (i%4 === 0) {
      form_groups[i].style.display="block";
    }
    else {
      form_groups[i].style.display="none";
    }
  }

}

function showNext(event) {
  event.preventDefault()
  console.log(event)
}
//log the data and send it somewhere
//log which section type it is??


// HELPER FUNCTIONS
function appendFeedback(section, section_content, i) {
  var feedbackNode = '<div class="card text-white bg-info mb-3" style="max-width: 25rem;"><div class="card-header">Give us your feedback!</div><div class="card-body"><form id=form' + i.toString() + '>'
  section.innerHTML += (feedbackNode + populateQuestions("form" + i.toString(), section_content));
}

function populateQuestions(formId, section_content) {
  var feedback_div="";
  let i=0;
  questions.forEach(function(e){
      var question_div = '<div class="' + formId + ' form-group"><p>' + e + '</p>' +
          getResponseOptions(i, section_content, formId) + '</div>'
      feedback_div += question_div;
      i++;
      console.log(i)
  });
  return feedback_div;
}

function getResponseOptions(index, section_content, formNum) {
  //check if radio buttons are necessary
  var response_div ='';
  if (response_styles[index].includes('radio')) {
    response_div += '<div class="btn-group" data-toggle="buttons">';
      let numRadios = parseInt(response_styles[index].substring(5));
      for (let i=0; i < numRadios; ++i) {
        response_div += '<button class="btn btn-light btn-success" onclick="this.classList.toggle(\''+'btn-light'+'\');">' + i.toString() + '</button>';
      }
      response_div += '</div><button class="btn btn-small" type="submit" id="yolo" style="float:right">Next</button>'
  }
  else if (response_styles[index].includes('text')) {
    response_div += '<textarea class="form-control" rows="3">' + section_content + '</textarea><button class="btn btn-small btn-light btn-success" onclick="this.classList.toggle(\''+'btn-light'+'\'); return false; ">Improved!</button>'
  }
  else {
    response_div += '</div>'
    console.log('ERROR! Not sure what the response type should be for this question.' + questions[index])
  }

  return response_div;
}

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}


//// TODO: change to next question (show one at a time); colors for button
