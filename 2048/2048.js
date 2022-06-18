// Had to add this file because if used pyscript event.touchs[0].clientX or Y it raises an error for some weird reason

function get_client_x(event){
    return event.touches[0].clientX;
};

function get_client_y(event) {
    return event.touches[0].clientY;
};

var passive_false = {passive: false}