export const RegexConst = {
  NUMBER: "[0-9]*",
  EMAIL:
    "^\\s*((?:\\w+(.\\w+)?@[a-zA-Z_]+?(\\.[a-zA-Z]{2,3})(\\.[a-zA-Z]{2,2})?\\b\\s*))+$",
  PHONE_NO: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$",
  COUNTRY_CODE: "^(\\+?\\d{1,3}|\\d{1,4})$",
  WEBSITE:
    "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
  ZIP: "^\\d{5}$",
  DATE: "(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d",
  BS_DATE_PICKER: "^(((0)[0-9])|((1)[0-2]))/([0-2][0-9]|(3)[0-1])/\\d{4}$"
};
