
var params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre');
let sala = params.get('sala');
// html references
const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');
// Functions to render users
function renderPersons(persons) {  // [ {}, {} ]

    let html = '';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    html +=  '</li>';
                
    
    for ( let i = 0; i < persons.length; i ++ ) {

        html += '<li>;'
        html += '   <a data-id="'+ persons[i].id +'"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ persons[i].nombre +' <small class="text-success">online</small></span></a>';
        html += '</li>';
        console.log(persons);
    };

    divUsuarios.html(html);

};

function renderMessages(msg, yo) {

    let fecha = new Date(msg.date);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();

    let adminClass = 'info';
    if (msg.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    let html = '';

    if (yo) {
        
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ msg.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">'+ msg.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';

    }else {
        
        html += '<li class="animated fadeIn">';
        if(msg.nombre !== 'Administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        };
        html += '    <div class="chat-content">';
        html += '        <h5>'+ msg.nombre +'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+ msg.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    };


    divChatbox.append(html);
};

// do bottom scroll in chat
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
};


// listeners
divUsuarios.on('click', 'a', function() {

    let id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e){

    e.preventDefault();
    if ( txtMensaje.val().trim().length < 1 ){
        return ;
    }
    socket.emit('create-message', { nombre: nombre, message: txtMensaje.val() } , function(msg) {

       console.log('Server: ', msg);
       txtMensaje.val('').focus();

       renderMessages(msg, true);
       scrollBottom();

    });
});




