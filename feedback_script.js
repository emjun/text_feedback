var questions = [ "How well do you UNDERSTAND this text?",
                  "How INTERESTING is this text to you?",
                  "Rewrite this section so that you find it EASIER to UNDERSTAND.",
                  "Rewrite this section to be the MOST INTERESTING to you."];

var response_styles = [ "radio10", "radio10", "text", "text"];

var num_questions_per_section = 4;


//SIMPLE STATE MACHINE
//2D array where arr[i] = form number i and
//arr[i][n] = question number n for form i
var arr_forms_state = [];
//2D array containing all questions for all forms
var arr_forms_questions = [];



// identify location of mouse then identify location of nearest text div
$(document).ready(function(){

  //initialize
  initialize();

  //add places for feedback questions
  attachFeedbackPlaces();

  //show first question
  for (let i=0; i < arr_forms_questions.length; i++) {
    var elt = document.getElementById(i);
    console.log(elt);
    elt.innerHTML += arr_forms_questions[i][0];
    arr_forms_state[i][0] = 1;
  }

  // EVENTS
  // add onClick event to move on to the next question for a form
  $('body').on('click', ".next", function (event){
  // $(document.getElementsByClassName("next")).on('click', function(event) {
    event.preventDefault();

    let elt = $(event.target);
    let form_group = elt[0].parentElement;
    let form = form_group.parentElement;
    let form_num = parseInt((form.id).substring(4));
    // let form_parent = form.parentElement

    //update state and show next question
    let curr_q = arr_forms_state[form_num].indexOf(1);
    if (curr_q < num_questions_per_section-1) {
        //update what's shown
        form.innerHTML =  arr_forms_questions[form_num][curr_q+1];

        //extract text from section on page
        let curr_section = $(document.getElementsByClassName('page_section'))[form_num];
        let section_text = curr_section.firstChild;


        console.log()
        //update state machine
        arr_forms_state[form_num][curr_q] = 0;
        arr_forms_state[form_num][curr_q + 1] = 1;
    }
    else {
      alert('end!');
      //show thank you page and disappear
      finish();
    }

  });
});

//log the data and send it somewhere
//log which section type it is??


// HELPER FUNCTIONS
function initialize() {
  var sections = document.getElementsByClassName('page_section');
  var arr_sections = Array.from(sections);
  var num_forms = arr_sections.length;

  //initialize 2D array that keeps track of forms
  //to show all forms as showing no questions
  console.log(arr_forms_state);

  for (let f=0; f<num_forms; ++f) {
      let arr = [];
      for (let j=0; j < num_questions_per_section; j++) {
        arr.push(0);
      }
      arr_forms_state.push(arr);
      arr_forms_questions.push(arr.slice(0));
  }

  populateQuestionsArray();

}

function populateQuestionsArray() {
  //loop through arr_forms_questions to update with HTML for each question
  for (let r=0; r < arr_forms_questions.length; ++r) {
    for (let c=0; c < num_questions_per_section; ++c) {
      // arr_forms_questions[r][c] = getQuestion(r,c);
      arr_forms_questions[r][c] = getQuestion(r,c) ;
      }
  }
}

function getQuestion(formNum, qNum) {
  // let q_HTML = '<div class="card text-white bg-info mb-3" style="max-width: 25rem;"><div class="card-header">Give us your feedback!</div><div class="card-body">'

  let q_HTML = '<form id=form' + formNum.toString() + '><div class="form-group"><p>' + questions[qNum] + '</p>' + getResponseOptions(formNum, qNum) + '</form></div>';

  return q_HTML;
}

function getResponseOptions(formNum, index) {

  let curr_section = $(document.getElementsByClassName('page_section'))[formNum];
  let section_text = curr_section.firstChild.textContent;
  // console.log(section_text.textContent);

  let response_div ='';
  if (response_styles[index].includes('radio')) {
    response_div += '<div class="btn-group" data-toggle="buttons">';
      let numRadios = parseInt(response_styles[index].substring(5));
      for (let i=0; i < numRadios; ++i) {
        response_div += '<button class="btn btn-light btn-success" onclick="this.classList.toggle(\''+'btn-light'+'\');">' + i.toString() + '</button>';
      }
      response_div += '</div><button class="btn btn-small next" type="submit" style="float:right">Next</button>'
  }
  else if (response_styles[index].includes('text')) {
    response_div += '<textarea class="form-control" rows="3">"' + section_text + '"</textarea><button class="btn btn-small btn-light btn-success next" type="submit" style="float:right">Next</button>'
  }
  else {
    response_div += '</div>'
    alert('ERROR! Not sure what the response type should be for this question.' + questions[index])
  }
  return response_div;
}

function attachFeedbackPlaces() {
  var sections = document.getElementsByClassName('page_section');
  for (let s=0; s < sections.length; ++s) {
    console.log(sections[s]);
    // sections[s].innerHTML += '<div style="float:right">TEST</div>';
    sections[s].innerHTML += '<div class="card text-white bg-info mb-3" style="max-width: 25rem; float:right" id="' + s.toString() + '"><div class="card-header">Give us your feedback!</div><div class="card-body">';
  }
}

//// TODO: change to next question (show one at a time); colors for button
