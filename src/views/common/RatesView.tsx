import React from "react";
import { Text } from "@chakra-ui/react";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { fixedNumberToPercentage } from "../../utils/fixedPoint";
import { PercentageView } from "./PercentageView";

export const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  const variableDepositAPY = reserveProtocolData?.liquidityRate;
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }

    return (
      <PercentageView
        ratio={fixedNumberToPercentage(variableDepositAPY, 4, 2)}
      />
    );
  }, [variableDepositAPY]);
};

export const BorrowAPRView: React.FC<{
  tokenAddress: string;
  isStable?: boolean | false;
}> = ({ tokenAddress, isStable }) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);

  const borrowRate = isStable
    ? reserveProtocolData?.stableBorrowRate
    : reserveProtocolData?.variableBorrowRate;

  return React.useMemo(() => {
    if (borrowRate === undefined) {
      return <>-</>;
    }

    return <PercentageView ratio={fixedNumberToPercentage(borrowRate, 3, 2)} />;
  }, [borrowRate]);
};
