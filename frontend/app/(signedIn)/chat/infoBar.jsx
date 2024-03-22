
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';

import { blue, deepOrange } from '@mui/material/colors';

const drawerWidth = 240;

export default function InfoBar()
{
	let members = { "Nagato": "online", "George": "offline" };

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
			anchor='right'
			>
			<Toolbar>
				<h1 className='text-3xl font-semibold text-basicallylight'>Members</h1>
			</Toolbar>
			<Divider />
			<List>
				{Object.entries(members).map(([memberName, status]) => (
					<ListItem key={memberName}>
						<Avatar sx={{ bgcolor: status === 'online' ? deepOrange[500] : blue[500] }}>
							{memberName[0]}
						</Avatar>
						<h1 className='ml-5 font-medium text-basicallylight'>{memberName}</h1>
						<h1 className={`ml-5 font-normal ${status === 'online' ? 'text-green-500' : 'text-gray-400'} text-sm`}>
							{status === 'online' ? 'Online' : 'Offline'}
						</h1>
					</ListItem>
				))}
			</List>
		</Drawer>

		// <div className='h-full w-[${}px] bg-[#2f3137]'>
		// 	<Toolbar>
		// 		<h1 className='text-3xl font-semibold text-white'>Online</h1>
		// 	</Toolbar>
		// 	<Divider />
		// 	<List>
		// 		{Object.entries(members).map(([memberName, status]) => (
		// 			<ListItem  key={memberName}>
		// 				<Avatar sx={{ bgcolor: status === 'online' ? deepOrange[500] : blue[500] }}>
		// 					{memberName[0]}
		// 				</Avatar>
		// 				<h1 className='ml-5 font-medium text-white'>{memberName}</h1>
		// 				<h1 className={`ml-5 font-normal ${status === 'online' ? 'text-green-500' : 'text-gray-400'} text-sm`}>
		// 					{status === 'online' ? 'Online' : 'Offline'}
		// 				</h1>
		// 			</ListItem>
		// 		))}
		// 	</List>
		// </div>
	);
}
