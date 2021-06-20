import { Typography } from "@material-ui/core";

export const renderEmptyState = (text: string) => (
	<div style={{ padding: 100, borderRadius: 5, background: '#ddd' }}>
		<Typography variant="h5">{text}</Typography>
	</div>
);