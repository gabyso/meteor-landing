import { Card, Divider, makeStyles, Typography } from '@material-ui/core';
import { IMeteor } from '../globals/interfaces';

const useStyles = makeStyles(() => ({
	root: {
		height: 180,
		width: 250,
		margin: 8
	},
	cardTitle: {
		height: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	meteorDetails: {
		display: 'flex',
		justifyContent: 'space-around',
		paddingTop: 20
	},
	fieldDetail: {
		marginBottom: 4,
	}
}));

const MeteorCard = (props: IMeteor): JSX.Element => {
	const classes = useStyles();
	const { name, year, mass } = props;

	const renderDetail = (field: string, value: string | number) => (
		<div className={classes.fieldDetail}>
			<Typography variant="h6">{field}</Typography>
			<Typography variant="body1">{value}</Typography>
		</div>
	);
	
	return (
		<Card  className={classes.root}>
			<div className={classes.cardTitle}>
				<Typography variant="h5">{name}</Typography>
			</div>
			<Divider />
			<div className={classes.meteorDetails}>
				{renderDetail('year', year)}
				{renderDetail('mass', mass)}
			</div>
		</Card>
	);
};

export default MeteorCard;