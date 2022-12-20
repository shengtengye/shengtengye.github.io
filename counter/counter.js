let p1 = document.getElementById('p1');
let p2 = document.getElementById('p2');
let p3 = document.getElementById('p3');
let reset_button = document.getElementById('reset');

function reset() {
    p1_count = p2_count = p3_count = 0;
    p1.innerHTML = 0;
    p2.innerHTML = 0;
    p3.innerHTML = 0;
}

function count_add_one(counter, id) {
    document.getElementById(id).innerHTML = counter;
}

p1.addEventListener('click', function () {count_add_one(++p1_count, 'p1')});
p2.addEventListener('click', function () {count_add_one(++p2_count, 'p2')});
p3.addEventListener('click', function () {count_add_one(++p3_count, 'p3')});
reset_button.addEventListener('click', reset);

reset();
