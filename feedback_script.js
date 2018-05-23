var questions = [ "How well do you UNDERSTAND this section? (10 is best)",                  "Explain this information to yourself.",
                  // "Edit this section so that you find it EASIER to UNDERSTAND.",
                  "How INTERESTING is this section to you? (10 is best)",
                  "Edit this section to be the MOST INTERESTING to you.",
                  "What questions do you have about this section?"];

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


function getFeedback() {
window.setTimeout(randomizeFeedback, 7000);
}

//randomize which kind }of feedback to ask for (EXTENSIVE vs. THUMBS)
function randomizeFeedback() {
  let choice = Math.floor(Math.random() * 2);

  if (choice  === 0) {
    window.setTimeout(askFeedback, 7000);
  }
  else {
    askVote();
  }
}


//EXTENSIVE FEEDBACK W LIKERT RATINGS & TEXT FEEDBACK
function askFeedback() {
  console.log('hi')

  //initialize
  initialize();
  populateQuestionsArray();


  //add places for feedback questions
  toggleVotePlaces();
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
  });
}

function toggleVotePlaces() {
  $('.thumbs').display = 'none';
}

//THUMBS UP/DOWN & TEXT FEEDBACK
function askVote() {
  // console.log('here');
  // sleep(5000);
  // console.log('after sleep');

  initialize();
  attachVotePlaces();

  //handle THUMBS
  $('body').on('click', ".thumbs", function (event){
    event.preventDefault();

    let elt = $(event.target);
    let elt_parent = elt[0].parentElement;
    console.log(elt_parent);
    let elt_parent_location = elt_parent.getBoundingClientRect();
    let card_top = elt_parent_location.top;
    console.log(elt_parent);

    //upvote
    if (elt.attr('class').includes('thumbs_up')) {

      console.log(elt);

      let up = elt[0];
      let down = elt_parent.children[1];

      //change color
      if(elt.attr('class').includes('btn-light')) {

        console.log(down);
        down.classList.remove('btn-success');
        down.classList.add('btn-light');

        up.classList.remove('btn-light');
        up.classList.add('btn-success');


      }
      else {
        up.classList.remove('btn-success');
        up.classList.add('btn-light');

      }

      // logVote();
    }
    //downvote
    else {
      // logVote(); // right away or wait until later?

      let down = elt[0];
      let up = elt_parent.children[0];
      console.log(up);

      //change color
      if(elt.attr('class').includes('btn-light')) {

        down.classList.remove('btn-light');
        down.classList.add('btn-success');

        up.classList.remove('btn-success');
        up.classList.add('btn-light');

        //ask follow-up
        elt_parent.parentElement.innerHTML +='<div class="card text-white bg-info mb-3" style="max-width: 25rem; float:right; top:' + card_top + '" id=""><div class="card-header"></div><div class="card-body"><form><div class="form-group"><p>How could we improve this section?</p><textarea class="form-control" rows="3"></textarea><button class="btn btn-small btn-light btn-success improved" type="submit" style="float:right">Thanks!</button></div></form></div>';

        //logData();
      }
      else {
        down.classList.remove('btn-success');
        down.classList.add('btn-light');

      }

      //logData();
    }
  });

  //handle IMPROVED
  $('body').on('click', ".improved", function(event) {
    event.preventDefault();

    let elt = $(event.target);
    let form_group = elt[0].parentElement;
    let form = form_group.parentElement;
    let card_body = form.parentElement;
    let card = card_body.parentElement;

    //make card for improving section invisible
    card.style.display = 'none';


    // logData();
  });

}


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
    sections[s].parentElement.innerHTML += '<div class="card cardExtensive text-white bg-info mb-3" style="max-width: 25rem; float:right; top:' + feedback_location_top + '" id="' + s.toString() + '"><div class="card-header">Give us your feedback!</div><div class="card-body">';
  }
}

function attachVotePlaces() {
  console.log('attach vote places');

  let page_sections = document.getElementsByClassName('thumbs_section');
  let thumbs_sections = document.getElementsByClassName('thumbs');

  for (let s=0; s < page_sections.length; ++s) {
    // let parent = page_sections[s].parentElement;
    // parent.innerHTML
    page_sections[s].classList.add('col-10');
  }
  for (let t=0; t < thumbs_sections.length; ++t) {
    thumbs_sections[t].classList.add('col-1');
    thumbs_sections[t].innerHTML += '<button type="button" class="btn btn-light btn-lg thumbs_up">👍</button><button type="button" class="btn btn-light btn-lg thumbs_down">👎</button>';
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
