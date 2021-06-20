import { IMeteor } from "../globals/interfaces";

export interface INasaDatastsResponse {
	data?: IMeteor[]; 
	error?: string;
}

export const fetchDatasets = async () => {
	let results: INasaDatastsResponse = {};

	try {
		const resp = await fetch('https://data.nasa.gov/resource/y77d-th95.json');
		results.data = await resp.json();
	} catch (err) {
		results.error = err.message;
	}

	return results;
};