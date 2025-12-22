import { Link } from "react-router-dom";
import Card from "../../../components/common/Card"
import { IoBarChart } from "react-icons/io5";



const RChart = () => {

    return (
        <Link to={'/trade/advance'}>
            <Card
                className={'w-full h-full relative'}
                padding={'px-2 py-4 rounded-md flex items-center justify-center'}
            >
                <IoBarChart size={24} />
            </Card>
        </Link>
    )
}

export default RChart