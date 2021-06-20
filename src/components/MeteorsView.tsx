import { makeStyles, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { JUMPED_YEAR_MESSAGE, MAX_YEAR, MIN_YEAR } from "../globals/consts";
import { IAlertMessage, IMeteor, IMeteorsByYears } from "../globals/interfaces";
import MeteorCard from './MeteorCard';
import { renderEmptyState } from '../globals/helpers';

const FILTERS_HEIGHT = 100;

interface IMeterosViewProps {
	meteors: IMeteorsByYears;
	setAlert: (alertMessage: IAlertMessage) => void; 
}

const useStyles = makeStyles(() => ({
	root: {
		height: `100%`,
		width: '80vw',
		margin: 'auto',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	filtersWrapper: {
		height: FILTERS_HEIGHT,
		display: 'flex',
		width: '20%',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	imput: {
		width: 100
	},
	cardsList: {
		display: 'flex',
		flexWrap: 'wrap',
		listStyleType: 'none',
		padding: 0,
		marginTop: 2,
		justifyContent: 'center',
		height: `calc(100% - ${FILTERS_HEIGHT}px)`,
		overflowX: 'auto'
	 }
}));

const MeteorsView = ({ meteors, setAlert }: IMeterosViewProps): JSX.Element => {
	const classes = useStyles();
	const [year, setYear] = useState('');
	const [minMass, setMinMass] = useState('');
	const [filteredMeteors, setFilteredMeteors] = useState<IMeteor[]>(year ? meteors[Number(year)] : []);

	const handleChangeYear = (newYear: string) => {
		setYear(newYear);
		setMinMass('');
		
		if (newYear) {
			setFilteredMeteors(meteors[Number(newYear)]);
		}
	};

	const getFilteredByYear = (valueOfYear: number) => {
		return meteors[valueOfYear]?.filter(({ mass }) => Number(mass) > Number(minMass)) || [];
	}

	useEffect(() => {
		if (minMass) {
			let newFiltered: IMeteor[] = [];
			const referencedYear = year ? Number(year) : MAX_YEAR;
			let i = 0;

			for (; i <= MAX_YEAR; i++) {
				newFiltered = getFilteredByYear(referencedYear + i);
				
				if (newFiltered.length) {
					setYear((referencedYear + i).toString());
					break;
				} else {
					newFiltered = getFilteredByYear(referencedYear - i);
					if (newFiltered.length) {
						setYear((referencedYear - i).toString());
						break;
					}
				}
			}

			if (i !== 0 && newFiltered.length) {
				setAlert({ message: JUMPED_YEAR_MESSAGE, type: 'info' });
			}
			setFilteredMeteors(newFiltered);
		}
	}, [minMass]);

	return (
		<div className={classes.root}>
			<div className={classes.filtersWrapper}>
				<TextField 
					className={classes.imput} 
					label="Year" variant="outlined"
					type="number" 
					value={year} 
					onChange={e => handleChangeYear(e.target.value)} 
					inputProps={{ min: MIN_YEAR, max: MAX_YEAR, step: 1 }} 
				/>
				<TextField 
					className={classes.imput} 
					label="Mass" variant="outlined"
					type="number" 
					value={minMass} 
					onChange={e => setMinMass(e.target.value)}
					inputProps={{ min: 0, step: 1 }} 
				/>
			</div>
			{filteredMeteors?.length ? (
				<ul className={classes.cardsList}>
					{(minMass ? filteredMeteors : meteors[Number(year)])?.map(meteor => (
						<li key={meteor.id}>
							<MeteorCard {...meteor} />
						</li>
					))}
				</ul>
			) : renderEmptyState(year && minMass ? 'The mass was not found' : 'Select year')}
		</div>
	);
};

export default MeteorsView;
