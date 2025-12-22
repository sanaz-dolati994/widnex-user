import { useMainContext } from '../../../core/contexts/main'
import usePersonalInfo from '../../../core/hooks/usePersonalInfo'
import {
	ButtonContainer,
	Error,
	Flex,
	Input,
	Label,
	NextStep,
	PersonalTitle,
	Row,
	Toggle,
	Wrapper,
} from '../../../styles/AuthenticationStyles'
import { FlexCenter } from '../../../styles/CommonStyles'
import Text from '../../../core/utils/Text'
import { useWindowSize } from '../../../core/hooks/useWindowSize'
import AuthLoading from '../../authentication/AuthLoading'
import '../../../assets/css/calendar.css'
import { RFixedButton } from '../../../styles/responsive/Authentication'
import { RButton } from '../../../styles/responsive/Common'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import transition from 'react-element-popper/animations/transition'
import { MOBILE_SIZE } from '../../../core/constants/common'
import DatePicker from 'react-multi-date-picker'

// import { useTranslation } from 'react-i18next'
// import provinces from '../../../core/provinces.json'
// import cities from '../../../core/cities.json'
// import { Select } from '../../../styles/AccountsAndCardsStyles'

import { useTranslation } from 'react-i18next'
import provinces from '../../../core/provinces.json'
import cities from '../../../core/cities.json'
import { Select } from '../../../styles/AccountsAndCardsStyles'

const RPersonalInfo = ({ onInputValueChange, onSubmitClicked }) => {
	const { t } = useTranslation()
	const {
		main: { lang, theme },
	} = useMainContext()
	const { width } = useWindowSize()

	const { authData, loading, DateInput, setSelectedValue, selectedDate, toggleGender } =
		usePersonalInfo()

	return (
		<>
			<FlexCenter>
				<PersonalTitle>
					<Text tid='user-info' />
				</PersonalTitle>
			</FlexCenter>
			<Row margin='0 20px'>
				<Label>
					<Text tid='firstName' />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'firstName')}
					value={authData.step2.data.firstName}
					status={authData.step2.validation.firstName}
				/>
				{authData.step2.validation.firstName === 'error' && (
					<Error>
						<Text tid='invalid-format' />
					</Error>
				)}
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='lastName' />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'lastName')}
					value={authData.step2.data.lastName}
					status={authData.step2.validation.lastName}
				/>
				{authData.step2.validation.lastName === 'error' && (
					<Error>
						<Text tid='invalid-format' />
					</Error>
				)}
			</Row>

			<Row margin={'0 20px'}>
				<Label>
					<Text tid={'fatherName'} />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'fatherName')}
					value={authData.step2.data.fatherName}
					status={authData.step2.validation.fatherName}
				/>
				{authData.step2.validation.fatherName === 'error' && (
					<Error>
						<Text tid='invalid-format' />
					</Error>
				)}
			</Row>

			<FlexCenter style={{ marginTop: '30px' }}>
				<PersonalTitle>
					<Text tid='identity-info' />
				</PersonalTitle>
			</FlexCenter>
			<Row margin='20px'>
				<Label>
					<Text tid='birthDate' />
				</Label>
				<DatePicker
					calendar={lang === 'fa' && persian}
					locale={lang === 'fa' && persian_fa}
					value={selectedDate}
					onChange={setSelectedValue}
					animations={[transition()]}
					render={<DateInput />}
					className={`${theme === 'dark' && 'bg-dark custom-calendar'} teal `}
					calendarPosition={
						width > MOBILE_SIZE ? (lang === 'fa' ? 'left-top' : 'right-top') : 'top'
					}
				/>
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='idNo' />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'idNo')}
					value={authData.step2.data.idNo}
					status={authData.step2.validation.idNo}
					maxLength={10}
					_type='number'
				/>
				{authData.step2.validation.idNo === 'error' && (
					<Error>
						<Text tid='invalid-format' />
					</Error>
				)}
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='gender' />
				</Label>
				<Flex width='100%'>
					<Toggle
						onClick={() => toggleGender('male')}
						active={authData.step2.data.gender === 'male'}
					>
						<Text tid='male' />
					</Toggle>
					<Toggle
						onClick={() => toggleGender('female')}
						active={authData.step2.data.gender === 'female'}
					>
						<Text tid='female' />
					</Toggle>
				</Flex>
			</Row>

			<FlexCenter style={{ marginTop: '30px' }}>
				<PersonalTitle>
					<Text tid='address' />
				</PersonalTitle>
			</FlexCenter>

			<Row margin='20px'>
				<Label>
					<Text tid='state' />
				</Label>
				<Select
					value={authData.step2.data.address.county}
					onChange={(e) => onInputValueChange(e, 'county')}
				>
					<option value={''}>{t('state')}</option>
					{provinces.map((item) => (
						<option key={JSON.stringify(item)} value={item.name}>
							{item.name}
						</option>
					))}
				</Select>

				{/* <Input
							onChange={(e) => onInputValueChange(e, 'county')}
							value={authData.step2.data.address.county}
						/> */}
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='city' />
				</Label>
				{!!authData.step2.data.address.county ? (
					<Select
						value={authData.step2.data.address.city}
						onChange={(e) => onInputValueChange(e, 'city')}
					>
						<option value={''}>{t('city')}</option>
						{cities
							.filter((item) => {
								const province = provinces.find(
									(filter) => filter.name === authData.step2.data.address.county
								)

								return item.province_id === province?.id
							})
							.map((item) => (
								<option key={JSON.stringify(item)} value={item.name}>
									{item.name}
								</option>
							))}
					</Select>
				) : (
					<Input
						onChange={(e) => onInputValueChange(e, 'city')}
						value={authData.step2.data.address.city}
					/>
				)}
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='address' />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'line')}
					value={authData.step2.data.address.line}
				/>
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='postalCode' />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'zip')}
					value={authData.step2.data.address.zip}
					status={authData.step2.validation.zip}
					maxLength={10}
					_type='number'
				/>
				{authData.step2.validation.zip === 'error' && (
					<Error>
						<Text tid='invalid-format' />
					</Error>
				)}
			</Row>
			<Row margin='20px'>
				<Label>
					<Text tid='phone' />
				</Label>
				<Input
					onChange={(e) => onInputValueChange(e, 'phone')}
					value={authData.step2.data.phone}
					_type='number'
				/>
			</Row>
			<RFixedButton>
				<RButton
					margin='0'
					active={
						authData.step2.validation.firstName === 'valid' &&
						authData.step2.validation.lastName === 'valid' &&
						authData.step2.validation.idNo === 'valid' &&
						authData.step2.data.gender &&
						authData.step2.data.birthDate
					}
					onClick={onSubmitClicked}
				>
					<Text tid='next-step' />
				</RButton>
			</RFixedButton>

			<AuthLoading loading={loading} />
		</>
	)
}

export default RPersonalInfo
