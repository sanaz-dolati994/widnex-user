import { ScaleLoader } from "react-spinners";
import { SpinnerContainer } from "../../../styles/CommonStyles";



const Loading = (props) => {

    return (
        <>
            {props.loading &&
                <SpinnerContainer {...props}>
                    <ScaleLoader
                        height={props.height || 20}
                        width={props.width || 2}
                        color="#0773F1"
                    />
                </SpinnerContainer>
            }
        </>
    )
}

export default Loading;
