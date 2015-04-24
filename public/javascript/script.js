var socket = io();
var username = $("#h").val();

socket.emit('name',username)


var selecteduser ;

$("#names").on("click","li", function(){
  $(this).css("font-weight", "bold");
  selecteduser = $(this).text();
  $("#target-user").val(selecteduser);
})

$('form').submit(function(){
  socket.emit('send-msg',selecteduser , $('#m').val());
  return false;
});

socket.on('rec-msg', function(msg){
  $('#messages').append($('<li>').text(msg)).append('<hr width="40%">');
});

socket.on('userlist-name',function(name){
  $('#names').append($('<li id="' + name + '">').text(name));
})

socket.on('userleft',function(name){
  $('#'+ name).remove();
})