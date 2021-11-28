
function validationForm(obj){
    let flag=false;
    for (var i=1; i < arguments.length; i++) {
        for (var [key, value] of Object.entries(obj)) {
            if((value =='0' || value =='') && key != arguments[i]){
              console.log(key)
              console.log(value)
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