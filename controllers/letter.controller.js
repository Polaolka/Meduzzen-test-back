// const mapper = require('../dto/mapper');
// const { createLetterDTO } = require('../dto/requestDTO/letter.dto');
// const { createLetterRespDTO } = require('../dto/responseDTO/letter.dto');
// const  sendEmailSendGrid  = require('../helpers/sendEmailSendGrid');

// class Letter {
//   constructor() {}

//   // ---- CREATE LETTER ----
//   static async createLetter(req, res, next) {
//     const RequestDTO = await mapper.toRequestDTO({
//       data: req,
//       validationSchema: createLetterDTO,
//     });
//     const verifyEm = {
//       ...RequestDTO,
//       // to: 'olgapolichuk@ukr.net',
//       // from: 'samtaktreba@gmail.com',
//       // subject: 'Verify Email',
//       // text: 'TEXT Verify Email',
//       // html: `<h2 >It is letter</h2>`,
//     };
//     await sendEmailSendGrid(verifyEm);

//     const result = await sendEmailSendGrid(verifyEm);
//     console.log("result", result);
//     const ResponseDTO = await mapper.toResponseDTO({
//       result,
//       validationSchema: createLetterRespDTO,
//     });
//     console.log("ResponseDTO", ResponseDTO);
//     res.status(result.status).json(ResponseDTO);
//   }
// }
// module.exports = Letter;
