import { CFlexCenter, FlexCenter, FlexStart } from '../../../styles/CommonStyles'
import { WizardIcon, RWizardWrapper, Check } from '../../../styles/responsive/Authentication'
import { RText } from '../../../styles/responsive/Common'
import Text from '../../../core/utils/Text'

const RWizard = ({ items, active }) => {

	const last = items.length - 1
	return (
		<RWizardWrapper>
			<CFlexCenter>
				{items.map((item, idx) => (
					<FlexStart width='100%' height='40px'>
						<FlexCenter width='10%' height='40px'>
							<WizardIcon
								active={idx <= active}
								last={idx === last}
								lineActive={idx <= active - 1 || active === last}
							>
								<FlexCenter width='100%' height='100%'>
									<Check active={idx <= active - 1 || active === last} size={12} />
								</FlexCenter>
							</WizardIcon>
						</FlexCenter>
						<RText>
							<Text tid={item.title} />
						</RText>
					</FlexStart>
				))}
			</CFlexCenter>
		</RWizardWrapper>
	)
}

export default RWizard
