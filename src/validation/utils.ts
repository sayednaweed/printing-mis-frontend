import { ValidationRule } from "./types";

export function isFile(input: any): input is File {
  return input instanceof File;
}
export const generatePassword = () => {
  let generatedPassword = "";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()-_=+";

  // Ensuring the password has at least one of each required character
  generatedPassword +=
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
  generatedPassword +=
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];

  // Filling the remaining length with random characters
  const allCharacters =
    lowerCaseLetters + upperCaseLetters + numbers + specialChars;
  while (generatedPassword.length < 8) {
    generatedPassword +=
      allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to avoid predictable patterns
  generatedPassword = generatedPassword
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return generatedPassword;
};

export const checkStrength = (pass: string, t: any) => {
  const requirements = [
    { regex: /.{8,}/, text: t("at_lea_8_char") },
    { regex: /[0-9]/, text: t("at_lea_1_num") },
    { regex: /[a-z]/, text: t("at_lea_1_lowcas_lett") },
    { regex: /[A-Z]/, text: t("at_lea_1_upcas_lett") },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(pass),
    text: req.text,
  }));
};
export const passwordStrengthScore = (
  strength: {
    met: boolean;
    text: any;
  }[]
): number => strength.filter((req) => req.met).length;
export function isValidationFunction(
  rule: ValidationRule
): rule is (value: any) => boolean {
  return typeof rule === "function";
}
