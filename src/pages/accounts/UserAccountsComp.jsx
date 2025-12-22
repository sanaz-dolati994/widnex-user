import Text from "../../core/utils/Text";
import {FaWallet} from "react-icons/fa";
import {GiProfit} from "react-icons/gi";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import BankAccounts from "./banks/BankAccounts";
import WalletAccounts from "./wallets/WalletAccounts";


const UserAccountsComp = () => {

    const mainTabs = [
        { title: 'bank-accounts', Icon: FaWallet },
        { title: 'wallet-accounts', Icon: GiProfit  }
    ]
    const [searchParams, setSearchParams] = useSearchParams()
    const [mainTab, setMainTab] = useState(searchParams?.get('tab') || 'bank-accounts')
    useEffect(() => {
        setSearchParams({ tab: mainTab })
    }, [mainTab])


    return (
        <div className={'max-w-[1200px] mx-auto text-black dark:text-white mt-12'}>
            {/* Main Tab */}
            <div className={'w-full flex items-center justify-center my-3'}>
                <div className={'rounded-md border-[1px] dark:border-gray-300 border-gray-800 w-min flex items-center justify-center'}>
                    {mainTabs.map(item => {
                        const { Icon, title } = item
                        const active = title === mainTab
                        return (
                            <div className={`min-w-[144px] flex items-center justify-center rounded-md transition
                                ${active ? 'dark:bg-gray-100 bg-gray-800 dark:text-black text-white shadow-md' : ''} 
                                min-h-[38px] cursor-pointer gap-2 lg:text-sm text-xs`}
                                 onClick={() => setMainTab(title)}
                            >
                                <Icon size={20} />
                                <Text tid={title} />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={'w-full bg-white dark:bg-secondaryBg rounded-md p-6 min-h-[300px] shadow-md relative'}>
                {mainTab === 'bank-accounts' ?
                    <BankAccounts />
                : null}
                {mainTab === 'wallet-accounts' ?
                    <WalletAccounts />
                : null}
            </div>
        </div>
    )
}

export default UserAccountsComp
