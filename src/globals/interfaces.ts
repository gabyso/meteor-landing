import { Color } from "@material-ui/lab/Alert";

export interface IMeteor {
	name: string;
   id: string;
	year: number;
	mass: string;
};

export interface IMeteorsByYears {
	[year: number]: IMeteor[];
};

export interface IAlertMessage { 
	message: string; 
	type?: Color;
};