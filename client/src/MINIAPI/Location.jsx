// key = e07655c569msh83e827f3b58505dp18a915jsnd51334609ffd
const url = 'https://electric-vehicle-charging-station-and-point.p.rapidapi.com/ca/elec.json?orderBy=%22city%22&equalTo=%22Airdrie%22&print=%22pretty%22&limitToFirst=5';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e07655c569msh83e827f3b58505dp18a915jsnd51334609ffd',
		'x-rapidapi-host': 'electric-vehicle-charging-station-and-point.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}