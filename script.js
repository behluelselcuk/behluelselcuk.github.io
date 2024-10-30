'use strict';

function appendOperation(operation) {
    document.querySelector('#resultArea p').innerHTML += operation;
}

function calculateResult() {
    let container = document.querySelector('#resultArea p');
    let result = eval(container.innerHTML);
    container.innerHTML = result;
}

function deleteLast() {
    let container = document.querySelector('#resultArea p');
    if (container.innerHTML.endsWith(' ')) {
        container.innerHTML = container.innerHTML.slice(0, -3);
    } else {
        container.innerHTML = container.innerHTML.slice(0, -1);
    }
}