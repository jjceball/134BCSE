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

function addPts(){
   var numPts = document.getElementsByClassName("points").length;
   var total = 0;
   
   for(var i = 0; i < numPts; i++)
   {
        total += parseInt(document.getElementById("points_"+i).value) || 0;
   }
   //var output = document.getElementById("totalPoints");
   //node.innerHTML = total;
   document.getElementById("quiz_points_counter").innerHTML = "("+total+" pts)";
   numPts = total = i = null;
}

function dropSwitch(ev)
{
    var node = document.getElementById(ev.dataTransfer.getData('Object'));
    var targetItem = ev.target;
    
    if (node.id.substring(0,2) === 'qt' && (targetItem.id === 'dragarea' || targetItem.parentNode.id === 'dragarea')) {
        var id = node.id.substring(3);
        addQuestion('dragarea', id);
    }
    else {
        //while (targetItem && (!(targetItem.hasAttribute('draggable')) || targetItem.getAttribute('draggable') === 'false'))
        while (targetItem && targetItem.parentNode !== node.parentNode)
            targetItem = targetItem.parentNode;
        appendAfter(targetItem, node);
        //switchNodes(data2, ev.dataTransfer.getData('Object'));
    }
    targetItem = node = id = null;
}
/************************************ HELPER FUNCTIONS **************************************/
function appendAfter(node, newNode) {
    if (node.parentNode) {
        if (node.nextSibling)
            node.parentNode.insertBefore(newNode, node.nextSibling);
        else
            node.parentNode.appendChild(newNode);
    }
}

function remNode(n) {
    var node = document.getElementById(n);
    node.parentNode.removeChild(node);
    node = null;
    return false;
}

function moveToTop(n) {
    var node = document.getElementById(n);
    appendAfter(document.getElementById('dragarea'), node);
    node = null;
}

function moveToBtm(n) {
    var node = document.getElementById(n);
    var questions = document.getElementsByClassName('ea');
    var target = questions[questions.length-1];
    appendAfter(target, node);
    node = questions = target = null;
}

function startQuestions() {
    addQuestion('dragarea', 'fa'); 
    addQuestion('dragarea', 'sa');
    addQuestion('dragarea', 'tf');
    addQuestion('dragarea', 'fb');
    addQuestion('dragarea', 'mc');
    addQuestion('dragarea', 'img');
    addQuestion('dragarea', 'txt');
}
/************************************ ADD CHOICES/ANSWERS **************************************/
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

function addMChtml(n, className) {
    var divID = 'removeMe' + (n+1);
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', divID);
    newDiv.setAttribute('class', 'removeMe');
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
    
    newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('class', 'input choice ' + className + '_ch');
    newInput.setAttribute('placeholder', ' Possible Answer');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createTextNode(' '));
      
    newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('class', 'input');
    newInput.setAttribute('title', 'correct');
    newDiv.appendChild(newInput);
    newDiv.appendChild(document.createElement('br'));
   
    newInput = divID = null;
    return newDiv;
}

function addFAhtml(n, className) {
    var divID = 'removeMe' + (n+1);
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', divID);
    newDiv.setAttribute('class', 'removeMe');
    var newInput = document.createElement('input');
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
    
    /* Create image to indicate user can drag div */
    var newImg = document.createElement('img');
    newImg.setAttribute('class', 'img_li opac_low btn');
    newImg.setAttribute('src', 'img/toTop.png');
    newImg.setAttribute('alt', '^');
    newImg.setAttribute('draggable', 'false');
    newImg.setAttribute('onclick', 'moveToTop(\'' + divID + '\')');
    newImg.setAttribute('title', 'Move to top');
    newTD.appendChild(newImg);
    var newImg = document.createElement('img');
    newImg.setAttribute('class', 'img_li opac_low');
    newImg.setAttribute('src', 'img/draggable_q.png');
    newImg.setAttribute('alt', 'draggable');
    newImg.setAttribute('draggable', 'false');
    newTD.appendChild(newImg);
    var newImg = document.createElement('img');
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
            
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'button');
            newInput.setAttribute('class', 'img_btn sb');
            newInput.setAttribute('value', 'browse');
            newTD.appendChild(newInput);
            newTR.appendChild(newTD);
            break;
        case 'tf':
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', divID + '_q');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Enter question');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createElement('br'));

            newInput = document.createElement('input');
            newInput.setAttribute('type', 'radio');
            newInput.setAttribute('name', divID + 'tf');
            newInput.setAttribute('class', 'trueChoice');
            newInput.setAttribute('value', 'true');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createTextNode(' True'));
            newTD.appendChild(document.createElement('br'));   

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
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', divID + '_q');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Enter question');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createElement('br'));
            
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
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('id', divID + '_q');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '4');
            newTextarea.setAttribute('placeholder', 'Enclose answer in brackets [ ]');
            newTD.appendChild(newTextarea);
            newTR.appendChild(newTD);
            break;
        case 'fa':
            newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', divID + '_q');
            newInput.setAttribute('class', 'input question');
            newInput.setAttribute('placeholder', ' Enter question');
            newTD.appendChild(newInput);
            newTD.appendChild(document.createElement('br'));
            
            elem = document.getElementsByClassName('removeMe');
            elemTotal = elem.length;
            newDiv1 = addFAhtml(elemTotal, divID);
            newTD.appendChild(newDiv1);
            
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
            newTextarea = document.createElement('textarea');
            newTextarea.setAttribute('id', divID + '_q');
            newTextarea.setAttribute('class', 'input question');
            newTextarea.setAttribute('rows', '4');
            newTextarea.setAttribute('placeholder', 'Write the question here');
            newTD.appendChild(newTextarea);
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
    switch (q) {
        case 'txt':
        case 'img':
        case 'st':
        case 'pb':
            break;
        default:
            var ptsTable = document.createElement('table');
            ptsTable.setAttribute('class', 'qtmenu_pts');
            var ptsTR = document.createElement('tr');
            var ptsTD = document.createElement('td');
            var ptsInput = document.createElement('input');
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
        addDiv = trashDiv = elem = elemTotal = elemID = divID = newTextarea = newP = null;
    return false;
}
/************************************ PREVIEW **************************************/
function preview() {
    var prev = window.open('preview.html');
    prev.onload = function() { 
        prev.document.getElementById('quizTitle').innerHTML = document.getElementById('quizTitle').value || 'Quiz';
        var t = document.getElementById('time_min').value;
        if (t) { prev.document.getElementById('min').innerHTML = t + ' minutes'; }
        else { prev.document.getElementById('min').innerHTML = 'unlimited' } ;

        var node = prev.document.getElementById('target');
        var questions = document.getElementsByClassName('ea');
        var count = 0;
        var page = 0;
        
        for (t=0; t < questions.length; t++) {
            var q = questions[t];
            var id = q.getAttribute('id');
            
            var newDiv, newForm, newFieldset, newInput, newP, newTA, newH1;
            switch (q.getAttribute('class')) { 
                case 'ea ea_txt':
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newP = prev.document.createElement('p');
                    newP.setAttribute('class', 'fs_qt q_txt');
                    newP.setAttribute('style', 'padding: 10px;');
                    newP.innerHTML = document.getElementById(id+'_ta').value;
                    newDiv.appendChild(newP);
                    node.parentNode.insertBefore(newDiv, node);  
                    break;
                case 'ea ea_st':
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newDiv.setAttribute('style', 'text-align: center');
                    newH1 = prev.document.createElement('h1');
                    newH1.innerHTML = document.getElementById(id+'_ta').value;
                    newDiv.appendChild(newH1);
                    node.parentNode.insertBefore(newDiv, node);
                    break;
                case 'ea ea_mc':
                    count++;
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newForm = prev.document.createElement('form');
                    newFieldset = prev.document.createElement('fieldset');
                    newFieldset.setAttribute('class', 'fs_qt q_mc');
                    newP = prev.document.createElement('p');
                    newP.setAttribute('class', 'question');
                    newP.innerHTML = count + '. ' + document.getElementById(id+'_q').value;
                    newFieldset.appendChild(newP);
                    var choices = document.getElementsByClassName(id+'_ch');
                    var i;
                    for (i=0; i < choices.length; i++) {
                        newInput = prev.document.createElement('input');
                        newInput.setAttribute('type', 'radio');
                        newInput.setAttribute('name', 'question' + count);
                        newInput.setAttribute('value', 'question' + count + 'opt' + (i+1));
                        newFieldset.appendChild(newInput);
                        newFieldset.appendChild(prev.document.createTextNode(' ' + choices[i].value));
                        newFieldset.appendChild(prev.document.createElement('br'));
                    }
                    newForm.appendChild(newFieldset);
                    newDiv.appendChild(newForm);
                    node.parentNode.insertBefore(newDiv, node);  
                    break;
                case 'ea ea_fb':
                    count++;
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newForm = prev.document.createElement('form');
                    newFieldset = prev.document.createElement('fieldset');
                    newFieldset.setAttribute('class', 'fs_qt q_fb');
                    newP = prev.document.createElement('p');
                    var str = count + '. ' + document.getElementById(id+'_q').value;
                    while (str) {
                        var pos1 = str.indexOf('[');
                        var pos2 = str.indexOf(']');
                        if (pos1 >=0 && pos2 >= 0) {  
                            newP.appendChild(prev.document.createTextNode(str.substring(0, pos1)));
                            newInput = prev.document.createElement('input');
                            newInput.setAttribute('type', 'text');
                            newInput.setAttribute('size', '25');
                            newInput.setAttribute('class', 'fillIn');
                            newP.appendChild(newInput);
                            str = str.substring(pos2+1);
                        }
                        else {
                            newP.appendChild(prev.document.createTextNode(str));
                            str = null;
                        }
                    }
                    str = null;
                    newFieldset.appendChild(newP);
                    newForm.appendChild(newFieldset);
                    newDiv.appendChild(newForm);
                    node.parentNode.insertBefore(newDiv, node);  
                    break;
                case 'ea ea_sa':
                    count++;
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newForm = prev.document.createElement('form');
                    newFieldset = prev.document.createElement('fieldset');
                    newFieldset.setAttribute('class', 'fs_qt q_sa');
                    newP = prev.document.createElement('p');
                    newP.setAttribute('class', 'question');
                    newP.innerHTML = count + '. ' + document.getElementById(id+'_q').value;
                    newFieldset.appendChild(newP);
                    newTA = prev.document.createElement('textarea');
                    newTA.setAttribute('rows', '8');
                    newTA.setAttribute('cols', '70');
                    newFieldset.appendChild(newTA);
                    newForm.appendChild(newFieldset);
                    newDiv.appendChild(newForm);
                    node.parentNode.insertBefore(newDiv, node);  
                    break;
                case 'ea ea_tf':
                    count++;
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newForm = prev.document.createElement('form');
                    newFieldset = prev.document.createElement('fieldset');
                    newFieldset.setAttribute('class', 'fs_qt q_tf');
                    newP = prev.document.createElement('p');
                    newP.setAttribute('class', 'question');
                    newP.innerHTML = count + '. ' + document.getElementById(id+'_q').value;
                    newFieldset.appendChild(newP);
                    newInput = prev.document.createElement('input');
                    newInput.setAttribute('type', 'radio');
                    newInput.setAttribute('name', q + '_tf');
                    newInput.setAttribute('value', 'true');
                    newFieldset.appendChild(newInput);
                    newFieldset.appendChild(prev.document.createTextNode(' True'));
                    newFieldset.appendChild(prev.document.createElement('br'));
                    newInput = prev.document.createElement('input');
                    newInput.setAttribute('type', 'radio');
                    newInput.setAttribute('name', q + '_tf');
                    newInput.setAttribute('value', 'false');
                    newFieldset.appendChild(newInput);
                    newFieldset.appendChild(prev.document.createTextNode(' False'));
                    newFieldset.appendChild(prev.document.createElement('br'));
                    newForm.appendChild(newFieldset);
                    newDiv.appendChild(newForm);
                    node.parentNode.insertBefore(newDiv, node);  
                    break;
                case 'ea ea_fa':
                    count++;
                    newDiv = prev.document.createElement('div');
                    newDiv.setAttribute('class', q);
                    //newDiv.setAttribute('draggable', 'false');
                    newDiv.setAttribute('style', 'margin-bottom: 5px');
                    newForm = prev.document.createElement('form');
                    newFieldset = prev.document.createElement('fieldset');
                    newFieldset.setAttribute('class', 'fs_qt q_fa');
                    newP = prev.document.createElement('p');
                    newP.setAttribute('class', 'question');
                    newP.innerHTML = count + '. ' + document.getElementById(id+'_q').value + ' ';
                    newInput = prev.document.createElement('input');
                    newInput.setAttribute('type', 'text');
                    newInput.setAttribute('size', '25');
                    newInput.setAttribute('class', 'fillIn');
                    newP.appendChild(newInput);
                    newFieldset.appendChild(newP);
                    newForm.appendChild(newFieldset);
                    newDiv.appendChild(newForm);
                    node.parentNode.insertBefore(newDiv, node);
                    break;
                case 'ea ea_pb':
                    if (t===questions.length-1) { break; }
                    page++;
                    newP = prev.document.createElement('p');
                    newP.innerHTML = 'Page ' + page;
                    newP.style.textAlign = 'center';
                    node.parentNode.insertBefore(newP, node);
                    var newHR = prev.document.createElement('hr');
                    newHR.style.margin = '15px 0';
                    node.parentNode.insertBefore(newHR, node);
                    newHR = null;
                    break;
                default:
                    break;
            }
         
        }
       if (page > 0) {
             newP = prev.document.createElement('p');
            newP.innerHTML = 'Page ' + ++page;
            newP.style.textAlign = 'center';
            node.parentNode.insertBefore(newP, node);
        }
        q = newDiv = newForm = newFieldset = newInput = newP = newTA = newH1 = node = questions = count = null;
    }
}
/************************************ ? **************************************/
function switchNodes(x, y)
{
    var tempContainer = document.getElementById(x).parentNode;
    tempContainer.insertBefore(document.getElementById(y), document.getElementById(x));
    /*
    var tempNode = document.getElementById(x).nextSibling;
    if(tempNode !== null)
    {
        tempContainer.insertBefore(document.getElementById(x), document.getElementById(y));
        tempContainer.insertBefore(document.getElementById(y), tempNode);
    }
    else
    {
        tempNode = document.getElementById(y).nextSibling;
        tempContainer.insertBefore(document.getElementById(y), document.getElementById(x));
        tempContainer.insertBefore(document.getElementById(x), tempNode);
    }     */
   tempContainer = tempNode = null;
}

function saveQuiz(){
    var tempContainer = document.getElementById('fs_edit_area');
    var quizName = document.getElementById('quizTitle').value;

    var elementArray = tempContainer.childNodes;


    var temp;
    var questions = [];
    for(var i = 0; i < elementArray.length; i++){


        if(elementArray[i].id !== null){

            if(elementArray[i].className === 'ea ea_img'){
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
    var jsonObject =
    {
          quizTitle: quizName,
          questionList: questions
    };
    var string1 = JSON.stringify(jsonObject);
    alert(string1);
    localStorage.setItem(quizName, string1);
}

function tfToJSON(id, i){
    var correct = "none", incorrect = "none";
    if($('#'+id).find('.trueChoice').is(':checked')) {
        correct = "true";
        incorrect = "false";
    }
    else if($('#'+id).find('.falseChoice').is(':checked'))
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
    for(var j = 0; i < answers.length; i++)
    {
        if($('#'+ answers[i].id).find('.input.correct').is(":checked")){
            if(correct === "none")
                correct = "";
            correct+=($('#'+ answers[i].id).find('.input.answer').val());
            correct += " | ";
        }
        else {
            if(incorrect === "none")
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
    for(var i = 0; i < answers.length; i++)
    {
        if($('#' +answers[i].id).find('.input.answer').val() !== ""){
            if(correct === "none")
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