import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Groups3Icon from '@mui/icons-material/Groups3';

const drawerWidth = 240;

export default function Sidebar()
{
	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
					backgroundColor: "#2f3137",
				},
			}}
			variant="permanent"
			anchor="left">
			<Toolbar>
				<h1 className='text-3xl font-semibold text-white'>Teams</h1>
			</Toolbar>
			<Divider />
			<List>
				{/* use loop to create multiple list items */}
				{["MyTeam", "Chicorita", "Snoozefest"].map((text, index) => (
					<ListItem key={index}>
						<ListItemButton>
							<ListItemIcon>
								<Groups3Icon htmlColor='white' />
							</ListItemIcon>
							<ListItemText primary={<h1 className='text-white'>{text}</h1>} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}