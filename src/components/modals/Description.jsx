import {DetailsCloseBtn, DetailsTooltip, DetailsTooltipWrapper} from "../../styles/TransactionHistoryStyles";


const Description = ({show, note, onClose}) => {


    return (
        <>
            {show &&
                <DetailsTooltipWrapper>
                    <DetailsCloseBtn size={18} onClick={onClose} />
                    <DetailsTooltip>
                        {note}
                    </DetailsTooltip>
                </DetailsTooltipWrapper>
            }
        </>
    )
}

export default Description