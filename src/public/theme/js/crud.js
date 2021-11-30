


   function openPopupDelete(url,callback) {
    Swal.fire({
       title: 'Estas seguro?',
       text: "¡No podrás revertir esto!",
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: '¡Sí, bórralo!',
       cancelButtonText: 'Cancelar'
    }).then((result) => {
       if (result.isConfirmed) {
          deleteAjax(url,callback)
       }
    })
 }

 function deleteAjax(url,callback) {
    $.ajax({
       url: url,
       method: 'DELETE',
       success: function (result) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Dato eliminado',
            showConfirmButton: false,
            timer: 1500
          })
          setTimeout(function(){
            if(callback){
               callback('') 
            }else{
               location.reload()
            }
         }, 1500);
       },
       error: function (request, msg, error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Dato no eliminado',
            showConfirmButton: false,
            timer: 1500
          })
       }
    })
 }

 function createdAjax(url,data,callback) {
   $.ajax({
      url: url,
      method: 'POST',
      data,
      contentType: false,
      processData: false,
      success: function (result) {
         Swal.fire({
           position: 'top-end',
           icon: 'success',
           title: 'Dato creado',
           showConfirmButton: false,
           timer: 1500
         })
         setTimeout(function(){
            if(callback){
               callback('created') 
            }else{
               location.reload()
            }
         }, 1500);
      },
      error: function (request, msg, error) {
       Swal.fire({
           position: 'top-end',
           icon: 'error',
           title: 'Dato no creado',
           showConfirmButton: false,
           timer: 1500
         })
      }
   })
}


function updateAjax(url,data,callback) {
   $.ajax({
      url: url,
      method: 'PUT',
      data,
      contentType: false,
      processData: false,
      success: function (result) {
         Swal.fire({
           position: 'top-end',
           icon: 'success',
           title: 'Dato actualizado',
           showConfirmButton: false,
           timer: 1500
         })
         setTimeout(function(){
            if(callback){
               callback('update') 
            }else{
               location.reload()
            }
         }, 1500);
      },
      error: function (request, msg, error) {
       Swal.fire({
           position: 'top-end',
           icon: 'error',
           title: 'Dato no actualizado',
           showConfirmButton: false,
           timer: 1500
         })
      }
   })
}



 function loadContentHtml(url,content) {
    $.ajax({
       url: url,
       method: 'GET',
       success: function (result) {
          $(content).html(result)
       },
       error: function (request, msg, error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No se pudo cargar los datos',
            showConfirmButton: false,
            timer: 1500
          })
       }
    })
 }



