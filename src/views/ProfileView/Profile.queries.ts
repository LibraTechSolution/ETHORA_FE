import { useQuery } from '@tanstack/react-query';

import { GraphQLClient, gql } from 'graphql-request';

const graphQLClient = new GraphQLClient('https://api.studio.thegraph.com/proxy/53818/bo-devtest/version/latest');

export const useGetPosts = () => {
  return useQuery(['useGetPosts'], async () => {
    const getPostList = await graphQLClient.request(gql`
      {
        # ------------------
        # Daily
        userStatsDaily: leaderboards(
          orderBy: netPnL
          orderDirection: desc
          first: 100
          where: {
            timestamp: "19627"
            totalTrades_gte: 5
            user_not_in: [
              "0x361e9013d7e4f2e4a035ba97fdb42cb7d2540259"
              "0x6fae0eed696ec28c81269b99240ee960570666f1"
              "0x0b8750c12fa14decd31eadff7e92cbd64a198094"
              "0x10df9a95010c8b9fbdc8f6191de824df9c99a8d8"
              "0x547a821c692921d82ebd936320dc1a608a6e38c1"
              "0x2a007f31146ff8f939b6ca3ad18c8d2a6e42eb73"
              "0xf0344cc4e0c0b5e653a83e4e2c9cb198cb8bf60d"
              "0x7d74c85df27fc42142ada6a238411727ee5572e0"
              "0x38126b14fb81c50b58a00ebfd8376f5e3de82438"
              "0xf5996dd3efc0ba3cf664209db59e441c34758de7"
              "0xa506565e7d1330f172ba41aaf90b840c47a0b822"
              "0xba60ec5b1c28993cba0e1c5022dc4c4735718873"
            ]
          }
        ) {
          user
          totalTrades
          netPnL
          volume
          usdcNetPnL
          usdcTotalTrades
          usdcTradesWon
          usdcVolume
          usdcWinRate
          bfrNetPnL
          bfrTotalTrades
          bfrTradesWon
          bfrVolume
          bfrWinRate
          arbNetPnL
          arbTotalTrades
          arbTradesWon
          arbVolume
          arbWinRate
        }
        # ------------------
        # Weekly
        userStatsWeekly: weeklyLeaderboards(
          orderBy: netPnL
          orderDirection: desc
          first: 100
          where: {
            timestamp: "2803"
            totalTrades_gte: 5
            user_not_in: [
              "0x361e9013d7e4f2e4a035ba97fdb42cb7d2540259"
              "0x6fae0eed696ec28c81269b99240ee960570666f1"
              "0x0b8750c12fa14decd31eadff7e92cbd64a198094"
              "0x10df9a95010c8b9fbdc8f6191de824df9c99a8d8"
              "0x547a821c692921d82ebd936320dc1a608a6e38c1"
              "0x2a007f31146ff8f939b6ca3ad18c8d2a6e42eb73"
              "0xf0344cc4e0c0b5e653a83e4e2c9cb198cb8bf60d"
              "0x7d74c85df27fc42142ada6a238411727ee5572e0"
              "0x38126b14fb81c50b58a00ebfd8376f5e3de82438"
              "0xf5996dd3efc0ba3cf664209db59e441c34758de7"
              "0xa506565e7d1330f172ba41aaf90b840c47a0b822"
              "0xba60ec5b1c28993cba0e1c5022dc4c4735718873"
            ]
          }
        ) {
          user
          totalTrades
          netPnL
          volume
          usdcNetPnL
          usdcTotalTrades
          usdcTradesWon
          usdcVolume
          usdcWinRate
          bfrNetPnL
          bfrTotalTrades
          bfrTradesWon
          bfrVolume
          bfrWinRate
          arbNetPnL
          arbTotalTrades
          arbTradesWon
          arbVolume
          arbWinRate
        }
        # ------------------
        # Win Rate: (count payout > 0) / total count
        # ------------------
        # Most Traded Assets: reduce array để find optionContract.asset nhiều nhất
        # ------------------
        # Metrics:
        # - TOKEN Trading Metrics:
        # + totalPayouts[tokenName] = SUM(payout)
        # + net_pnl[tokenName] = SUM(payout - totalFee)
        # + volume[tokenName] = SUM(totalFee)
        # ------------------
        userOptionDatas(first: 1000, where: { user: "0xB13332f8d4E81df0709d9Ffa15CB42D8dC0839c3", state_not: 1 }) {
          optionContract {
            address
            token
            asset
          }
          payout
          totalFee
          expirationTime
        }
        # ------------------
        # Metrics:
        # -  :
        referralDatas(where: { id: "0xB13332f8d4E81df0709d9Ffa15CB42D8dC0839c3" }) {
          totalTradesReferred
          totalVolumeOfReferredTrades
          totalRebateEarned
          totalTradingVolume
          totalDiscountAvailed
          totalTradesReferredUSDC
          totalVolumeOfReferredTradesUSDC
          totalRebateEarnedUSDC
          totalTradingVolumeUSDC
          totalDiscountAvailedUSDC
          totalTradesReferredBFR
          totalVolumeOfReferredTradesBFR
          totalRebateEarnedBFR
          totalTradingVolumeBFR
          totalDiscountAvailedBFR
          totalTradesReferredARB
          totalVolumeOfReferredTradesARB
          totalRebateEarnedARB
          totalTradingVolumeARB
          totalDiscountAvailedARB
        }
        # ------------------
        # Interest
        activeData: userOptionDatas(
          first: 1000
          where: { user: "0xB13332f8d4E81df0709d9Ffa15CB42D8dC0839c3", state: 1 }
        ) {
          optionContract {
            address
            token
          }
          totalFee
        }
      }
    `);
    return getPostList as any;
  });
};
