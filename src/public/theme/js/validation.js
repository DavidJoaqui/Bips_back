function validationForm(obj, id) {
  let flag = false;
  for (var [key, value] of Object.entries(obj)) {
    if ((value === "0" || value === "") && key != id) {
      flag = true;
      break;
    }
  }

  return flag;
}

function alertValidation() {
  Swal.fire({
    position: "top-end",
    icon: "warning",
    title: "Faltan campos por completar",
    showConfirmButton: false,
    timer: 1500,
  });
}
