let modal_body = document.getElementById('modal_body');
let dynamic_form = document.getElementById('dynamic_form_container');
let json_data_input = document.getElementById('json_data');
let current_selected_input_field = null;
let question_no = 0;
let question_json = [];
let options = [];
function append_form(obj){
    remove_active();
    current_selected_input_field = obj.id;
    obj.classList.add('active');
    if(obj.id == 'short_answer' || obj.id == 'long_answer'){
        modal_body.innerHTML = `
            <div class="form-group form-inline">
                <label for="input_title">Input Title &nbsp;&nbsp;&nbsp;</label>
                <input type="text" class="form-control" id="input_title" placeholder="Enter Input Title">
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="id_required">
                <label class="form-check-label" for="id_required">
                   Required
                </label>
            </div>
        `;
    }
    else if(obj.id == 'multiple_choice' || obj.id == 'Check_box'){
        options = [];
        modal_body.innerHTML = `
            <div class="form-group form-inline">
                <label for="input_title">Input Title &nbsp;&nbsp;&nbsp;</label>
                <input type="text" class="form-control" id="input_title" placeholder="Enter Input Title">
            </div>
            <div class="form-group form-inline">
                <input type="text" class="form-control" id="add_option" placeholder="Enter Option">
                <label for="add_option">&nbsp;&nbsp;&nbsp; <a onclick="add_option()" id="id_add_option">Add option</a></label>
            </div>
            <b>Options</b>
            <ul id="id_options">

            </ul>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="id_required">
                <label class="form-check-label" for="id_required">
                   Required
                </label>
            </div>
        `;
    }
    else if(obj.id == 'range'){
        modal_body.innerHTML = `
            <div class="form-group form-inline">
                <label for="input_title">Input Title &nbsp;&nbsp;&nbsp;</label>
                <input type="text" class="form-control" id="input_title" placeholder="Enter Input Title">
            </div>
            <div class="form-group form-inline">
                <label for="input_min">Input Minimum &nbsp;&nbsp;&nbsp;</label>
                <input type="number" class="form-control" id="input_min" placeholder="Enter Input Minimum">
            </div>
            <div class="form-group form-inline">
                <label for="input_max">Input Maximum &nbsp;&nbsp;&nbsp;</label>
                <input type="number" class="form-control" id="input_max" placeholder="Enter Input Maximun">
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="id_required">
                <label class="form-check-label" for="id_required">
                   Required
                </label>
            </div>
        `;
    }
    $('#inputmodal').modal('show');
}

function add_option(){
    let option = document.getElementById('add_option').value;
    if(option != ''){
        options.push(option);
        document.getElementById('id_options').innerHTML += `<li>${option}</li>`;
    }
}

function remove_active(){
    if(current_selected_input_field != null){
        document.getElementById(current_selected_input_field).classList.remove('active');
    }
}

function append_card(){
    remove_active();
    question_no += 1;
    let adding_card;
    let temp_json;
    if(current_selected_input_field == 'short_answer'){
        let title = document.getElementById('input_title').value;
        let required = document.getElementById('id_required').checked;
        let mark = (required) ? '*':'';
        adding_card = `
            <div class="card input_card">
                <div class="card-body">
                <h5 class="card-title">${title}${mark}</h5>
                <hr>
                </div>
            </div>
            <br>
        `;
        temp_json = {
            "name": "question"+question_no,
            "label": title,
            "type": "text",
            "max_length": 25,
            "required": required
        }
    }
    else if(current_selected_input_field == 'long_answer'){
        let title = document.getElementById('input_title').value;
        let required = document.getElementById('id_required').checked;
        let mark = (required) ? '*':'';
        adding_card = `
            <div class="card input_card">
                <div class="card-body">
                <h5 class="card-title">${title}${mark}</h5>
                <hr>
                </div>
            </div>
            <br>
        `;
        temp_json = {
            "name": "question"+question_no,
            "label": title,
            "type": "textarea",
            "max_length": 250,
            "required": required
        }
    }
    else if(current_selected_input_field == 'multiple_choice'){
        let title = document.getElementById('input_title').value;
        let required = document.getElementById('id_required').checked;
        let mark = (required) ? '*':'';
        let option_html = '';
        options.forEach(option => {
            option_html += `
                <div class="form-check disabled">
                    <input class="form-check-input" type="radio" disabled>
                    <label class="form-check-label">
                    ${option}
                    </label>
                </div>
            `;
        });
        adding_card = `
            <div class="card input_card">
                <div class="card-body">
                <h5 class="card-title">${title}${mark}</h5>
                ${option_html}
                </div>
            </div>
            <br>
        `;
        temp_json = {
            "name": "question"+question_no,
            "label": title,
            "type": "radio",
            "choices": options,
            "required": required
        }
    }
    else if(current_selected_input_field == 'Check_box'){
        let title = document.getElementById('input_title').value;
        let required = document.getElementById('id_required').checked;
        let mark = (required) ? '*':'';
        let option_html = '';
        options.forEach(option => {
            option_html += `
                <div class="form-check disabled">
                    <input class="form-check-input" type="checkbox" disabled>
                    <label class="form-check-label">
                    ${option}
                    </label>
                </div>
            `;
        });
        adding_card = `
            <div class="card input_card">
                <div class="card-body">
                <h5 class="card-title">${title}${mark}</h5>
                ${option_html}
                </div>
            </div>
            <br>
        `;
        temp_json = {
            "name": "question"+question_no,
            "label": title,
            "type": "checkbox",
            "choices": options,
            "required": required
        }
    }
    else if(current_selected_input_field == 'range'){
        let title = document.getElementById('input_title').value;
        let required = document.getElementById('id_required').checked;
        let min = document.getElementById('input_min').value;
        let max = document.getElementById('input_max').value;
        let mark = (required) ? '*':'';
        adding_card = `
            <div class="card input_card">
                <div class="card-body">
                <h5 class="card-title">${title}${mark}</h5>
                <p>Min : ${min}</p>
                <p>Max : ${max}</p>
                <hr>
                </div>
            </div>
            <br>
        `;
        temp_json = {
            "name": "question"+question_no,
            "label": title,
            "type": "range",
            "min": min,
            "max": max,
            "required": required
        }
    }
    question_json.push(temp_json);
    dynamic_form.innerHTML += adding_card;
    $('#inputmodal').modal('hide');
    json_data_input.value = JSON.stringify(question_json);
    console.log(question_json);
    console.log(json_data_input.value);
}