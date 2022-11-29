import { sequelize } from "../../config/database.js"
import { QueryTypes } from "sequelize";


export async function events() {
 const prior_events =  await sequelize.query("call get_events_prior_to_current_date()", QueryTypes.SELECT)
    console.log("esas")
 const current_events = await sequelize.query("call get_events_after_current_date()", QueryTypes.SELECT)
    return {"current":current_events, "prior":prior_events}
}


// TODO: putTeam function


/*
 *@param category - String
 *@param institution - String
 *@param participants - JSON Array

 *participant JSON strucure:
 *
 * participant:{
 *  CURP: 'curp',
 *  nombre_pila: 'nombre_pila',
 *  apellido_1: 'apellido_1',
 *  apellido_2: 'apellido_2',
 *  fecha_nac: 'YYYY-MM-DD'
 * }
 * */
export async function putTeam(category, institution, participants){

	// Insertar equipo
	await sequelize.query('call set_team(?, ?);', {
		replacements: [category, institution]
	})

	// Traer el codigo del equipo y la categoria
	const teamRes = await sequelize.query('call get_last_team();')



	// Validar la edad del participante en base a la categoria
	
	for(let i = 0; i < 3; i++){

		let participant = participants[i]
		let age = calculateAge(participant.fecha_nac)

		
		if(!validateAge(age, teamRes[0].categoria)){
			console.log('Participante inválido')
		}else{
		// Insertar participante
		putParticipant(participant, teamRes[0].cod_equipo)
		}
		
	}
	
}

function calculateAge(birthdayString) { 
		const birthday = new Date(birthdayString);
    let ageDifMs = Date.now() - birthday.getTime()
    let ageDate = new Date(ageDifMs)
		return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function validateAge(age, teamCategory){
		const categoryAgeRanges = {
		primaria: {
			inferiorLimit: 6,
			superiorLimit: 11
		},
		secundaria:{
			inferiorLimit: 12,
			superiorLimit: 14
		},
		bachillerato:{
			inferiorLimit: 15,
			superiorLimit: 17
		},
		profesional:{
			inferiorLimit: 18,
			superiorLimit: Number.MAX_SAFE_INTEGER
		}
	}
	return age >= categoryAgeRanges[teamCategory].inferiorLimit && age <= categoryAgeRanges[teamCategory].superiorLimit
}

async function putParticipant(participant, teamCode){

	console.log(participant.fecha_nac)
	await sequelize.query('call set_participant(?, ?, ?, ?, ?, ?);', {
		replacements: [participant.CURP, teamCode, participant.nombre_pila, participant.apellido_1, participant.apellido_2, participant.fecha_nac]
	})

}

//sequelize.close()


