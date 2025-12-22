import Text from "../../../core/utils/Text";
import React, { useEffect, useState } from "react";
import ModalLayout from "../../../components/layouts/ModalLayout";
import { DText, FlexCenter } from "../../../styles/CommonStyles";
import { ScrollWrap } from "../../../styles/responsive/Common";
import { useWindowSize } from "../../../core/hooks/useWindowSize";
import { useProfileQuery } from "../../../core/services/react-query/useProfileQuery";
import getBankInfo from "../../../packages/bank-service/Bank";
import BankCard from "../../../packages/bank-service/BankCard";
import WalletCard from "../../../packages/wallet-service/WalletCard";
import styled from "styled-components";
import { useGetFiatDepositAccount } from "../../../core/services/react-query/useSetting";
import { ReactComponent as NotFound } from "../assets/not-found.svg";
import { Link } from "react-router-dom";


const ChooseAccount = ({ label, type, coin, value, onOptionChange, depositWithId = false, className = '' }) => {

    const { width } = useWindowSize()
    const { data: profile } = useProfileQuery()

    const { data: depositWithIdAccounts } = useGetFiatDepositAccount()

    const [modal, setModal] = useState(false)
    const closeModal = () => setModal(false)
    const openModal = () => setModal(true)

    const [bankInfo, setBankInfo] = useState(null)

    const [accounts, setAccounts] = useState([])
    useEffect(() => {
        if (!profile) return
        if (type === 'wallet') {
            if (!!coin) {
                const accs = profile.wallets?.filter(x => x.coin === coin.id && (x.status === 'VERIFIED' || !!x.verifyAt))
                setAccounts(accs)
            }
        } else {
            let accs = profile.banks?.filter(x => x.status === 'VERIFIED' || !!x.verifyAt)
            if (depositWithId) {
                if (depositWithIdAccounts) {
                    const ibans = depositWithIdAccounts.userIbans
                    accs = accs.filter(x => ibans.includes(x.shebaNo)) || []
                    setAccounts(accs)
                }
            } else {
                setAccounts(accs)
            }
        }
        onOptionChange(null)

    }, [profile, coin, depositWithIdAccounts, depositWithId])

    const onCardClicked = (idx, bankInfo) => {
        if (bankInfo) setBankInfo(bankInfo)
        closeModal()
        onOptionChange(accounts[idx])
    }

    return (
        <div className={'w-full flex flex-col items-center gap-1'}>
            {!!value ?
                type === 'wallet' ?
                    <WalletCard
                        item={value}
                        onClick={openModal}
                    />
                    :
                    <BankCard
                        bankAccount={value}
                        onClick={openModal}
                        bankInfo={bankInfo}
                        new
                    />
                :
                <div
                    className={'w-full flex items-center justify-center rounded-lg border-[1px] border-main border-opacity-20 px-4 py-3 cursor-pointer bg-cBlue ' + className}
                    onClick={openModal}
                >
                    <Text tid={label} className={'text-xs text-secondary'} />
                </div>
            }


            <ModalLayout
                open={modal}
                onClose={closeModal}
                width={width < 480 ? '90%' : '800px'}
            >
                <FlexCenter style={{ marginBottom: '10px' }}>
                    <DText className="text-base font-semibold flex items-center justify-center">
                        <Text tid={label} />
                    </DText>
                </FlexCenter>
                <ScrollWrap maxHeight='400px'>
                    {accounts.length ?
                        <Grid type={type}>
                            {accounts?.map((option, idx) => (
                                <>
                                    {type === 'wallet' ?
                                        <WalletOption
                                            item={option}
                                            idx={idx}
                                            onCardClicked={onCardClicked}
                                        />
                                        :
                                        <BankOption
                                            item={option}
                                            idx={idx}
                                            onCardClicked={onCardClicked}
                                        />
                                    }
                                </>
                            ))}
                        </Grid>
                        :
                        <div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
                            <NotFound width={240} height={164} />
                            <Text tid={`no-${type}-account-added`} className={'lg:text-sm text-xs text-secondary'} />
                            <Link to={`/profile/cards&accounts?tab=${type}-accounts`}>
                                <Text tid={`add-${type}-account`} className={'text-sm underline text-blue-500'} />
                            </Link>
                        </div>
                    }

                </ScrollWrap>
            </ModalLayout>
        </div>
    )
}


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  row-gap: 40px;
  margin: 10px 0;
  
  @media screen and (max-width: 480px) {
    grid-template-columns: repeat(1, 100%);
  };
`


const BankOption = ({
    item,
    idx,
    onCardClicked
}) => {

    const bankInfo = getBankInfo(item.cardNo)

    if (!bankInfo) {
        return <></>
    }

    return (
        <FlexCenter>
            <BankCard
                onClick={() => onCardClicked(idx, bankInfo)}
                bankInfo={bankInfo}
                bankAccount={item}
            />
        </FlexCenter>

    )
}


const WalletOption = ({
    item,
    idx,
    onCardClicked
}) => {

    return (
        <FlexCenter>
            <WalletCard
                onClick={() => onCardClicked(idx)}
                item={item}
            />
        </FlexCenter>
    )
}

export default ChooseAccount
