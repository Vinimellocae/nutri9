/* Máscara de CPF */
document.getElementById("cpf").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9)
    v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  else if (v.length > 6)
    v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  this.value = v;
});

/* Máscara de Altura (0.00 a 2.99) */
document.getElementById("altura").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 3);
  if (v.length >= 2) v = v.replace(/(\d{1})(\d{0,2})/, "$1.$2");
  this.value = v;
});