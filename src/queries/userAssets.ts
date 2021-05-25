import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllATokens } from "./allATokens";
import { useAllReserveTokens } from "./allReserveTokens";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken, weiPerToken } from "./decimalsForToken";

export const useUserAssetBalance = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "user", _p2: "asset", assetAddress: string | undefined, _p3: "balance"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const asset = Erc20abi__factory.connect(
      assetAddress,
      params.library.getSigner()
    );

    return asset.balanceOf(params.account);
  },
  assetAddress => ["user", "asset", assetAddress, "balance"],
  () => undefined,
  {
    staleTime: 2 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);

export const useUserReserveAssetBalances =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { symbol: string; tokenAddress: string; balance: BigNumber }[],
    [_p1: "user", _p2: "allReserves", _p3: "balances"],
    []
  >(
    async params => {
      const reserves = await useAllReserveTokens.fetchQueryDefined(params);

      const reservesWithBalances = await Promise.all(
        reserves.map(reserve =>
          useUserAssetBalance
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(result => ({ ...reserve, balance: result }))
        )
      );

      return reservesWithBalances;
    },
    () => ["user", "allReserves", "balances"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

interface ReserveAssetBalancesDaiWei {
  symbol: string;
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumberish;
  daiWeiPricePer: BigNumber;
  daiWeiPriceTotal: BigNumber;
}

export const useUserReserveAssetBalancesDaiWei =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReserveAssetBalancesDaiWei[],
    [_p1: "user", _p2: "allReserves", _p3: "balances", _p4: "dai"],
    []
  >(
    async params => {
      const reserves = await useUserReserveAssetBalances.fetchQueryDefined(
        params
      );
      const withDaiPrices = await Promise.all(
        reserves.map(reserve =>
          Promise.all([
            useAssetPriceInDaiWei.fetchQueryDefined(
              params,
              reserve.tokenAddress
            ),
            useDecimalCountForToken.fetchQueryDefined(
              params,
              reserve.tokenAddress
            ),
          ]).then(([daiPricePerToken, decimals]) => ({
            ...reserve,
            daiWeiPricePer: daiPricePerToken,
            daiWeiPriceTotal: daiPricePerToken
              .mul(reserve.balance)
              .div(weiPerToken(decimals)),
            decimals,
          }))
        )
      );

      return withDaiPrices;
    },
    () => ["user", "allReserves", "balances", "dai"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

export const useUserDepositAssetBalances =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { symbol: string; tokenAddress: string; balance: BigNumber }[],
    [_p1: "user", _p2: "allDeposits", _p3: "balances"],
    []
  >(
    async params => {
      const aTokens = await useAllATokens.fetchQueryDefined(params);

      const aTokensWithBalances = await Promise.all(
        aTokens.map(reserve =>
          useUserAssetBalance
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(result => ({ ...reserve, balance: result }))
        )
      );

      return aTokensWithBalances;
    },
    () => ["user", "allDeposits", "balances"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

interface DepositAssetBalancesDaiWei {
  symbol: string;
  aSymbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  balance: BigNumber;
  daiWeiPricePer: BigNumber;
  daiWeiPriceTotal: BigNumber;
}

export const useUserDepositAssetBalancesDaiWei =
  buildQueryHookWhenParamsDefinedChainAddrs<
    DepositAssetBalancesDaiWei[],
    [_p1: "user", _p2: "allDeposits", _p3: "balances", _p4: "dai"],
    []
  >(
    async params => {
      const [aTokens, reserves] = await Promise.all([
        useAllATokens.fetchQueryDefined(params).then(result =>
          Promise.all(
            result.map(aToken =>
              useUserAssetBalance
                .fetchQueryDefined(params, aToken.tokenAddress)
                .then(aTokenBalance => ({
                  ...aToken,
                  balance: aTokenBalance,
                }))
            )
          )
        ),
        useUserReserveAssetBalancesDaiWei.fetchQueryDefined(params),
      ]);

      const reservesByTokenAddr = Object.fromEntries(
        reserves.map(r => [r.tokenAddress, r])
      );

      const withDaiPrices: DepositAssetBalancesDaiWei[] = [];
      for (const at of aTokens) {
        const reserve = reservesByTokenAddr[at.tokenAddress];
        if (!reserve) {
          console.warn("Equivalent reserve not present for aToken:", at);
          continue;
        }
        withDaiPrices.push({
          aSymbol: at.symbol,
          symbol: reserve.symbol,
          aTokenAddress: at.tokenAddress,
          tokenAddress: reserve.tokenAddress,
          balance: at.balance,
          daiWeiPricePer: reserve.daiWeiPricePer,
          daiWeiPriceTotal: at.balance
            .mul(reserve.daiWeiPricePer)
            .div(weiPerToken(reserve.decimals)),
        });
      }

      return withDaiPrices;
    },
    () => ["user", "allDeposits", "balances", "dai"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );