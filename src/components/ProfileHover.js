import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';
import appConfig from '../../config.json';

export function ProfileHover(props) {
	const { mensagem } = props;

	return (
		props.open && mensagem.id === props.id ?
			<Box
				styleSheet={{
					position: 'relative',
				}}
			>
				<Box
					styleSheet={{
						display: 'inline',
						flexDirection: 'column',
						borderRadius: '5px',
						position: 'absolute',
						backgroundColor: appConfig.theme.colors.neutrals[800],
						width: '300px',
						height: 'auto',
						padding: '10px',
						boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
						zIndex: '100',
					}}
					onMouseOut={() => props.setOpen(true)}
				>
					<Box
						tag="ul"
						styleSheet={{
							display: 'inline',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							paddingTop: '16px',
							overflow: 'auto',
						}}
					>
						<Image
							tag="li"
							styleSheet={{
								display: 'inline',
								width: '40%',
								borderRadius: '50%',
								padding: '10px',
								focus: {
									backgroundColor: appConfig.theme.colors.neutrals[600],
								},
							}}
							src={`https://github.com/${mensagem.de}.png`}
						/>
						<Text
							tag="li"
							styleSheet={{
								display: 'inline',
								position: 'relative',
								width: '100%',
								padding: '10px',
								bottom: '50px',
								focus: {
									backgroundColor: appConfig.theme.colors.neutrals[600],
								},
							}}
						>
							{mensagem.de}
						</Text>
					</Box>
				</Box>
			</Box>
			: <></>
	)
}