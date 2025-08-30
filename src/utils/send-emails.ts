// import nodemailer from "nodemailer";
// import "dotenv/config";
// import type { IClientSendToAPI } from "../dtos/clients.dto";
// import { formatDateHour } from "./formatter";


// const transporter = nodemailer.createTransport({
// 	host: "smtp.gmail.com",
// 	port: 465,
// 	secure: true,
// 	auth: {
// 		user: process.env.SMTP_USER,
// 		pass: process.env.SMTP_PASS,
// 	},
// 	tls: {
// 		rejectUnauthorized: false,
// 	},
// });

// const destinatarios = ["automacao.wemoove.localiza@outlook.com"];

// export async function sendEmailResult(resultado: IClientSendToAPI) {
// 	const dataHora = new Date();

// 	const html = `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
//   <div style="text-align: center; margin-bottom: 25px;">
//     <h2 style="color: #3366cc; margin: 0; padding: 0;">📋 Relatório de Resultado</h2>
//     <div style="height: 3px; background-color: #3366cc; margin-top: 10px;"></div>
//   </div>
  
//   <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Nome:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">👤 ${resultado.name}</div>
//     </div>
    
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">CPF:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">💼 ${resultado.cpf}</div>
//     </div>
    
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Telefone:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">📞 ${resultado.phone}</div>
//     </div>
    
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Email:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">✉️ ${resultado.email}</div>
//     </div>
    
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Localiza Aprovado:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">ℹ️ ${resultado.approved_localiza || "-"}</div>
//     </div>
    
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Valor Aprovado:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">💲 ${resultado.value_approved_localiza || "-"}</div>
//     </div>
    
//     <div style="margin-bottom: 15px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Status:</div>
//       <div style="padding: 8px; border-radius: 4px; font-weight: bold; background-color:⚠️ - ${resultado.status === "error" ? "#fff2f2" : "#f2fff2"}; color: ${resultado.status === "error" ? "#cc0000" : "#007700"};">
//         ${resultado.status.toUpperCase()}
//       </div>
//     </div>
    
//     <div style="margin-bottom: 5px;">
//       <div style="font-weight: bold; color: #555555; margin-bottom: 5px;">Mensagem:</div>
//       <div style="padding: 8px; background-color: #f5f5f5; border-radius: 4px;">📄 ${resultado.message}</div>
//     </div>
//   </div>
  
//   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777777;">
//     ❌ Este é um email automático. Por favor, não responda.
//   </div>
// </div>
//   `;

// 	const mailOptions = {
// 		from: "Sistema de Automação WeMoove",
// 		to: destinatarios.join(","),
// 		subject: `📊 Resultado da Automação de ${resultado.name} - ${formatDateHour(dataHora)} `,
// 		html,
// 	};

// 	try {
// 		await transporter.sendMail(mailOptions);
// 		console.log(`✅ Email enviado com sucesso - ${formatDateHour(dataHora)}`);
// 	} catch (err) {
// 		console.error("Erro ao enviar e-mail:", err);
// 	}
// }
