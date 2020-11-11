let question_bank = document.getElementById('question_bank');
function load_form(){
    questions.forEach(question => {
        create_element(question)
    });
    var elems  = document.querySelectorAll("input[type=range]");
    M.Range.init(elems);
}

function create_element(question){
    let is_required = (question['required']) ? 'required' : '';
    let is_required_mark = (question['required']) ? '<sup>*</sup>' : '';
    if(question['type'] == 'text'){
        question_bank.innerHTML += `
        
            <div class="row">
                <div class="input-field col s12">
                <input id="${question['name']}" name="${question['name']}" type="${question['type']}" class="validate" ${is_required}>
                <label for="${question['name']}">${question['label']}${is_required_mark}</label>
                </div>
            </div>
    
        `;
    }
    else if(question['type'] == 'textarea'){
        question_bank.innerHTML += `
        
            <div class="row">
                <div class="input-field col s12">
                    <textarea id="${question['name']}" name="${question['name']}" class="materialize-textarea"></textarea>
                    <label for="${question['name']}">${question['label']}${is_required_mark}</label>
                </div>
            </div>
    
        `;
    }
    else if(question['type'] == 'radio'){
        let radio_option = `<label for="textarea1"><b>${question['label']}${is_required_mark}</b></label>`;
        question['choices'].forEach(choice => {
            radio_option += `
                <p>
                    <label>
                        <input class="with-gap" name="${question['name']}" type="radio" value="${choice}"/>
                        <span>${choice}</span>
                    </label>
                </p>
            `;
        });
        question_bank.innerHTML += radio_option;
    }
    else if(question['type'] == 'checkbox'){
        let radio_option = `<label for="textarea1"><b>${question['label']}${is_required_mark}</b></label>`;
        question['choices'].forEach(choice => {
            radio_option += `
                <p>
                    <label>
                        <input class="with-gap" name="${question['name']}" type="checkbox" value="${choice}"/>
                        <span>${choice}</span>
                    </label>
                </p>
            `;
        });
        question_bank.innerHTML += radio_option;
    }
    else if(question['type'] == 'range'){
        question_bank.innerHTML += `
        
            <div class="row">
                <div class=" col s12">
                    <label>${question['label']}${is_required_mark}</label>
                    <p class="range-field">
                        <input id="${question['name']}" name="${question['name']}" type="range" id="test5" min="${question['min']}" max="${question['max']}"  ${is_required}/>
                    </p>                
                </div>
            </div>
    
        `;
    }
}

window.onload = load_form()