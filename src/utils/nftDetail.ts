import { NFTApiGetNFTDetail } from '@/api/aggregation'
import { setDataStrclassify } from './util'
const elfDrsc = `《元灵大陆》游戏是MetaSoft 元软第一个拓荒项目，有责任确保游戏最终推出，但事实上也存在各种不确定性，巨大的机会与风险并存。若以游戏利润分配权NFT卡（限区块链服务器）的方式参与《元灵大陆》，是机会亦有风险。

MetaSoft 元软联合创办人目前合计共持有75%《元灵大陆》游戏相关所有权权益，MetaSoft 元软子属游戏团队持有25%的游戏相关所有权权益。

元软售卖《元灵大陆》游戏（限区块链服务器）4%的利润分配权，总计400张NFT卡。一经售出，元软会确保元软联合创办人所持有的《元灵大陆》游戏相关所有权权益中的最少4%是固定锁仓由元软联合创办人所持有，不会转让至非元软联合创办人所控制的实体上。

本次所售卖的4% 游戏利润分配权【限区块链服务器】的权益，与其他已出售 （已被内部认购）的NFT卡利润分配权具有同等权益，此NFT卡与未出售、未上链成为NFT卡的餘下游戏相关所有权权益是不等同的，所有未出售、未上链成为NFT卡的餘下游戏相关所有权权益不受以下任何条款限制。

有兴趣想购买或持有《元灵大陆》利润分配权NFT卡的朋友，在购买前，请务必认真仔细阅读以下条款及注意事项（以下文中NFT即指《元灵大陆》利润分配权NFT卡，游戏即指《元灵大陆》游戏）

持有NFT者或购买NFT者，等同于表示理解和接受本文所有条款内容和声明。

1. 关于此NFT卡所代表的利润
每张NFT卡仅代表0.01%《元灵大陆》游戏（限区块链服务器）的利润分配权。并不代表有任何其他游戏相关所有权权益，及日后也没有任何游戏政策、营运方向等等一切的投票决策权利。

NFT卡的利润分配权，这里代表该月或该季扣除运营成本后的利润，通过NFT卡发放的利润。

（1）元软不会对持有低于15%利润分配权的NFT卡持有者，或实体公布游戏运营的一切财务状况。建议有兴趣大量收购《元灵大陆》利润分配权NFT卡的实体，直接与元软联络，谨慎考虑风险后才进行相关的收购活动。

（2）游戏【现实服务器】及游戏外围的一切利润如广告、动画等等如何分配给NFT 卡持有者，目前存在操作困难及潜在的政策风险，因此，《元灵大陆》游戏一切 【现实服相关服务器】及游戏外围的一切利润，如跨链服务费、广告、动画、公仔等等，是不包括在此NFT卡权益内的。

（3）元软不保证会发放任何【非区块链服务器】相关的游戏利润，如跨链服务费、广告、动画 、现实服服务器所产生的利润给 NFT卡持有者。

（4）元软会将非【非区块链服务器】的游戏相关利润，如：《元灵大陆》游戏 【现实服务器】及游戏外围的一切利润如广告、动画、公仔等部分用作慈善或《元灵大陆》游戏的后续游戏开发用途。

2. 关于NFT卡价格
每张NFT卡售价大约160USDT。目前，由于NOS没有收取USDT功能，所以MetaSoft 元软收取等值FT（BSV）。

3. 关于市场价格波动 
NFT卡在售卖期间及一经售出，因市场价格波动所产生的FT（BSV）上下浮动，MetaSoft 元软不会退还多收取的FT（BSV），亦不会索取损失的FT（BSV）。MetaSoft 元软在NFT卡售出后所收取的FT（BSV），会立即转换成USDT ，以供游戏运营使用。

4. 关于NFT卡利润的发放时间
NFT卡利润发放时间，初定每月或每季发放利润， MetaSoft 元软会根据实际运营情况再做调整利润发放时间。

MetaSoft 元软不保证游戏每月或每季皆有利润，甚至可能长期是亏损， 在没有利润的情况下当月或当季不会发放利润。

5. 关于NFT卡利润的发放方式
USDT、BSV或元灵币任意同等价值的载体，每次可能会有所不同。元软保留发放何种利润载体的最终决定权。

6. 关于游戏上线时间
预期上线时间：2022年2~3月。若遇市场变化（如熊市来临），MetaSoft 元软会根据实际情况提前或推迟上线。

7. 关于NFT卡未来的利润和亏损，及购买资格
请谨慎三思， 注意投资风险。

MetaSoft 元软不会为购买《元灵大陆》利润分配权NFT卡导致的任何亏损或价值归零而负责。仅请能为自己的投资负责的朋友购买。

持有此NFT卡不代表每月或每季皆有利润，如果扣除运营成本后当月或当季没有利润发放，会使朋友您感到有任何不适或会出现被骗的感觉，请不要购买《元灵大陆》 的游戏利润分配权NFT，谢谢！

假若购买此NFT卡最终有可能使您亏损，或价值归零，又或是任何亏损，价值归零都会使朋友您感到有任何不适，或会感到被骗，请不要购买 《元灵大陆》的游戏利润分配权NFT卡， 谢谢！

8. 关于NFT卡的存放
利润分配权NFT卡仅支持MetaID（BSV链）身份认证技术的BSV钱包中互相传送及保存。元软不负责任何将 NFT卡寄往不支持 MetaID 身份认证技术的BSV钱包所导致的损失。寄往非MetaID身份认证技术的钱包存在NFT卡的遗失风险，元软不会负责为持卡者取回NFT卡，亦不会为此作出任何赔偿，请谨慎存放利润分配权NFT卡。

9. 因不可抗力，关于游戏暂停或停止运营
因遇任何不可抗力的因素（自然灾害、政策变化、长期亏损等）导致游戏无法继续营运，MetaSoft 元软对游戏调整方向、暂停或停止继续运营保留一切最终决定权，不会因调整、暂停或停止游戏的运营对购买或持有NFT卡者作出任何赔偿。

最后特别声明：
MetaSoft 元软有责任确保游戏最终会推出，但不确保游戏最终的利润， MetaSoft 元软不负责保证游戏有利润。

开荒项目都是高风险，没人能保证成功，各项曾发布的内容皆存在不确定性。

《元灵大陆》是开荒项目，曾发布的内容，也存在不确定性。不会对MetaSoft 元软官网，微信公众号，创办人，或MetaSoft元软一切相关人员曾发表的《元灵大陆》相关游戏内容负责。

不认同、不理解、不支持、不明白或不接受以上任何一项条款的朋友，请不要购买及请不要持有《元灵大陆》的游戏利润权NFT，谢谢！

购买或未来持有此NFT利润卡者即表示认可以上条款，不得异议。

本免责声明有翻译英文版本如下。如中、英文版本有任何抵触或歧异，应以中文版本为准。
当你使用 或持有此NFT卡时，即表示同意无条件接受本免责声明的条款及其任何变更。 MetaSoft会不时修改及／或修订有关条款，而无须事先通知。

MetaSoft 元软【即：元软软件（澳门）有限公司】保留对本文所有条款及声明的最终解释权。

------------------------------------------------------------------------------

The "MetaElf Land" game is MetaSoft's first pioneering project. Although MetaSoft is responsible for ensuring the final launch of the game, there are, in fact, also various uncertainties, meaning that huge opportunities and risks coexist. Participating in "MetaElf Land" with the NFT card of game profit distribution rights [limited to blockchain server] is an opportunity and risk.

The co-founders of MetaSoft currently hold a total of 75% of the game-related ownership rights of "MetaElf Land", and the game team of MetaSoft holds the remaining 25%.

MetaSoft sell the 4% profit distribution rights of the "MetaElf Land" game [limited to blockchain server]. Once sold, MetaSoft will ensure that at least 4% of the ["MetaElf Land"] game-related ownership rights originally held by the co-founders of MetaSoft are still held by them and will not be transferred to [Non- MetaSoft co-founder or entity not  controlled by MetaSoft co-founder.

The 4% of the game profit distribution rights sold this time [limited to blockchain server] is equivalent to other sold (internally subscribed) NFT card profit distribution rights, but it is clearly different from the remaining game-related ownership rights and interests that are [unsold] and have not been chained to become NFT cards. All ownership rights and interests that are [unsold] and have not been chained to become NFT cards are not subject to any of the following clauses.

Friends who are interested in buying or holding the NFT card of "MetaElf Land" profit distribution rights, please be sure to carefully read the following terms and precautions before purchasing. (The NFT in the following text refers to the "MetaElf Land" profit distribution NFT card, and the game refers to the "MetaElf Land" game.)

Holders of NFTs or purchasers of NFTs indicate that they understand and accept the above content and all the following terms and statements.

1. About the profit represented by this NFT card
Each NFT card only represents 0.01% of the profit distribution rights of "MetaElf Land" Game [limited to Blockchain Servers]. Holding NFT card does not mean that there are any other game-related ownership rights, and there will be no voting rights for any game policy, operation direction, etc. in the future.

The profit distribution right of the NFT card, here represents the profit after deducting the operating cost of the month or the quarter, and issued through the NFT card.

（1）MetaSoft will not disclose all the financial status of game operations to NFT card holders or entities holding less than 15% profit distribution rights. It is recommended that entities, that are interested in large-scale acquisition of "MetaElf Land" profit distribution rights NFT cards, directly contact MetaSoft and carefully consider risks before proceeding with relevant acquisition activities.

（2）Currently, there are operational difficulties and potential policy risks about how the game [Reality Server] and all the profits around the game, such as advertisements, animations, etc., are distributed to NFT card holders. Therefore, everything about "MetaElf Land" Game [Reality Related Server] and all profits surrounding the game, such as cross-chain service fees, advertisements, animations, dolls, etc., are not included in the NFT card rights.

（3）MetaSoft does not guarantee that any [non-blockchain server] related game profits such as cross-chain service fees, advertisements, animations, and profits generated by real server servers will be distributed to NFT card holders.

（4）MetaSoft will use non-[blockchain server] game-related profits, such as MetaSoft MetaElf game [reality server] and all profits around the game such as advertising, animation, dolls, etc., for charity purpose or the follow-up game development purpose of "MetaElf Land" Game.

2. About NFT card price
Each NFT card sells for approximately 160 USDT. Currently, because NOS does not have the function of charging USDT, MetaSoft charges equivalent FT (BSV).

3. About market price fluctuations
Once the NFT card is sold during the sale period, if the FT (BSV) fluctuates due to market price fluctuations, MetaSoft will not refund the overcharged FT (BSV), nor will it claim the lost FT (BSV). The FT (BSV) collected by MetaSoft after the NFT card is sold will immediately be converted into USDT for use in game operations.

4. About the issuance time of NFT card profit
The profit distribution time of NFT card is initially set monthly or quarterly, and MetaSoft will adjust the profit distribution time according to actual operating conditions.

MetaSoft does not guarantee that the game will have profit every month or quarter, and may even bear a long-term loss. If there is no profit, no profit will be issued in the current month or quarter.

5. About the method of issuance of NFT card profits
Any carrier of the same value of USDT, BSV or ’’MetaElf’’ Coin (FT) may be different each time. MetaSoft reserves the right to make the final decision on which profit carrier to issue.

6. About the launch time of the game
Expected launch time: February to March 2022. In case of market changes (such as the advent of a bear market), MetaSoft will advance or postpone the launch according to the actual situation.

7. About future profits and losses of NFT cards, and eligibility for purchase
Please think twice and pay attention to investment risks.

MetaSoft will not be responsible for any loss or zero value incurred by purchasing the NFT card of "MetaElf Land" profit distribution rights. Please only buy this NFT card when you can be responsible for your investment.

Holding this NFT card does not mean that there are monthly or quarterly profits. If there is no profit distribution in the any month or quarter after deducting the operating costs, and if it will make you feel any discomfort or feel cheated, please do not buy or hold this NFT card, thank you!

If buying this NFT card may eventually cause you to lose money or get zero value, and if it will make you feel any discomfort or feel cheated, please do not buy this NFT card, thank you!

8.  NFT card storage important remark 
The profit distribution right NFT card (SV chain) can only be used for mutual transfer and storage in SV wallets that support Metaid ID authentication technology. MetaSoft will not be responsible for any loss caused by sending NFT cards to SV wallets that do not support Metaid authentication technology. 

There is a risk of NFT card loss in wallets sent to non-METAID authentication technology wallet. MetaSoft will not be responsible for retrieving the NFT card for cardholders, and will not make any compensation for this. Please handle profit distribution rights NFT cards with caution.

9. About the suspension or suspension of operations of the game due to force majeure

If the game cannot continue to operate due to any force majeure factors (natural disasters, policy changes, long-term losses, etc.), MetaSoft reserves the right to make the final decision on the game's adjustment, suspension or cessation of operation, and will not make any compensation to those who purchase or hold NFT cards if the operation of the game is adjusted, suspended or stopped.

Final special statement:
It is MetaSoft's responsibility to ensure that the game will be released, but not that the game will be profitable. MetaSoft is not responsible for ensuring that the game will be profitable.

New projects are high-risk, and no one can guarantee success. There are uncertainties in all previously published content.

"MetaElf Land" is a newly developed project, and the content that has been released is also uncertain. MetaSoft will not be responsible for the game content related to the official website, WeChat official account, founder, or all related personnel of MetaSoft.

Friends who disagree, do not understand, support, or accept any of the above terms, please do not purchase or hold this profit distribution right’s NFT of the game, thank you!

Those who purchase or hold this NFT profit distribution rights in the future will signify their approval of all the above terms and shall not object.

All disclaimer above has been translated into English. If there is any inconsistency or ambiguity between the English version and the Chinese version, the Chinese version shall prevail.
By holding this NFT card, you agree to accept unconditionally the terms of this Disclaimer and as they may be revised and/or amended from time to time by MetaSoft without prior notice to you.

MetaSoft [namely: Metasoft Software (Macau) Ltd.] reserves the right of final interpretation of all the above terms and statements.
`

export default function NFTDetail(genesis: string, codehash: string, tokenIndex: string) {
  return new Promise<NftItemDetail>(async (resolve, reject) => {
    const res = await NFTApiGetNFTDetail({
      genesis,
      codehash,
      tokenIndex,
    }).catch(() => reject())
    if (res?.code === 0) {
      if (res.data.results.items.length > 0) {
        const item = res.data.results.items[0]
        const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : ''
        const classify = setDataStrclassify(data)
        const nft: NftItemDetail = {
          ...item,
          foundryName: item.nftIssuer,
          foundryMetaId: item.nftIssueMetaId,
          foundryHead: '',
          amount: item.nftPrice ? item.nftPrice : 0,
          remainingTime: null,
          nftName: item.nftName ? item.nftName : '--',
          classify: classify,
          // 针对某个系列特殊处理
          describe:
            item.nftCodehash === '0d0fc08db6e27dc0263b594d6b203f55fb5282e2' &&
            item.nftGenesis === '86038be3cbbfc06aa0dad546e5fea2d165945853'
              ? elfDrsc
              : item.nftDesc,
          forgeTime: item.nftTimestamp,
          contractAddress: item.nftSensibleId,
          tokenId: item.nftTokenId,
          ownerName: item.nftOwnerName,
          ownerMetaId: item.nftOwnerMetaId,
          ownerHead: '',
          ownerAddress: item.nftOwnerAddress,
          type: data ? data.nftType : '',
          revenue: '',
          coverUrl: item.nftIcon,
          tx: data ? data.contentTxId : '',
          putAway: item.nftIsReady,
          codeHash: item.nftCodehash,
          genesis: item.nftGenesis,
          tokenIndex: item.nftTokenIndex,
          genesisTxId: item.nftGenesisTxId,
          sellTxId: item.nftSellTxId,
          sensibleId: item.nftSensibleId,
          sellContractTxId: item.nftSellContractTxId,
          sellDesc: item.nftSellDesc,
          issueMetaTxId: item.nftIssueMetaTxId,
          sellState: item.nftSellState,
          ownerAvatarType: item.nftOwnerAvatarType,
          issueUserAvatarType: item.nftIssueAvatarType,
          nftGenesisCertificationType: item.nftGenesisCertificationType,
          nftCertificationType: item.nftCertificationType,
          nftGenesisCertificationName: item.nftGenesisCertificationName,
          nftWebsite: item.nftWebsite,
          nftCurrentAuctionCreateTxId: item.nftCurrentAuctionCreateTxId,
        }
        resolve(nft)
      } else {
        reject()
      }
    }
  })
}
