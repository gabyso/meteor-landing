import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { useEffect, useState } from 'react';
import { fetchDatasets, INasaDatastsResponse } from '../apis/nasaApi';
import { IAlertMessage, IMeteorsByYears } from '../globals/interfaces';
import MeteorsView from './MeteorsView';
import Alert from '@material-ui/lab/Alert';
import { HEADER_HEIGHT } from '../globals/consts';
import { renderEmptyState } from '../globals/helpers';

const ALERT_DURATION = 3000;


const useStyles = makeStyles(() => ({
	root: {
		background: '#f5f5f5',
		height: '100vh',
		width: '100vw',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		background: '#5E63E4',
		position: 'absolute',
		top: 0,
		left: 0,
		color: '#fff',
		width: '100%',
		height: HEADER_HEIGHT,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		position: 'absolute',
		height: `calc(100% - ${HEADER_HEIGHT}px)`,
		top: HEADER_HEIGHT,
	},
	loader: {
		paddingTop: 100,
	},
	emptyStateWrapper: {
		paddingTop: 40,
	}
}));

const Root = (): JSX.Element => {
	const classes = useStyles();
	const [meteors, setMeteors] = useState<IMeteorsByYears | null>(null);
	const [alertMessage, setAlertMessage] = useState<IAlertMessage>({ message: '' });
	const [failedFetch, setFailedFetch] = useState(false);

	const resetAlert = () => setAlertMessage({ ...alertMessage ,message: '' });

	const getDatasets = async () => {
		const res: INasaDatastsResponse = await fetchDatasets();

		if (res.error) {
			setFailedFetch(true);
			setAlertMessage({ message: res.error, type: 'error' });
		} else if (res.data) {
			const newMeteors: IMeteorsByYears = {};

			res.data.forEach(meteor => {
				const year = new Date(meteor.year).getFullYear();

				if (year) {
					if (newMeteors[year]) {
						newMeteors[year].push({ ...meteor, year });
					} else {
						newMeteors[year] = [{ ...meteor, year }];
					}
				}
			});
			setMeteors(newMeteors);
		}
	}
	
	useEffect(() => {
		getDatasets();
	},[]);

	return (
		<div className={classes.root}>
			<header className={classes.header}><Typography variant='h4'>Placer Meteor Landing</Typography></header>
			<div className={classes.content}>
				{meteors && <MeteorsView setAlert={setAlertMessage} meteors={meteors} />}
				{!meteors && !failedFetch && <div className={classes.loader}><CircularProgress /></div>}
				{failedFetch && <div className={classes.emptyStateWrapper}>{renderEmptyState('No data to show!')}</div>}
			</div>
			{!!alertMessage.message && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={true} autoHideDuration={ALERT_DURATION} onClose={() => resetAlert()} >
				<Alert elevation={6} severity={alertMessage.type} onClose={() => resetAlert()} >
					{alertMessage.message}
				</Alert>	
			</Snackbar>}
		</div>
	);
};

export default Root;