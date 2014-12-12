/*Drag and drop */
function enableDrop(ev){
    ev.preventDefault();
}

function dragStart(ev){

    ev.dataTransfer.setData('Object', ev.target.id);
    ev.dataTransfer.effectAllowed = 'move';
}

function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    data = null;
}

/* 
 * Adds all point values from questions and displays total at top of page
 */
function addPts(){
   var numPts = document.getElementsByClassName("points").length;
   var total = 0;
   var i;
   
   for (i = 0; i < numPts; i++)
   {
        total += parseInt(document.getElementById("points_"+i).value) || 0;
   }
   //var output = document.getElementById("totalPoints");
   //node.innerHTML = total;
   document.getElementById("quiz_points_counter").innerHTML = "("+total+" pts)";
   numPts = total = i = null;
}

/* 
 * Finds the appropriate target when element is dropped in question list
 * @param {Object} ev - Drop event
 */
function dropSwitch(ev)
{
    var node = document.getElementById(ev.dataTransfer.getData('Object'));
    var targetItem = ev.target;
    
    if (node.id.substring(0,2) === 'qt' && (targetItem.id === 'dragarea' || targetItem.parentNode.id === 'dragarea')) {
        var id = node.id.substring(3);
        addQuestion('dragarea', id);
    }
    else {
        while (targetItem && targetItem.parentNode !== node.parentNode)
            targetItem = targetItem.parentNode;
        appendAfter(targetItem, node);
    }
    targetItem = node = id = null;
}
/************************************ HELPER FUNCTIONS **************************************/
/* 
 * Moves a new element into the DOM tree, after the given element 
 * @param {Object} node - Node already existing in the DOM 
 * @param {Object} newNode - Node being inserted into the tree
 */
function appendAfter(node, newNode) {
    if (node.parentNode) {
        if (node.nextSibling)
            node.parentNode.insertBefore(newNode, node.nextSibling);
        else
            node.parentNode.appendChild(newNode);
    }
}

/* 
 * Removes given element from the question list
 * @param {string} n - The id of the node to remove
 */
function remNode(n) {
    var node = document.getElementById(n);
    node.parentNode.removeChild(node);
    node = null;
    return false;
}

/* 
 * Moves given element to the top of the question list
 * @param {string} n - The id of the node to move
 */
function moveToTop(n) {
    var node = document.getElementById(n);
    appendAfter(document.getElementById('dragarea'), node);
    node = null;
}

/* 
 * Moves given element to the bottom of the question list
 * @param {string} n - The id of the node to move
 */
function moveToBtm(n) {
    var node = document.getElementById(n);
    var questions = document.getElementsByClassName('ea');
    var target = questions[questions.length-1];
    appendAfter(target, node);
    node = questions = target = null;
}


/*
 * The initial set of questions when you create a quiz.
 * Note that items are added under the drag area, so
 * enter items in reverse order
 */
function startQuestions() {
    addQuestion('dragarea', 'fa'); 
    addQuestion('dragarea', 'sa');
    addQuestion('dragarea', 'tf');
    addQuestion('dragarea', 'fb');
    addQuestion('dragarea', 'mc');
    addQuestion('dragarea', 'img');
    addQuestion('dragarea', 'txt');
}

/* 
 * 
 * Basic event handler, courtesy of Prof. Powell.
 * Seems to work better than the one w/ addEventListener/attachEvent.
 * @param {Object} obj - Object receving handler
 * @param {string} event - Event name (includes 'on',  e.g., 'onclick')
 * @param {Object} handler - Function to add to existing handler(s)
 */
function addEvent(obj,event,handler) {
    var oldHandler = obj[event];
    if (typeof obj[event] != "function") {
        obj[event] = handler;
    } else {
        obj[event] = function () {
            if (oldHandler) { oldHandler.apply(); }
            handler.apply();
        }
    }
}
/************************************ ADD CHOICES/ANSWERS **************************************/
/* 
 * Adds the specified element type before the given node
 * @param {string} n - ID of the node existing in the tree
 * @param {Object} func - Name of the function defining the new element
 * @param {string} className - Used with '_ch' to define the class of the input element
 */
function addItem(n, func, className) {
    var node = document.getElementById(n);
    var rmTotal = document.getElementsByClassName('removeMe').length;
    var div = window[func](rmTotal, className);
    if (node.parentNode) {
        node.parentNode.insertBefore(div, node);
    }
    node = div = rmTotal = null;
    return false;
}

/* 
 * Defines a new DIV element for entering answer choices for multiple choice questions
 * @param {number} n - Number to ensure unique ID for remove method
 * @param {string} className - Used with '_ch' to define the class of the input element
 */
function addMChtml(n, className) {
    var divID = 'removeMe' + (n+1);
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', divID);
    newDiv.setAttribute('class', 'removeMe');
    /* Define button to remove element */
    var newInput = document.createElement('input');
    newInput.setAttribute('type', 'image');
    newInput.setAttribute('class', 'minus');
    newInput.setAttribute('src', 'img/minus.png');
    newInput.setAttribute('name', 'minus');
    newInput.setAttribute('width', '12');
    newInput.setAttribute('height', '12');
    newInput.setAttribute('alt', 'Delete Choice');
    newInput.setAttribute('title', 'remove answer');
    newInput.setAttribute('onclick', 'return remNode(\'' + divID + '\');');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createTextNode(' '));
    /* Define text input */
    newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('class', 'input choice ' + className + '_ch');
    newInput.setAttribute('placeholder', ' Possible Answer');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createTextNode(' '));
    /* Define checkbox for correct answer selection */
    newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('class', 'input');
    newInput.setAttribute('title', 'correct');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createElement('br'));
   
    newInput = divID = null;
    return newDiv;
}

/* 
 * Defines a new DIV element for entering additional answer for fill-in after questions
 * @param {number} n - Number to ensure unique ID for remove method
 * @param {string} className - Used with '_ch' to define the class of the input element
 */
function addFAhtml(n, className) {
    var divID = 'removeMe' + (n+1);
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', divID);
    newDiv.setAttribute('class', 'removeMe');
    var newInput = document.createElement('input');
    /* Define button to remove element */
    newInput.setAttribute('type', 'image');
    newInput.setAttribute('class', 'minus');
    newInput.setAttribute('src', 'img/minus.png');
    newInput.setAttribute('name', 'minus');
    newInput.setAttribute('width', '12');
    newInput.setAttribute('height', '12');
    newInput.setAttribute('alt', 'Delete Choice');
    newInput.setAttribute('title', 'remove line');
    newInput.setAttribute('onclick', 'return remNode(\'' + divID + '\');');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createTextNode(' '));
    /* Define text input */
    newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('class', 'input answer ' + className + '_ch');
    newInput.setAttribute('placeholder', ' Enter answer');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createElement('br'));
   
    newInput = divID = null;
    return newDiv;
}
/********************************FORMATTING FUNCTIONS******************************************/
/* 
 * Adds a new question of the specified type after the given node
 * @param {string} n - ID of the node already existing in the tree
 * @param {string} q - Defines the type of question/item. 
 *                     'txt' - instructions
 *                     'img'- image
 *                     'tf' - true/false question
 *                     'mc' - multiple choice question
 *                     'fa' - fill-in after question
 *                     'fb' - fill-in the blank question
 *                     'sa' - short answer question
 *                     'st' - section title
 *                     'pg' - page break
 */
function addQuestion(n, q) {
    var className = 'ea_'+q;
    var divID = className + '_' + document.getElementsByClassName(className).length;
   
    /* Set up the div */
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', divID);
    newDiv.setAttribute('class', 'ea ' + className);
    newDiv.setAttribute('draggable', 'true');
    newDiv.setAttribute('ondragstart','dragStart(event)');
    newDiv.setAttribute('ondrop','dropSwitch(event)');
    newDiv.setAttribute('ondragover' ,'enableDrop(event)');
    var newForm = document.createElement('form');
    var newFieldset = document.createElement('fieldset');
    newFieldset.setAttribute('class', 'fs_qt q_' + q);
    var newTable = document.createElement('table');
    var newTR = document.createElement('tr');
    var newTD = document.createElement('td');
    
    /* Create move to top button */
    var newImg = document.createElement('img');
    newImg.setAttribute('class', 'img_li opac_low btn');
    newImg.setAttribute('src', 'img/toTop.png');
    newImg.setAttribute('alt', '^');
    newImg.setAttribute('draggable', 'false');
    newImg.setAttribute('onclick', 'moveToTop(\'' + divID + '\')');
    newImg.setAttribute('title', 'Move to top');
    newTD.appendChild(newImg);
    /* Create image to indicate user can drag div */
    newImg = document.createElement('img');
    newImg.setAttribute('class', 'img_li opac_low');
    newImg.setAttribute('src', 'img/draggable_q.png');
    newImg.setAttribute('alt', 'draggable');
    newImg.setAttribute('draggable', 'false');
    newTD.appendChild(newImg);
    /* Create move to bottom button */
    newImg = document.createElement('img');
    newImg.setAttribute('class', 'img_li opac_low btn');
    newImg.setAttribute('src', 'img/toBtm.png');
    newImg.setAttribute('alt', 'v');
    newImg.setAttribute('draggable', 'false');
    newImg.setAttribute('onclick', 'moveToBtm(\'' + divID + '\')');
    newImg.setAttribute('title', 'Move to bottom');
    newTD.appendChild(newImg);
    newTR.appendChild(newTD);
    
    /* Create the substance of each question */
    newTD = document.createElement('td');
    newTD.setAttribute('class', 'qt_content');
    var newInput, elem, elemTotal, elemID, addDiv, newTextarea, newP;
    
    switch (q) {
        case 'txt':
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('id', divID + '_ta');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '2');
            newTextarea.setAttribute('placeholder', 'Write the instructions here');
            newTD.appendChild(newTextarea);
            newTR.appendChild(newTD);
            break;
        case 'img':
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Image File');
            newTD.appendChild(newInput);
            /* Browse button */
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'button');
            newInput.setAttribute('class', 'img_btn sb');
            newInput.setAttribute('value', 'browse');
            newTD.appendChild(newInput);
            newTR.appendChild(newTD);
            break;
        case 'tf':
            /* Question */
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', divID + '_q');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Enter question');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createElement('br'));
            /* True button and label */
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'radio');
            newInput.setAttribute('name', divID + 'tf');
            newInput.setAttribute('class', 'trueChoice');
            newInput.setAttribute('value', 'true');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createTextNode(' True'));
            newTD.appendChild(document.createElement('br'));   
            /* False button and label */
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'radio');
            newInput.setAttribute('name', divID + 'tf');
            newInput.setAttribute('class', 'falseChoice');
            newInput.setAttribute('value', 'false');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createTextNode(' False'));
            newTR.appendChild(newTD);
            break;
        case 'mc':
            /* Question */
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', divID + '_q');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Enter question');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createElement('br'));
            /* Create 4 possible answers with unique IDs */
            elem = document.getElementsByClassName('removeMe');
            elemTotal = elem.length;
            addDiv = addMChtml(elemTotal, divID)
            newTD.appendChild(addDiv);
            
            addDiv = addMChtml(elemTotal+1, divID);
            newTD.appendChild(addDiv);
            
            addDiv = addMChtml(elemTotal+2, divID);
            newTD.appendChild(addDiv);
            
            addDiv = addMChtml(elemTotal+3, divID);
            newTD.appendChild(addDiv);
            /* Create button to add more possible answers */
            elem = document.getElementsByClassName('addMe');
            elemTotal = elem.length;
            elemID = 'addMe' + elemTotal;
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'image');
            newInput.setAttribute('id', elemID);
            newInput.setAttribute('class', 'minus addMe');
            newInput.setAttribute('src', 'img/plus.png');
            newInput.setAttribute('name', 'minus');
            newInput.setAttribute('width', '12');
            newInput.setAttribute('height', '12');
            newInput.setAttribute('alt', 'Add Choice');
            newInput.setAttribute('title', 'add new possible answer');
            newInput.setAttribute('onclick', 'return addItem(\'' + elemID + '\', \'addMChtml\', \'' + divID + '\');');
            newTD.appendChild(newInput);
            newTR.appendChild(newTD);
            break;
        case 'fb':
            /* Question */
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('id', divID + '_q');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '4');
            newTextarea.setAttribute('placeholder', 'Enclose answer in brackets [ ]');
            newTD.appendChild(newTextarea);
            newTR.appendChild(newTD);
            break;
        case 'fa':
            /* Question */
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', divID + '_q');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Enter question');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createElement('br'));
            /* Create one answer */
            elem = document.getElementsByClassName('removeMe');
            elemTotal = elem.length;
            newDiv1 = addFAhtml(elemTotal, divID);
            newTD.appendChild(newDiv1);
            /* Create button to add additional answers */
            elem = document.getElementsByClassName('addMe');
            elemTotal = elem.length;
            elemID = 'addMe' + elemTotal;
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'image');
            newInput.setAttribute('id', elemID);
            newInput.setAttribute('class', 'minus');
            newInput.setAttribute('src', 'img/plus.png');
            newInput.setAttribute('name', 'minus');
            newInput.setAttribute('width', '12');
            newInput.setAttribute('height', '12');
            newInput.setAttribute('alt', 'Add Choice');
            newInput.setAttribute('title', 'add a new line');
            newInput.setAttribute('onclick', 'return addItem(\'' + elemID + '\', \'addFAhtml\', \'' + divID + '\');');  
            newTD.appendChild(newInput);
            newTR.appendChild(newTD);
            break;
        case 'sa':
            /* Question */
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('id', divID + '_q');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '4');
            newTextarea.setAttribute('placeholder', 'Write the question here');
            newTD.appendChild(newTextarea);
            /* Answer */
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '4');
            newTextarea.setAttribute('placeholder', 'Enter answer here');
            newTD.appendChild(newTextarea);
            newTR.appendChild(newTD);
            break;
       case 'st':
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('id', divID + '_ta');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '1');
            newTextarea.setAttribute('placeholder', 'Write the section title here');
            newTD.appendChild(newTextarea);
            newTR.appendChild(newTD);
            break;
        case 'pb':
            newP = document.createElement('p');
            newP.appendChild(document.createTextNode('Page Break'));
            newTD.appendChild(newP);
            newTR.appendChild(newTD);
            break;
        default:
            break;
    }
    
    /* Add delete button */
    newTD = document.createElement('td');
    var trashDiv = document.createElement('div');
    trashDiv.setAttribute('class', 'qtmenu_del');
    newImg = document.createElement('img');
    newImg.setAttribute('class', 'opac_low');
    newImg.setAttribute('src', 'img/trash.png');
    newImg.setAttribute('height', '25');
    newImg.setAttribute('width', '25');
    newImg.setAttribute('alt', 'D');
    newImg.setAttribute('draggable', 'false');
    newImg.setAttribute('onclick', 'return remNode(\'' + divID + '\');');
    newImg.setAttribute('title', 'Delete question');
    trashDiv.appendChild(newImg);
    newTD.appendChild(trashDiv);
    
    /* Add points area to questions */
    var ptsTable, ptsTR, ptsTD, ptsInput;
    switch (q) {
        case 'txt':
        case 'img':
        case 'st':
        case 'pb':
            break;
        default:
            ptsTable = document.createElement('table');
            ptsTable.setAttribute('class', 'qtmenu_pts');
            ptsTR = document.createElement('tr');
            ptsTD = document.createElement('td');
            ptsInput = document.createElement('input');
            ptsInput.setAttribute('type', 'text');
            ptsInput.setAttribute('placeholder', '0');

            ptsInput.setAttribute('class','points');
            ptsInput.setAttribute('id', 'points_'+ document.getElementsByClassName('points').length);
            ptsInput.setAttribute('onchange', 'addPts()');
            ptsInput.setAttribute('placeholder', '0');

            ptsTD.appendChild(ptsInput);
            ptsTR.appendChild(ptsTD);
            ptsTD = document.createElement('td');
            ptsTD.appendChild(document.createTextNode('pts'));
            ptsTR.appendChild(ptsTD);
            ptsTable.appendChild(ptsTR);
            newTD.appendChild(ptsTable);
            ptsTable = ptsTR = ptsTD = ptsInput = null;
            break;
    }
 
    /* Finish div */
    newTR.appendChild(newTD);
    newTable.appendChild(newTR);
    newFieldset.appendChild(newTable);
    newForm.appendChild(newFieldset);
    newDiv.appendChild(newForm);  
    
    /* Put div in document after node */
    var node = document.getElementById(n);
    appendAfter(node, newDiv); 
    
    /* Kill vars and return */
    node = newDiv = newForm = newFieldset = newTable = newTR = newTD = newImg = newInput = 
        addDiv = trashDiv = elem = elemTotal = elemID = divID = newTextarea = newP = 
        ptsTable = ptsTR = ptsTD = ptsInput =null;
    return false;
}
/************************************ PREVIEW **************************************/
/* 
 * Dynamically writes preview page.
 */
function preview() {
    var doc, elem, parent, pageDiv, questions, count, page, t, q, 
        fullClass, id, choices, i, str, pos1, pos2, buttons;
    
    window.quizPreview = window.open();
    var doc = window.quizPreview.document;
    
    // Set up basic html document
    doc.write('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Quiz Preview</title></head><body></body></html>');
    doc.close();
    
    // Add css/js files to head
    var elem = doc.createElement('link');
    elem.href = 'css/taker.css';
    elem.rel = 'stylesheet';
    elem.type = 'text/css';
    doc.head.appendChild(elem);
    elem = doc.createElement('script');
    elem.type = 'text/javascript';
    elem.src = 'js/preview.js';
    doc.head.appendChild(elem);
    
    // Begin body
    var parent = doc.body;
    parent.className = 'font_calibri';
    elem = doc.createElement('div');
    elem.id = 'wrapper';
    parent.appendChild(elem);
    parent = parent.firstChild;
    
    // Body header
    elem = doc.createElement('header');
    parent.appendChild(elem);
    parent = parent.firstChild;
    elem = doc.createElement('nav');
    elem.id = 'h_left';
    elem.className = 'hf_left fl';
    parent.appendChild(elem);
    parent = parent.firstChild;
    
    // List of buttons in header
    elem = doc.createElement('ul');
    parent.appendChild(elem);
    parent = parent.firstChild;
    
    // Maker button
    elem = doc.createElement('li');
    parent.appendChild(elem);
    elem = doc.createElement('a');
    elem.className = 'nav_btn';
    elem.href = 'maker.html';
    elem.innerHTML = 'Maker';
    parent.childNodes[0].appendChild(elem);
    
    // About button
    elem = doc.createElement('li');
    parent.appendChild(elem);
    elem = doc.createElement('a');
    elem.className = 'nav_btn';
    elem.href = 'http://classes.pint.com/cse134b/homework/hw4.html';
    elem.innerHTML = 'About';
    parent.childNodes[1].appendChild(elem);
    
    // Contact button
    elem = doc.createElement('li');
    parent.appendChild(elem);
    elem = doc.createElement('a');
    elem.className = 'nav_btn';
    elem.href = 'http://classes.pint.com/cse134b/';
    elem.innerHTML = 'Contact';
    parent.childNodes[2].appendChild(elem);
    
    // Help button
    elem = doc.createElement('li');
    parent.appendChild(elem);
    elem = doc.createElement('a');
    elem.className = 'nav_btn';
    elem.href = 'help.html';
    elem.innerHTML = 'Help';
    parent.childNodes[3].appendChild(elem);
    
    // Headings
    parent = doc.body.firstChild.firstChild; // parent = body > div > header
    elem = doc.createElement('h1');
    elem.id = 'h1_header';
    elem.innerHTML = 'QUIZ PREVIEW';
    parent.appendChild(elem);
    elem = doc.createElement('h2');
    elem.id = 'h2_header';
    elem.innerHTML = 'by Team Awesome';
    parent.appendChild(elem);
    parent = parent.parentNode; // parent = body > div
    
    // Begin main section
    elem = doc.createElement('section');
    elem.id = 's_body';
    elem.className = 's_lvl_0';
    parent.appendChild(elem);
    parent = doc.body.firstChild.childNodes[1]; // parent = body > div > section;                         
    
    elem = doc.createElement('div');
    elem.id = 'b_right';
    elem.className = 'b_div';
    parent.appendChild(elem);
    parent = parent.firstChild; // parent = body > div > section > div
    
    // Quiz title/time fieldset
    elem = doc.createElement('fieldset');
    elem.id = 'fs_taker_area';
    elem.className = 'b_field';
    parent.appendChild(elem);
    parent = parent.firstChild; // parent = .. > section > div > fieldset
        
    // Note at the top
    elem = doc.createElement('p');
    elem.style.textAlign = 'center';
    elem.style.marginBottom = '20px';
    elem.innerHTML = 'Seeing empty sections? Check the quiz maker, you\'ve probably left something out!';
    parent.appendChild(elem);
    
    elem = doc.createElement('h1');
    elem.id = 'quizTitle';
    elem.innerHTML = document.getElementById('quizTitle').value || 'Quiz'; 
    elem.className = 'b_legend';
    parent.appendChild(elem);
    
    elem = doc.createElement('h2');
    elem.className = 'b_legend';
    t = document.getElementById('time_min').value;
    if (t) { elem.innerHTML = 'Time left: ' + t + ' minutes'; }
    else  { elem.innerHTML = 'Time left: unlimited'; }
    parent.appendChild(elem);
    
    // Buttons for page/list view
    elem = doc.createElement('div');
    elem.className = 's_buttons';
    parent.appendChild(elem);
    parent = parent.lastChild;
    
    elem = doc.createElement('input');
    elem.value = 'View In Pages';
    elem.type = 'button';
    elem.className = 'b img_btn listDiv pgBtn';
    elem.setAttribute('onclick', 'viewPages()');
    //elem.onclick = viewPages;
    elem.style.display = 'none';
    parent.appendChild(elem);

    elem = doc.createElement('input');
    elem.value = 'View as List';
    elem.type = 'button';
    elem.className = 'b img_btn pageDiv pgBtn';
    elem.setAttribute('onclick', 'viewList()');
    //elem.onclick = viewList;
    elem.style.display = 'block';
    parent.appendChild(elem);
    
    elem = doc.createElement('hr');
    elem.className = 'pgBtn';
    parent.appendChild(elem);
    parent = parent.parentNode;

    count = 0;
    page = 0;
    pageDiv = doc.createElement('div');
    pageDiv.id = 'page' + page;
    pageDiv.className = 'pages';
    parent.appendChild(pageDiv);

    questions = document.getElementsByClassName('ea');

    for (t = 0; t < questions.length; t++) {
        q = questions[t];
        fullClass = q.getAttribute('class');
        id = q.getAttribute('id');
        
        switch (fullClass) { 
            case 'ea ea_txt':
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('p');
                elem.className = 'fs_qt q_txt';
                elem.style.padding = '10px;';
                elem.innerHTML = document.getElementById(id+'_ta').value;
                parent.appendChild(elem);
                break;
            case 'ea ea_st':
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                parent.style.textAlign = 'center';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('h1');
                elem.innerHTML = document.getElementById(id+'_ta').value;
                parent.appendChild(elem);
                break;
            case 'ea ea_mc':
                count++;
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('form');
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('fieldset');
                elem.className = 'fs_qt q_mc';
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('p');
                elem.className = 'question';
                elem.innerHTML = count + '. ' + document.getElementById(id+'_q').value;
                parent.appendChild(elem);
                
                choices = document.getElementsByClassName(id+'_ch');
                for (i=0; i < choices.length; i++) {
                    elem = doc.createElement('input');
                    elem.type = 'checkbox';
                    elem.name = 'question' + count;
                    elem.value = 'question' + count + 'opt' + (i+1);
                    parent.appendChild(elem);
                    parent.appendChild(doc.createTextNode(' ' + choices[i].value));
                    parent.appendChild(doc.createElement('br'));
                }  
                break;
            case 'ea ea_fb':
                count++;
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('form');
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('fieldset');
                elem.className = 'fs_qt q_fb';
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('p');
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                str = count + '. ' + document.getElementById(id+'_q').value;
                ////window.quizPreview.alert(0);
                while (str) {
                    pos1 = str.indexOf('[');
                    pos2 = str.indexOf(']');
                    if (pos1 >=0 && pos2 >= 0) {  
                        parent.appendChild(doc.createTextNode(str.substring(0, pos1)));
                        elem = doc.createElement('input');
                        elem.type = 'text';
                        elem.size = '25';
                        elem.className = 'fillIn';
                        parent.appendChild(elem);
                        str = str.substring(pos2+1);
                    }
                    else {
                        parent.appendChild(doc.createTextNode(str));
                        str = null;
                    }
                }
                ////window.quizPreview.alert(1);
                break;
            case 'ea ea_sa':
                count++;
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('form');
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('fieldset');
                elem.className = 'fs_qt q_sa';
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('p');
                elem.className = 'question';
                elem.innerHTML = count + '. ' + document.getElementById(id+'_q').value;
                parent.appendChild(elem);
                
                elem = doc.createElement('textarea');
                elem.rows = '8';
                elem.cols = '70'; 
                break;
            case 'ea ea_tf':
                count++;
                ////window.quizPreview.alert(2);
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('form');
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('fieldset');
                elem.className = 'fs_qt q_tf';
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('p');
                elem.className = 'question';
                elem.innerHTML = count + '. ' + document.getElementById(id+'_q').value;
                parent.appendChild(elem);
                
                elem = doc.createElement('input');
                elem.type = 'radio';
                elem.name = q + '_tf';
                elem.value - 'true';
                parent.appendChild(elem);
                parent.appendChild(doc.createTextNode(' True'));
                parent.appendChild(doc.createElement('br'));
                
                elem = doc.createElement('input');
                elem.type = 'radio';
                elem.name = q + '_tf';
                elem.value - 'false';
                parent.appendChild(elem);
                parent.appendChild(doc.createTextNode(' False'));
                parent.appendChild(doc.createElement('br'));
                break;
            case 'ea ea_fa':
                count++;
                parent = doc.createElement('div');
                parent.className = fullClass;
                parent.style.marginBottom = '5px';
                pageDiv.appendChild(parent);
                
                elem = doc.createElement('form');
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('fieldset');
                elem.className = 'fs_qt q_fa';
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('p');
                elem.className = 'question';
                elem.innerHTML = count + '. ' + document.getElementById(id+'_q').value + ' ';
                parent.appendChild(elem);
                parent = parent.firstChild;
                
                elem = doc.createElement('input');
                elem.type = 'text';
                elem.size = '25';
                elem.className = 'fillIn';
                parent.appendChild(elem);
                break;
            case 'ea ea_pb':
                if (t===questions.length-1) { break; }
                page++;
                elem = doc.createElement('p');
                elem.innerHTML = 'Page ' + page;
                elem.style.textAlign = 'center';
                pageDiv.appendChild(elem);
                
                elem = doc.createElement('table');
                elem.style.textAlign = 'center';
                elem.style.marginRight = 'auto';
                elem.style.marginLeft = 'auto';
                pageDiv.appendChild(elem);
                parent = pageDiv.lastChild;
                
                elem = doc.createElement('tr');
                parent.appendChild(elem);
                parent = parent.lastChild;
                // Create button to go to previous page (except on first page)
                if (page > 1) {
                    elem = doc.createElement('td');
                    parent.appendChild(elem);
                    parent = parent.lastChild;
                    
                    elem = doc.createElement('input');
                    elem.type = 'button';
                    elem.className = 'b img_btn pageDiv';
                    elem.value = 'Prev Page';
                    elem.setAttribute('onclick', 'prevPage(' + (page-1) + ')');
                    parent.appendChild(elem);
                    parent = parent.parentNode;
                }
                // Create button to go to next page
                elem = doc.createElement('td');
                parent.appendChild(elem);
                parent = parent.lastChild;
                
                elem = doc.createElement('input');
                elem.type = 'button';
                elem.className = 'b img_btn pageDiv';
                elem.value = 'Next Page';
                elem.setAttribute('onclick', 'nextPage(' + (page-1) + ')');
                parent.appendChild(elem);
                
                elem = doc.createElement('hr');
                elem.style.margin = '15px 0';
                elem.className = 'listDiv';
                elem.style.display = 'none';
                parent = pageDiv.parentNode;
                parent.appendChild(elem);
                
                pageDiv = doc.createElement('div');
                pageDiv.id = 'page' + page;
                pageDiv.className = 'pages';
                pageDiv.style.display = 'none';
                parent.appendChild(pageDiv);
                break;
            default:
                break;
        }
     
    }
    //window.quizPreview.alert(1);
    // If we have more than one page, tell us what page this is
    if (page > 0) {
        elem = doc.createElement('p');
        elem.innerHTML = 'Page ' + page;
        elem.style.textAlign = 'center';
        pageDiv.appendChild(elem);
        
        // Create button to go to previous page
        elem = doc.createElement('table');
        elem.style.textAlign = 'center';
        elem.style.marginRight = 'auto';
        elem.style.marginLeft = 'auto';
        pageDiv.appendChild(elem);
        parent = pageDiv.lastChild;
        
        elem = doc.createElement('tr');
        parent.appendChild(elem);
        parent = parent.lastChild;
        
        elem = doc.createElement('td');
        parent.appendChild(elem);
        parent = parent.lastChild;
        
        elem = doc.createElement('input');
        elem.type = 'button';
        elem.className = 'b img_btn pageDiv';
        elem.value = 'Prev Page';
        elem.setAttribute('onclick', 'prevPage(' + page + ')');
        parent.appendChild(elem);
    }
    //window.quizPreview.alert(2);
    parent = doc.body.firstChild.childNodes[1].firstChild; // parent = .. section > div
    
    // Create fieldset for options
    elem = doc.createElement('fieldset');
    elem.id = 'fs_options';
    parent.appendChild(elem);
    parent = parent.lastChild;
    
    elem = doc.createElement('legend');
    elem.className = 'b_legend pgBtn';
    parent.appendChild(elem);
    
    elem = doc.createElement('p');
    elem.style.textAlign = 'center';
    elem.style.marginRight = 'auto';
    elem.style.marginLeft = 'auto';
    elem.innerHTML = 'OPTIONS';
    parent.lastChild.appendChild(elem);
    
    elem = doc.createElement('form');
    elem.id = 'f_options';
    parent.appendChild(elem); 
    parent = parent.lastChild;

    // Buttons for page/list view
    elem = doc.createElement('div');
    elem.className = 's_buttons';
    parent.appendChild(elem);
    parent = parent.lastChild;
    
    elem = doc.createElement('input');
    elem.value = 'View In Pages';
    elem.type = 'button';
    elem.className = 'b img_btn listDiv pgBtn';
    elem.setAttribute('onclick', 'viewPages()');
    //elem.onclick = viewPages;
    elem.style.display = 'none';
    parent.appendChild(elem);

    elem = doc.createElement('input');
    elem.value = 'View as List';
    elem.type = 'button';
    elem.className = 'b img_btn pageDiv pgBtn';
    elem.setAttribute('onclick', 'viewList()');
    //elem.onclick = viewList;
    elem.style.display = 'block';
    parent.appendChild(elem);
    
    elem = doc.createElement('input');
    elem.value = 'Close Preview';
    elem.type = 'button';
    elem.id = 'b_save';
    elem.className = 'b img_btn';
    elem.setAttribute('onclick', 'closePreview()');
    parent.appendChild(elem);
    
    // Begin footer;
    parent = doc.body.lastChild;
    elem = doc.createElement('footer');
    elem.id = 's_footer';
    elem.className = 's_lvl_0';
    parent.appendChild(elem);
    parent = parent.lastChild;
    
    elem = doc.createElement('div');
    elem.id = 'f_left';
    elem.className = 'hof_left';
    parent.appendChild(elem);
    parent = parent.lastChild;
    
    elem = doc.createElement('a');
    elem.href = "#";
    elem.className = 'f_left_term';
    elem.innerHTML = 'CSE 134B &#169;';
    parent.appendChild(elem);
    
    elem = doc.createElement('a');
    elem.href = "#";
    elem.className = 'f_left_term';
    elem.innerHTML = 'Term';
    parent.appendChild(elem);
    
    elem = doc.createElement('a');
    elem.href = "#";
    elem.className = 'f_left_term';
    elem.innerHTML = 'Privacy &amp; Security';
    parent.appendChild(elem);
    parent = parent.parentNode;
    
    elem = doc.createElement('div');
    elem.id = 'f_right';
    elem.className = 'hof_right';
    parent.appendChild(elem);
    parent = parent.lastChild;
    
    elem = doc.createElement('a');
    elem.href = "#";
    elem.className = 'f_left_term';
    elem.innerHTML = 'tpowell@pint.com';
    parent.appendChild(elem);
    
    elem = doc.createElement('a');
    elem.href = "#";
    elem.className = 'f_left_term';
    elem.innerHTML = '555.555.5555';
    parent.appendChild(elem);
    parent = parent.parentNode;
    
    // Hide buttons to switch view if there's only one page
    if (page < 1) {
        buttons = doc.getElementsByClassName('pgBtn');
        for (t = 0; t < buttons.length; t++) {
            buttons[t].style.display = 'none';
        }
    }
    
    doc = elem = parent = pageDiv = questions = count = page = t = q = 
        fullClass = id = choices = i = str = pos1 = pos2 = buttons = null; 
}
/************************************ ? **************************************/
function switchNodes(x, y)
{
    var tempContainer = document.getElementById(x).parentNode;
    tempContainer.insertBefore(document.getElementById(y), document.getElementById(x));
    tempContainer = tempNode = null;
}

function saveQuiz(){
    var tempContainer = document.getElementById('fs_edit_area');
    var quizName = document.getElementById('quizTitle').value;
    var elementArray = tempContainer.childNodes;
    var temp, i;
    var questions = [];
    for (i = 0; i < elementArray.length; i++){
        
        if (elementArray[i].id !== null){

            if (elementArray[i].className === 'ea ea_img'){
                temp = imageToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_txt'){
                temp = instrToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_mc'){
                temp = multToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_fb'){
                temp = fillBlankToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_tf'){
                temp = tfToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === "ea ea_sa"){
                temp = shortToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_fa'){
                temp = fillAfterToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_pb'){
                temp = pageBreakToJSON(elementArray[i].id, i);
            }
            else if (elementArray[i].className === 'ea ea_st'){
                temp = sectionTitleToJSON()(elementArray[i].id, i);
            }
            questions.push(temp);
        }

    }
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            document.getElementById("quiz_save").innerHTML=xmlhttp.responseText;
        }
    }
    
    var jsonObject =
    {
          quizTitle: quizName,
          questionList: questions
    };
    var string1 = JSON.stringify(jsonObject);
    alert("Saved to Server");
    localStorage.setItem(quizName, string1);
    i = null;

    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}

function loadQuiz(url)
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById('quizName').innerHTML=xmlhttp.status;
    document.getElementById('quizTitle').innerHTML=xmlhttp.statusText;
    document.getElementById('questionList').innerHTML=xmlhttp.responseText;
    }
  }
  alert("XMLHttpRequest to Server");
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function tfToJSON(id, i){
    var correct = "none", incorrect = "none";
    if ($('#'+id).find('.trueChoice').is(':checked')) {
        correct = "true";
        incorrect = "false";
    }
    else if ($('#'+id).find('.falseChoice').is(':checked'))
    {
        correct = "false";
        incorrect = "true";
    }

    var temp = {
        questionNum: i,
        points:   $('#'+id).find('.points').val(),
        questionType: "tf",
        question: $('#'+id).find('.input.question').val(),
        incorrect: incorrect,
        correct: correct
    };
    return temp;
}

function multToJSON(id, i){
    var correct = "none", incorrect = "none";
    var answers = $('#'+id).find('div[id^="removeMe"]');
    var i;
    for (i = 0; i < answers.length; i++)
    {
        if ($('#'+ answers[i].id).find('.input.correct').is(":checked")){
            if (correct === "none")
                correct = "";
            correct+=($('#'+ answers[i].id).find('.input.answer').val());
            correct += " | ";
        }
        else {
            if (incorrect === "none")
                incorrect = "";
            incorrect+=($('#'+ answers[i].id).find('.input.answer').val());
            incorrect += " | ";
        }
    }

    var temp = {
        questionNum: i,
        points: $('#'+id).find('.points').val(),
        questionType: "mult",
        question: $('#'+id).find('.input.question').val(),
        incorrect: incorrect,
        correct: correct
    };
    
    i = null;
    return temp;
}

function imageToJSON(id, i){
    var temp = {
        questionNum: i,
        points: 0,
        questionType: "image",
        question: "none",
        incorrect: "none",
        correct: "none"
    };
    return temp;
}

function instrToJSON(id, i){
    var temp = {
        questionNum: i,
        points: 0,
        questionType: "instruction",
        question: $('#'+id).find('.input.question').val(),
        incorrect: "none",
        correct: "none"
    };
    return temp;
}

function shortToJSON(id, i){
    var temp = {
        questionNum: i,
        points: $('#'+id).find('.points').val(),
        questionType: "short",
        question: $('#'+id).find('.input.question').val(),
        incorrect: "none",
        correct: "none"
    };
    return temp;
}

function fillBlankToJSON(id, i){
    var temp = {
        questionNum: i,
        points: $('#'+id).find('.points').val(),
        questionType: "short",
        question: $('#'+id).find('.input.question').val(),
        incorrect: "none",
        correct: "none"
    };
    return temp;
}

function fillAfterToJSON(id, i){
    var correct = "none";
    var answers = $('#'+id).find('div[id^="removeMe"]');
    var i;
    for (i = 0; i < answers.length; i++)
    {
        if ($('#' +answers[i].id).find('.input.answer').val() !== ""){
            if (correct === "none")
                correct = "";
            correct+=($('#'+ answers[i].id).find('.input.answer').val());
            correct += " | ";
        }
    }

    var temp = {
        questionNum: i,
        points: $('#'+id).find('.points').val(),
        questionType: "fillAfter",
        question: $('#'+id).find('.input.question').val(),
        incorrect: "none",
        correct: correct
    };
    
    i = null;
    return temp;
}

function sectionTitleToJSON(id, i){
    var temp = {
        questionNum: i,
        points: 0,
        questionType: "sectionTitle",
        question: "none",
        incorrect: "none",
        correct: "none"
    };
    return temp;
}

function pageBreakToJSON(id, i){
    var temp = {
        questionNum: i,
        points: 0,
        questionType: "pageBreak",
        question: "none",
        incorrect: "none",
        correct: "none"
    };
    return temp;
}