import {TABLET_SIZE} from "../../core/constants/common";
import {Column, HeaderColumn, HeaderRow, Row, Table, TableWrapper} from "../../styles/TableStyle";
import Text from "../../core/utils/Text";
import {Flex} from "../../styles/CommonStyles";
import {SOCKET_URL} from "../../core/constants/urls";
import {CoinName} from "../../styles/UserBalanceStyles";
import {HIDDEN_CONST} from "../../core/hooks/useBalanceViewState";
import {formatNumber} from "../../core/utils/common";
import React from "react";
import {useWindowSize} from "../../core/hooks/useWindowSize";

const headers = ['coin', 'available', 'blockedAmount', 'assetsPercentage']

export const WalletTable = ({ coins, viewHidden, chartData, showIcon = false }) => {

    const { width: Width } = useWindowSize()
    const calculatePc = (idx) => {
        let total = 0
        chartData?.forEach((item) => (total += item.value))
        const res = (chartData[idx]?.value / total).toFixed(1) * 100
        return res ? res : 0
    }

    return (
        <div style={{ width: '100%' }}>
            <TableWrapper height='180px'>
                <Table width='100%'>
                    <HeaderRow width='100%'>
                        {headers.map((item) => (
                            <HeaderColumn width='25%'>
                                <Text tid={item} />
                            </HeaderColumn>
                        ))}
                    </HeaderRow>
                    {coins?.slice(0, Math.min(coins?.length, 3)).map((item, index) => {
                        return (
                            <Row>
                                <Column width='25%'>
                                    <Flex className={'px-2'} align={'center'} justify={'start'}>
                                        {!!showIcon && (
                                            <img
                                                width='28px'
                                                height='28px'
                                                src={
                                                    item.coin === 'irt'
                                                        ? require('../../assets/images/tooman.png')
                                                        : SOCKET_URL + `assets/icon/${item.coin}.png`
                                                }
                                                alt=' '
                                            />
                                        )}
                                        <CoinName>
                                            <Text tid={item.coin.toUpperCase()} />
                                        </CoinName>
                                    </Flex>
                                </Column>
                                <Column width='25%' bold={viewHidden} number>
                                    {viewHidden ? HIDDEN_CONST : formatNumber(item.amount, 2)}
                                </Column>
                                <Column width='25%' bold={viewHidden} number>
                                    {viewHidden ? HIDDEN_CONST : formatNumber(item.amountBlocked, 2)}
                                </Column>
                                <Column width='25%' bold={viewHidden} number>
                                    {viewHidden ? HIDDEN_CONST : chartData.length ? `${calculatePc(index)}%` : '0%'}
                                </Column>
                            </Row>
                        )
                    })}
                </Table>
            </TableWrapper>
        </div>
    )
}
