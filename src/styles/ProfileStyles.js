import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const ProfileBody = styled.div`
	padding: 10px 30px;
	width: 100%;
`

const ProfileItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 10px;
	margin-top: 10px;
	border-bottom: 1px solid ${(props) => props.theme.input};
`

const Title = styled.h1`
	font-size: 1rem;
	font-weight: 500;
	color: ${(props) => props.color || props.theme.color};
	// font-family: ${(props) => props.number && 'monospace'};

	@media screen and (max-width: 480px) {
		font-size: 0.75rem;
	}
`

const AuthBtn = styled.div`
	width: fit-content;
	background-color: ${(props) => props.theme.primaryBg};
	color: ${(props) => props.theme.color};
	padding: 5px 16px;
	margin: 0 auto;
	margin-top: 20px;
	border-radius: 8px;
	cursor: pointer;
`

// from here ==> main profile component styles
const ProfileImageWrapper = styled.div`
	width: 180px;
	height: 180px;
	border: 3px solid ${(props) => props.theme.mainOrange};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	@media screen and (max-width: 768px) {
		width: 120px;
		height: 120px;
	}
`

const ProfileButton = styled.div`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	border-radius: 12px;
	min-width: 120px;
	font-size: 1rem;
	min-height: 32px;
	margin: 0 15px;
	cursor: pointer;
	background-color: ${(props) => props.theme.color};
	color: ${(props) => props.theme.mainBg};
	transition: all 0.3s;

	&:hover {
		background-color: ${(props) => props.theme.mainBg};
		border: 1px solid ${(props) => props.theme.color};
		color: ${(props) => props.theme.color};
	}
`

const ProfileLabel = styled.div`
	color: ${(props) => props.theme.color};
	margin: 0 10px;
	font-size: 0.9rem;

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
`

const ProfileBadge = styled.div`
	color: ${(props) => props.theme.color};
	border-radius: 12px;
	// letter-spacing: 1.4px;
	font-size: 1rem;
	min-height: 32px;
	margin: 4px 0;
	padding: 8px 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.primaryBg};
	box-shadow: 5px 0 4px ${(props) => props.theme.primaryBg};
	// font-family: ${(props) => props.number && 'monospace'};

	${() => tw`w-[260px] flex-1`};

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
}
	
`

const ImageGetter = styled.input`
	display: block;
	position: absolute;
	height: 32px;
	outline: none;
	width: 120px;
	opacity: 0;
	top: 0;
	left: 0;
	cursor: pointer;
`

const NoAvatarWrapper = styled.div`
	width: 160px;
	height: 160px;
	font-size: 7rem;
	border-radius: 50%;
	background-color: ${(props) => props.theme.color};
	color: ${(props) => props.theme.mainBg};
	display: flex;
	justify-content: center;
	align-items: center;

	@media screen and (max-width: 768px) {
		width: 110px;
		height: 110px;
		font-size: 5rem;
	}
`

export {
	AuthBtn,
	Title,
	ProfileItem,
	ProfileBody,
	ProfileImageWrapper,
	ProfileButton,
	ProfileLabel,
	ProfileBadge,
	ImageGetter,
	NoAvatarWrapper,
}
