import styled from 'styled-components'

const ActivityBody = styled.div`
	padding: 10px 30px;
	width: 100%;
`

const ActivityItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 10px;
	border-bottom: ${(props) => !props.lastItem && '1px solid #23262a'};
	margin-top: 15px;
`

const Title = styled.h1`
	font-size: 0.9rem;
	color: ${(props) => props.theme.color};

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

export { Title, ActivityBody, ActivityItem }
