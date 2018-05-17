var questions = [ "How well do you understand this text?",
                  "How interesting is this text to you?",
                  "Rewrite this section so that you can understand it better.",
                  "Rewrite this section to be the most interesting to you."];

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
  var sections = document.getElementsByClassName('page_section');

  // $(".page_section").append("<div style='float:right'>TEST</div>");

  for (let s=0; s < sections.length; ++s) {
    console.log(sections[s]);
    // sections[s].innerHTML += '<div style="float:right">TEST</div>';
    sections[s].innerHTML += '<div class="card text-white bg-info mb-3" style="max-width: 25rem; float:right" id="' + s.toString() + '"><div class="card-header">Give us your feedback!</div><div class="card-body">';
  }

  //show first question
  for (let i=0; i < arr_forms_questions.length; i++) {
    var elt = document.getElementById(i);
    console.log(elt);
    elt.innerHTML += arr_forms_questions[i][0];
    arr_forms_state[i][0] = 1;
    // console.log(elt);
  }

  // EVENTS
  // add onClick event to move on to the next question for a form
  $(document.getElementsByClassName("next")).on('click', function(event) {
    event.preventDefault();

    let elt = $(event.target);
    let form_group = elt[0].parentElement;
    let form = form_group.parentElement;
    let form_num = parseInt((form.id).substring(4));
    let form_parent = form.parentElement

    //update state and show next question
    let first_thing = arr_forms_state.find((e) => true);
    console.log(first_thing);

    for (let i=0; i < num_questions_per_section; ++i) {
      if (arr_forms_state[form_num][i] === 1) {
        console.log(arr_forms_state[form_num]);
        arr_forms_state[form_num][i] = 0;
        form_parent.innerHTML =  arr_forms_questions[form_num][i+1];
        arr_forms_state[form_num][i+1] = 1;
      }
    }

    // console.log(arr_forms_state[form_num][1]);




    // console.log(form);


    // console.log(form === elt[0].parentElement.parentElement);
  });

  //TODO: TIMER!!
});

function showNext(event) {
  event.preventDefault()
  console.log(event)
}
//log the data and send it somewhere
//log which section type it is??


// HELPER FUNCTIONS
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

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

function initializeQuestionsArray() {
  var sections = document.getElementsByClassName('page_section');
  var arr_sections = Array.from(sections);
  var num_forms = arr_sections.length;

  for (let r=0; r < num_forms; ++r) {
    let arr = [];
    for (let c=0; c < num_questions_per_section; c++) {
      arr.push(0);
    }
    arr_forms_questions.push(arr);
  }
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

  let q_HTML = '<form id=form' + formNum.toString() + '><div class="form-group"><p>' + questions[qNum] + '</p>' + getResponseOptions(qNum) + '</div>';

  return q_HTML;
}

function getResponseOptions(index) {
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
    response_div += '<textarea class="form-control" rows="3">' + 'SECTION CONTENT' + '</textarea><button class="btn btn-small btn-light btn-success next" onclick="this.classList.toggle(\''+'btn-light'+'\'); return false; ">Next</button>'
  }
  else {
    response_div += '</div>'
    alert('ERROR! Not sure what the response type should be for this question.' + questions[index])
  }
  return response_div;
}

function showQuestion(num) {
  var form_groups = document.getElementsByClassName("form-group");
  var arr_form_groups = Array.from(form_groups);

  for (let i=0; i <arr_form_groups.length; ++i) {
    // show only the first question
    if (i%num_questions_per_section === 0) {
      form_groups[i].style.display="block";
    }
    else {
      form_groups[i].style.display="none";
    }
    //update state machine
    arr_forms_state.forEach(function(e){
      e[0] = 1;
    })

  }
}

function appendFeedback(section, section_content, i) {
  var feedbackNode =
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

function orig_getResponseOptions(index, section_content, formNum) {
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

//// TODO: change to next question (show one at a time); colors for button
