import {getOffset} from "./utils/helper";
import {ContentWrapper, InnerPortalTarget, Pointer} from "./utils/Styles";


const InnerStep = ({ comp }) => {

    const offset = getOffset(comp)

    if (!offset) return <></>

    return (
        <>
            <InnerPortalTarget
                width={offset.width}
                height={offset.height}
                left={offset.left}
                top={offset.top}
            />
            <ContentWrapper
                left={offset.left + offset.width / 2}
                top={offset.top + offset.height + 4}
            >
                <Pointer size={18}/>
            </ContentWrapper>
        </>
    )
}

export default InnerStep
