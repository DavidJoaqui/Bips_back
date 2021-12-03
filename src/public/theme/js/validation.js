
function validationForm(obj){
    let flag=false;
    for (var i=1; i < arguments.length; i++) {
        for (var [key, value] of Object.entries(obj)) {
            if((value =='0' || value =='') && key != arguments[i]){
              flag =true;
              break;
            }
        }
        if(flag){
            break;
        }
      }
    return flag;
}


function alertValidation(){
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Faltan campos por completar',
      showConfirmButton: false,
      timer: 1500
    })
}