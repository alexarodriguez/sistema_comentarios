$(function()
{
    var nomServicios = [
                            {
                                servicio    :   "Trae todos los comentarios", 
                                urlServicio :   "/getAllComentario", 
                                metodo      :   "GET"
                            }, 
                            {
                                servicio    :   "Crear Comentario", 
                                urlServicio :   "/create",
                                metodo      :   "POST"
                            },
                            {
                                servicio    :   "Actualizar likes", 
                                urlServicio :   "/updateLike/:id", 
                                metodo      :   "GET"
                            }];
listadoDatos = [];
var elementos = ["nombreuser", "Comentario"];
var consumeServicios = function(tipo, val)
{
        var servicio = {
            url   : nomServicios[tipo - 1].urlServicio, 
            metodo  : nomServicios[tipo - 1].metodo, 
            datos   : ""
          };
    if(tipo==3)
    {
        servicio.url += "/" + val;
    }else{
        servicio.datos = val !== "" ? JSON.stringify(val) : "";
    }

    $.ajax(
    {
      url     : servicio.url,
      type    : servicio.metodo, 
      data    : servicio.datos, 
      dataType  : "json",
      contentType: "application/json; charset=utf-8"
    }).done(function(data)
    {          
     switch(tipo)
     {
        case 1:
          listadoDatos = [];
          for(var i = 0; i < data.length; i++)
          {
          listadoDatos.push(new datoData(data[i]));
          }
          imprimeDatos();
        break;
        case 2:
          if(data.status){
            limpiarCampos();
            alert("Guardado Correctamente");
          }else{
            alert("Error");
          }
        break;

     } 
});

};
consumeServicios(1, "");

  function datoData(datos)
  {
    this.idcomentario = datos.idcomentario;
    this.usuario = datos.usuario;
    this.comentario = datos.comentario;
    this.fecha = datos.Fecha;    
    //Para devolver los datos del usuario a ser impresos...
    this.imprime = function()
    {
      return [ 
              this.usuario,
              this.comentario,
              this.Fecha
             ];
    }
  }
  var imprimeDatos = function imprimeDatos()
  {
    var txt = "<ul id='comentarios'>";
    for(var i = listadoDatos.length-1; i >= 0; i--)
    {
      datosPersona = listadoDatos[i].imprime();

      
        txt += "<li><h2>"+(datosPersona[0])+"<h3>";
        txt += "<span>"+(datosPersona[1])+"</span><br>";
        txt += "</li>";
      txt += "</ul>";
    $("#imprime").html(txt);
  
    }
    
  }

  var limpiarCampos = function()
  {
    for(var i = 0; i < elementos.length; i++)
    {
      $("#" + elementos[i]).val("");
    }
  }

//Acciones sobre el botón guardar...
  $("#guardar").click(function(event)
  { 
    var correcto = true;
    var valores = [];
    for(var i = 0; i < elementos.length; i++)
    {
      if($("#" + elementos[i]).val() === "")
      {
        alert("Digite todos los campos");
        $("#" + elementos[i]).focus();
        correcto = false;
        break;
      }
      else
      {
        valores[i] = $("#" + elementos[i]).val();
      }
    }
// si es correcto es verdadero
     if(correcto)
    {
      var Fecha = new Date();
      var fechafinal = Fecha.getDate()+"/"+(Fecha.getMonth()+1)+"/"+Fecha.getFullYear()+" "+Fecha.getHours()+":"+Fecha.getMinutes();
      var nuevoDato = {
                usuario  :   valores[0], 
                comentario :   valores[1], 
                Fecha  :   fechafinal
              };     
      console.log(nuevoDato);           
      consumeServicios(2, nuevoDato);
    }
  });
});