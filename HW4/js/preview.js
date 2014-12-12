/*
 * Closes the preview window
 */
function closePreview() {
  window.close();
}

/*
 * Changes question view to long listing format
 */
function viewList() {
    var elem = document.getElementsByClassName('listDiv');
    var i;
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'block';
    }
    
    elem = document.getElementsByClassName('pageDiv');
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'none';
    }
    
    elem = document.getElementsByClassName('pages');
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'block';
    }
    elem = i = null;
}

/*
 * Changes question view to paginated  format
 */
function viewPages() {
    var elem = document.getElementsByClassName('pageDiv');
    var i;
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'block';
    }
    
    elem = document.getElementsByClassName('listDiv');
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'none';
    }
    
    elem = document.getElementsByClassName('pages');
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'none';
    }
    elem[0].style.display = 'block';
    elem = i = null;
}
/*
 * Hides the current page view, as indicated by page number n.
 * Shows the next page.
 * @param {number} n - number of the page to hide (pg #s start at 0), 
 *                     n+1 is shown
 */
function nextPage(n) {
    var elem = document.getElementsByClassName('pages');
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'none';
    }
    elem[n+1].style.display = 'block';
    elem = null;
}

/*
 * Hides the current page view, as indicated by page number n.
 * Shows the previous page.
 * @param {number} n - number of the page to hide (pg #s start at 0),
 *                     n-1 is shown
 */
function prevPage(n) {
    var elem = document.getElementsByClassName('pages');
    for (i = 0; i < elem.length; i++) {
        elem[i].style.display = 'none';
    }
    elem[n-1].style.display = 'block';
    elem = null;
}