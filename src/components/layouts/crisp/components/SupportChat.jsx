import {
    SupportButton, SupportIcon,
    SupportWrapper, AnimatedDot, AnimatedDotsWrapper
} from "../utils/Styles";
import {AnimatePresence} from "framer-motion";
import {useState} from "react";
import SupportBox from "./SupportBox";


const SupportChat = ({
    support,
    enterSupport,
    exitSupport
}) => {

    return (
        <SupportWrapper boxOpen={support}>
            <SupportButton onClick={enterSupport}>
                <SupportIcon size={26} />
                <AnimatedDotsWrapper>
                    {[1, 2, 3].map(item => (
                        <AnimatedDot
                            key={item}
                            idx={item}
                        />
                    ))}
                </AnimatedDotsWrapper>
            </SupportButton>
            <AnimatePresence exitBeforeEnter>
                {support &&
                    <SupportBox
                        onClose={exitSupport}
                    />
                }
            </AnimatePresence>
        </SupportWrapper>
    )
}





export default SupportChat
