var questions = [ "How well do you UNDERSTAND this text? (10 is best)",
                  "Rewrite this section so that you find it EASIER to UNDERSTAND.",
                  "How INTERESTING is this text to you? (10 is best)",
                  "Rewrite this section to be the MOST INTERESTING to you.",
                  "What questions do you have about this text?"];

var response_styles = [ "radio10", "text", "radio10", "text", "textOpen"];

var num_questions_per_section = questions.length;


//SIMPLE STATE MACHINE
//2D array where arr[i] = form number i and
//arr[i][n] = question number n for form i
var arr_forms_state = [];
//2D array containing all questions for all forms
var arr_forms_questions = [];
//Object of all the responses to forms for each section
var responses = {};



// identify location of mouse then identify location of nearest text div
// $(document).ready(function(){

function askFeedback() {
  console.log('hi')

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

    //check if answering a Likert scale question triggered event
    if (elt.attr('class').includes('likert')) {
      //check response value
      let likert_val = elt[0].value;
      let likert_group = elt[0].parentElement;
      let form_group = likert_group.parentElement;
      let form = form_group.parentElement;
      let form_num = parseInt((form.id).substring(4));

      logData();

      let curr_q = arr_forms_state[form_num].indexOf(1);
      arr_forms_state[form_num][curr_q] = 0;

      if (likert_val <= 7) {
        //ask Rewrite question
        let next_q = curr_q+1;

        if (next_q < num_questions_per_section) {
          //update what's shown
          form.innerHTML =  arr_forms_questions[form_num][next_q];
          arr_forms_state[form_num][next_q] = 1;
        }
        else {
          finish();
        }
      }
      else {
        //skip Rewrite question
        let next_q = curr_q+2;

        if (next_q < num_questions_per_section) {
          //update what's shown
          form.innerHTML =  arr_forms_questions[form_num][next_q];
          arr_forms_state[form_num][next_q] = 1;
        }
        else {
          finish();
        }
      }
    }
    //it was clicking a next button, after Rewriting a section
    else {
      let form_group = elt[0].parentElement;
      let form = form_group.parentElement;
      let form_num = parseInt((form.id).substring(4));

      logData();

      let curr_q = arr_forms_state[form_num].indexOf(1);
      arr_forms_state[form_num][curr_q] = 0;

      let next_q = curr_q+1;
      if (next_q < num_questions_per_section) {
        //update what's shown
        form.innerHTML =  arr_forms_questions[form_num][next_q];
        arr_forms_state[form_num][next_q] = 1;
      }
      else {
        finish();
      }


    }

    //log data
    // let curr_q = arr_forms_state[form_num].indexOf(1);

    // //update state and show next question
    // if (curr_q < num_questions_per_section-1) {
    //     //update what's shown
    //     form.innerHTML =  arr_forms_questions[form_num][curr_q+1];
    //
    //     //update state machine
    //     arr_forms_state[form_num][curr_q] = 0;
    //     // arr_forms_state[form_num][curr_q + 1] = 1;
    // }
    // else {
    //   alert('end!');
    //   //show thank you page and disappear
    //   finish();
    // }

  });
}
// });

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

  let response_div ='';
  if (response_styles[index].includes('radio')) {
    response_div += '<div class="btn-group" data-toggle="buttons">';
      let numRadios = parseInt(response_styles[index].substring(5));
      for (let i=0; i < numRadios; ++i) {
        response_div += '<button class="btn btn-light btn-success likert next" value="' + (i+1).toString() + '" onclick="this.classList.toggle(\''+'btn-light'+'\');">' + (i+1).toString() + '</button>';
      }

      //area for participants to ask additonal questions
      // response_div += '<textarea class="form-control" rows="3"></textarea>';
      // response_div += '</div><button class="btn btn-small next" type="submit" style="float:right">Next</button>'
  }
  else if (response_styles[index].includes('text')) {
    if (response_styles[index].includes('Open')) {
      section_text = 'What does...?'; //don't fill the textarea with text from the section
    }
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
    let parent = sections[s].parentElement;
    console.log(parent);
    let parent_location = parent.getBoundingClientRect();
    let feedback_location_top = parent_location.top;
    console.log(parent_location)
    sections[s].parentElement.innerHTML += '<div class="card text-white bg-info mb-3" style="max-width: 25rem; float:right; top:' + feedback_location_top + '" id="' + s.toString() + '"><div class="card-header">Give us your feedback!</div><div class="card-body">';
  }
}

function logData() {
  console.log('log data');

  // let form_response = {};
  // let curr_section = $(document.getElementsByClassName('page_section'))[form_num];
  // let section_text = curr_section.firstChild.textContent;
  // form_response[section_text] = {}
  // form_response[questions[curr_q]] = 'yes'
  // responses[form_num] = form_response;
  //
  // console.log(responses);
}

function finish() {
  //log the data and send it somewhere
  //log which section type it is??

  console.log('finished the form!');

}
