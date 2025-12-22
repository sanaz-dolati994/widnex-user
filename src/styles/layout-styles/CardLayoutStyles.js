import styled from 'styled-components'
import tw from 'twin.macro'

const Body = styled.div`
	color: ${(props) => props.theme.color};

	width: ${(props) => props.width || '100%'};
	height: ${(props) => props.height};
	min-height: ${(props) => props.minHeight};
	max-height: ${(props) => props.maxHeight};
	background-color: ${(props) => props.bgColor ? props.theme.secondaryBg : 'transparent'};
	border-radius: 14px;
	margin-top: ${(props) => props.marginTop || '25px'};
	padding: 0 0 80px 0;
	/* box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16); */
	position: relative;
	transition: all 0.3s;

	@media screen and (max-width: 1080px) {
		padding: 10px 10px 80px 10px;
	} ;
`

const Header = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: ${(props) => (props.title && '70px') || '20px'};
	padding: 0 20px;
	border-top-left-radius: 14px;
	border-top-right-radius: 14px;
`

const Title = styled.div`
	color: ${(props) => props.theme.color};
	font-size: 14px;
	font-weight: 600;
	// letter-spacing: 1.5px;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

export { Body, Title, Header }
