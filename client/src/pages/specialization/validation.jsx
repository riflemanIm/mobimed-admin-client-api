export default function validate(values) {
  let errors = {};
  if (!values.name) {
    errors.name = "Название(name)";
  }
  // if (!values.lang_code) {
  //   errors.lang_code = "Язык";
  // }
  if (!values.description) {
    errors.description = "Описание";
  }
  
  return errors;
}
