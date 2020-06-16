const { Decode_Chars, splitSymbol } = require("./sanitizeDecodeLib");

class ErrorDecode extends Error {
  constructor(error_stat, message) {
    super();
    this.message = message;
    this.error_stat = error_stat;
  }
}

class DecodeCheckSecure {
  constructor() {
    this.inputs = {
      string: "string",
      boolean: true,
      number: 1,
    };
    this.sn_lib = Decode_Chars;
  }
  compareInputString(input, notEmpty, cb) {
    if (typeof input === typeof this.inputs.string) {
      if (notEmpty) {
        if (input === "" || input === null) {
          throw new ErrorDecode(116, "Input not allowed to be empty");
        }
      }
      cb(input);
    } else {
      throw new ErrorDecode(116, "Invalid input");
    }
  }
}

class Decoder extends DecodeCheckSecure {
  constructor() {
    super();
  }

  sanitizeLibDisplay() {
    console.log("Character With Codes:");
    Decode_Chars.forEach((char) => {
      console.log(`The Character ${char.CH} code is ${char.S_CH}`);
    });
  }

  sanitizeLibReturn() {
    return Decode_Chars;
  }

  sanitizeLibReturnChar(char) {
    let found_char = "";
    this.compareInputString(char, true, () => {
      found_char = Decode_Chars.find((c) => {
        return c.CH === char.toUpperCase();
      });
    });
    return found_char;
  }

  sanitizeLibReturnCode(char_code) {
    let found_code = "";
    this.compareInputString(char_code, true, () => {
      found_code = Decode_Chars.find((c) => {
        return c.S_CH === char_code;
      });
    });
    return found_code;
  }

  secure_SanitizeDecode(input, strict) {
    return new Promise((res, rej) => {
      let resultDecode = [];
      this.compareInputString(input, true, () => {
        const input_array = input.split(splitSymbol);
        input_array.forEach((in_letter) => {
          const f_letter = this.sn_lib.find((s_l) => {
            return s_l.S_CH === in_letter;
          });
          if (!f_letter) {
            if (strict) {
              rej("Letter Code not in the dictionary");
            }
          } else {
            resultDecode.push(f_letter.CH);
          }
        });
      });
      res(resultDecode.join(""));
    });
  }

  secure_SanitizeEncode(input, strict) {
    return new Promise((res, rej) => {
      let resultDecode = [];
      this.compareInputString(input, true, () => {
        const input_array = input.split("");
        input_array.forEach((in_letter) => {
          const f_letter = this.sn_lib.find((s_l) => {
            return s_l.CH === in_letter.toUpperCase();
          });
          if (!f_letter) {
            if (strict) {
              rej("Letter not in the dictionary");
            }
          } else {
            resultDecode.push(f_letter.S_CH);
          }
        });
      });
      res(resultDecode.join(splitSymbol));
    });
  }
}

module.exports = new Decoder();
