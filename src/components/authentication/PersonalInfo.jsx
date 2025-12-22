import {
	PersonalBox,
	Flex,
	Input,
	Row,
	Label,
	Error,
	PersonalTitle,
	Toggle,
	ButtonContainer,
	NextStep, PhoneInputWrapper, PhonePrefix, PhoneInput,
} from '../../styles/AuthenticationStyles'
import Text from '../../core/utils/Text'
import { useMainContext } from '../../core/contexts/main'
import usePersonalInfo from '../../core/hooks/usePersonalInfo'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { MOBILE_SIZE } from "../../core/constants/common";
import { useWindowSize } from "../../core/hooks/useWindowSize";
import transition from "react-element-popper/animations/transition";



import { useTranslation } from 'react-i18next'


import provinces from '../../core/provinces.json'
import cities from '../../core/cities.json'
import { Select } from '../../styles/AccountsAndCardsStyles'
import { useState } from 'react'

const PersonalInfo = ({ onInputValueChange, onSubmitClicked }) => {
	const {
		main: { lang, theme },
	} = useMainContext()
	const { width } = useWindowSize()


	const { t } = useTranslation()

	const { authData, DateInput, setSelectedValue, selectedDate, toggleGender } = usePersonalInfo()

	const [hasError, setHasError] = useState(false)
	const onNextClick = () => {
		if (!hasError) setHasError(true)
		onSubmitClicked()
	}


	return (
		<div style={{ padding: '40px 30px', width: '100%', height: '100%' }}>
			<PersonalBox>
				<PersonalTitle>
					<Text tid='user-info' />
				</PersonalTitle>
				<Flex>
					<Row margin='0 30px'>
						<Label>
							<Text tid='firstName' />
						</Label>
						<PersonalInput
							onChange={onInputValueChange}
							value={authData.step2.data.firstName}
							validation={authData.step2.validation.firstName}
							hasError={hasError}
							label={'firstName'}
						/>
					</Row>
					<Row margin='0 30px'>
						<Label>
							<Text tid='lastName' />
						</Label>
						<PersonalInput
							onChange={onInputValueChange}
							value={authData.step2.data.lastName}
							validation={authData.step2.validation.lastName}
							hasError={hasError}
							label={'lastName'}
						/>
					</Row>
					<Row margin={'0 30px'}>
						<Label>
							<Text tid={'fatherName'} />
						</Label>
						<PersonalInput
							onChange={onInputValueChange}
							value={authData.step2.data.fatherName}
							validation={authData.step2.validation.fatherName}
							hasError={hasError}
							label={'fatherName'}
						/>
					</Row>
				</Flex>
			</PersonalBox>
			<PersonalBox margin='30px 0'>
				<PersonalTitle>
					<Text tid='identity-info' />
				</PersonalTitle>
				<Flex>
					<Row margin='0 30px'>
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
							className={`${theme === 'dark' && 'bg-dark custom-calendar'} teal ${width < MOBILE_SIZE && 'rmdp-mobile'}`}
							calendarPosition={lang === 'fa' ? 'left-top' : 'right-top'}
						/>
						{!authData.step2.data.birthDate && hasError ?
							<Error>
								<Text tid={`bithDate-is-required`} />
							</Error>
							: null}
					</Row>
					<Row margin='0 30px'>
						<Label>
							<Text tid='idNo' />
						</Label>
						<PersonalInput
							onChange={onInputValueChange}
							value={authData.step2.data.idNo}
							validation={authData.step2.validation.idNo}
							hasError={hasError}
							label={'idNo'}
							maxLength={10}
							_type='number'
						/>
					</Row>
					<Row margin='0 30px'>
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
				</Flex>
			</PersonalBox>
			<PersonalBox margin='30px 0' noBorder={true}>
				<PersonalTitle>
					<Text tid='address' />
				</PersonalTitle>
				<Flex>

					<Row margin='12px 30px'>
						<Label>
							<Text tid='state' />
						</Label>
						<Select
							value={authData.step2.data.address.county}
							onChange={(e) => onInputValueChange(e, 'county')}

						>
							{provinces.map((item) => (
								<option key={JSON.stringify(item)} value={item.name}>
									{item.name}
								</option>
							))}
						</Select>
						{!authData.step2.data.address.county && hasError ?
							<Error>
								<Text tid={`county-is-required`} />
							</Error>
							: null}
					</Row>
					<Row margin='12px 30px'>
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
						{!authData.step2.data.address.city && hasError ?
							<Error>
								<Text tid={`city-is-required`} />
							</Error>
							: null}
					</Row>
					<Row margin='12px 30px'>
						<Label>
							<Text tid='address' />
						</Label>
						<PersonalInput
							onChange={onInputValueChange}
							value={authData.step2.data.address.line}
							validation={authData.step2.validation.line}
							hasError={hasError}
							label={'line'}
							style={{ minWidth: '400px' }}
						/>
					</Row>
					<Row margin='12px 30px'>
						<Label>
							<Text tid='postalCode' />
						</Label>
						<PersonalInput
							onChange={onInputValueChange}
							value={authData.step2.data.address.zip}
							validation={authData.step2.validation.zip}
							hasError={hasError}
							label={'zip'}
							maxLength={10}
							_type='number'
						/>
					</Row>
					<Row margin='12px 30px'>
						<Label>
							<Text tid='phone' />
						</Label>
						<PhoneInputWrapper>
							<PhonePrefix
								onChange={(e) => onInputValueChange(e, 'phonePrefix')}
								value={authData.step2.data.phonePrefix}
								maxLength={3}
							/>
							<PhoneInput
								onChange={(e) => onInputValueChange(e, 'phone')}
								value={authData.step2.data.phone}
								maxLength={8}
							/>
						</PhoneInputWrapper>
						{/*<Input*/}
						{/*	onChange={(e) => onInputValueChange(e, 'phone')}*/}
						{/*	value={authData.step2.data.phone}*/}
						{/*	_type='number'*/}
						{/*/>*/}
					</Row>
				</Flex>
			</PersonalBox>
			<ButtonContainer>
				<NextStep
					active
					onClick={onNextClick}
				>
					<Text tid='next-step' />
				</NextStep>
			</ButtonContainer>
		</div>
	)
}

const PersonalInput = ({ onChange, value, validation, hasError, label, ...rest }) => {


	let status = 'normal'
	if (hasError) status = 'error'
	if (validation === 'valid') status = 'valid'
	if (validation === 'error') status = 'error'

	return (
		<div className={'flex flex-col'}>
			<Input
				onChange={(e) => onChange(e, label)}
				value={value}
				status={status}
				{...rest}
			/>
			{status === 'error' && (
				<Error>
					<Text tid={validation === 'error' ? `auth-${label}-error` : `${label}-is-required`} />
				</Error>
			)}
		</div>
	)
}

export default PersonalInfo
