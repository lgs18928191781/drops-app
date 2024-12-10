import { Network } from '@/stores/network'
import {type EntitySchema} from '@metaid/metaid'

// Sighash types
export const SIGHASH_DEFAULT = 0x00
export const SIGHASH_ALL = 0x01
export const SIGHASH_NONE = 0x02
export const SIGHASH_SINGLE = 0x03
export const SIGHASH_ANYONECANPAY = 0x80
export const SIGHASH_SINGLE_ANYONECANPAY = 0x83
export const SIGHASH_NONE_ANYONECANPAY = 0x82
export const SIGHASH_ALL_ANYONECANPAY = 0x81

export const RELEASE_PAYLOAD_SIZE = 391
export const RELEASE_TX_SIZE = RELEASE_PAYLOAD_SIZE + 68 + 31
export const RECOVER_TX_SIZE = 363
export const BUY_TX_SIZE = 500
export const SELL_TX_SIZE = 673
export const BID_TX_SIZE = 111 + 154 // pay + grant
export const SEND_TX_SIZE = 140
export const SWAP_TX_SIZE = 298
export const SWAP_2X_TX_SIZE = 212 + 240 // 3 inputs
export const RUNES_SWAP_2X_TX_SIZE = 260 + 280 // 3 inputs
export const SWAP_POOL_ADD_TX_SIZE = 255
export const INSCRIBE_TX_SIZE_FACTOR = 380
export const TX_BASE_SIZE = 300

export const DUMMY_UTXO_VALUE = 600
export const DUMMY_UTXO_OUTPUT_VALUE = 1200
export const DUST_UTXO_VALUE = 546
export const PIN_UTXO_VALUE=546
export const MS_BRC20_UTXO_VALUE = 1000
export const ONE_SERVICE_FEE = 10_000
export const SELL_SERVICE_FEE = 16_000
export const EXTRA_INPUT_MIN_VALUE = 600
export const DUMMY_UTXO_INPUT_LEGACY=1001
export const DUMMY_UTXO_OUTPUT_LEGACY=2002
export const NETWORK: Network = import.meta.env.VITE_NETWORK || 'mainnet'
export const PlatformRate=6
export const MinPlatformFee=2000
export const MinRoyaltyFee=1000
export const REDEEM_SERVICE_FEE=1000
export const CONVERT_SERVICE_FEE=1000
export const MRC721PlatformAddress=import.meta.env.VITE_MRC721_PLATFORM_ADDRESS


export const whiteListMvcGenesisMapCollectionpinid=[
  {
    genesis:'529cf41a72a1b61fe9c2fb91e7bc05616f9b769c',
    collectionPinid:'',
  },
  // {
  //   genesis:'84e74476d9490c1483baa5463742868950505aab',
  //   collectionPinid:'3c5a2c8437908f45e4c942d42546b7d17f2d34e9622462cb3a93d5e5e1f2641fi0',
  // },
  {
    genesis:'1897212dadf3c734b9a19c4430f3fbf0cdc07aa4',
    collectionPinid:'be7caa5bf95d88aa9cc1778abf7a2b67318c3a468cfa01ec7f8f2b463c13ca27i0',
  }

  //   {
  //   genesis:'92cbffdd55ae32b4bd68e8a3394815c22c98e2b6',
  //   collectionPinid:'3c6c58d7d11a0fc6a8f26a257bd577501b33477e46a14c1bac4d16dfc13e06a8i0',
  // },

]

export const whiteListConverCollection=[
  // {
  //   genesis:`92cbffdd55ae32b4bd68e8a3394815c22c98e2b6`,
  //    codehash:'e205939ad9956673ce7da9fbd40514b30f66dc35'
  // }
  {
    genesis:'529cf41a72a1b61fe9c2fb91e7bc05616f9b769c',
    codehash:'e205939ad9956673ce7da9fbd40514b30f66dc35',
  },
  // {
  //   genesis:'84e74476d9490c1483baa5463742868950505aab',
  //   codehash:'e205939ad9956673ce7da9fbd40514b30f66dc35',
  // },
  {
    genesis:'1897212dadf3c734b9a19c4430f3fbf0cdc07aa4',
    codehash:'e205939ad9956673ce7da9fbd40514b30f66dc35',
  }

]

// type EntitySchema = {
//   name: string
//   path: string
//   versions: {
//     version: number
//     body: any[]
//   }[]
// }

export enum NftsLaunchPadChain{
  btc='Bitcoin',
  mvc='MicrovisionChain'
}

export enum NftsLaunchPadChainSymbol{
  btc='btc',
  mvc='mvc'
}

export enum NftOrderState{
  empty=0,
  onSale=1,
  isSaled=2,
  offSale=3,
  destory=4
}


export type CustomSchemaParams={
  nodeName:string
  isProtocolSub:boolean
  version:number
  body:Array<{
    name:string
    type:'string' | 'number' | 'array'
  }>
}

export const followSchema:EntitySchema = {
  name: 'follow',
  nodeName: 'follow',
  path:'/follow',
  versions: [
    {
      version: 1,
      id:'',
      body: [
        {
          name: 'followTo',
          type: 'string',
        },
      ],
    },
  ],
}



export const payCommentSchema:EntitySchema = {
  name: 'paycomment',
  nodeName: 'paycomment',
  path:'/protocols/paycomment',
  versions: [
    {
      version: 1,
      id:'',
      body: [
        {
          name: 'content',
          type: 'string',
        },
        {
          name: 'commentTo',
          type: 'string',
        },
        {
          name: 'replyTo',
          type: 'string',
        },
        {
          name: 'pay',
          type: 'string',
        },
        {
          name: 'payTo',
          type: 'string',
        },
      ],
    },
  ],
}


export const mintNftNameSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'collection',
    nodeName: 'collection',
    path:`/nft/mrc721/${collectionName}`,
    versions:[
      {
        version: 1,
        id:'',
        body:[
          
        ]
      }
    ]
  }
}

export const mintNftDescSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'collectionDesc',
    nodeName: 'collectionDesc',
    path:`/nft/mrc721/${collectionName}/collection_desc`,
    versions:[
      {
        version: 1,
        id:'',
        body:[
          {
            name:'name',
            type:'string'
          },
          {
            name:'totalSupply',
            type:'number'
          },
          // {
          //   name:'royaltyRate',
          //   type:'number'
          // },
          {
            name:'desc',
            type:'string'
          },
          {
            name:'website',
            type:'string'
          },
          {
            name:'cover',
            type:'string'
          },
          {
            name:'metadata',
            type:'object'
          },
        ]
      }
    ]
  }
}


export const mintNftItemSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'nftsItem',
    nodeName: 'nftsItem',
    path:`/nft/mrc721/${collectionName}`,
    versions:[
      {
        version: 1,
        id:'',
        body:[]
      }
    ]
  }
}

export const mintNftItemDescSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'nftsItemDesc',
    nodeName: 'nftsItemDesc',
    path:`/nft/mrc721/${collectionName}/item_desc`,
    versions:[
      {
        version: 1,
        id:'',
        body:[
          {
            name:'pinid',
            type:'string'
          },
          {
            name:'name',
            type:'string'
          },
          {
            name:'desc',
            type:'string'
          },
          {
            name:'cover',
            type:'string'
          },
          {
            name:'metadata',
            type:'object'
          },
        ]
      }
    ]
  }
}






export const simpleRepostSchema:EntitySchema = {
  name: 'simplebuzz',
  nodeName: 'simplebuzz',
  path:'/protocols/simplebuzz',
  versions: [
    {
      version: 1,
      id:'',
      body: [
        {
          name: 'content',
          type: 'string',
        },
        {
          name: 'quotePin',
          type: 'string',
        },
        {
          name: 'attachments',
          type: 'array',
        },
       
      ],
    },
  ],
}



export const customizeSchema=(params:CustomSchemaParams):EntitySchema=>{
  const {nodeName,isProtocolSub,version,body}=params
  return {
    name:nodeName,
    nodeName:nodeName,
    path:isProtocolSub ? `/protocols/${nodeName}` : nodeName,
    versions:[
      {
          version:version ?? 1,
          id:'',
          body:body
      }
    ]
  }
}


export enum BufferEncoding {
  ascii = 'ascii',
  utf8 = 'utf8',
  //['utf-8']='utf-8',
  utf16le = 'utf16le',
  //['utf-16le']='utf-16le',
  ucs2 = 'ucs2',
  //['ucs-2']= 'ucs-2',
  base64 = 'base64',
  base64url = 'base64url',
  latin1 = 'latin1',
  binary = 'binary',
  hex = 'hex',
}

export const policy ={
  title:`Terms  Of  Service`,
  content:`Introduction

Welcome to Drops, owned and operated by Ozone Networks, Inc. d/b/a Drops (“Drops,” “we,” “us”, or “our”).
These Terms of Service (“Terms”) govern your access to and use of the Drops website(s), our APIs, mobile applications (“App”), and any live support, software, tools, features, or functionalities provided on or in connection with our services; including without limitation using our services to view, explore, help display and create NFTs, and using our tools, at your own discretion, to connect directly with others to mint, purchase, sell, or transfer NFTs on public blockchains (collectively, the “Service”).
“NFT” in these Terms means a non-fungible token or similar digital item implemented on a blockchain (such as the Ethereum blockchain), which uses smart contracts to link to or otherwise be associated with certain content or data.
For purposes of these Terms, “user”, “you”, and “your” mean you as the user of the Service.
If you use the Service on behalf of a company or other entity then “you” includes you and that entity, and you represent and warrant that (a) you are an authorized representative of the entity with the authority to bind the entity to these Terms, and (b) you agree to these Terms on the entity’s behalf.

PLEASE READ THESE TERMS OF SERVICE CAREFULLY AS THEY CONTAIN IMPORTANT INFORMATION AND AFFECT YOUR LEGAL RIGHTS.
AS OUTLINED IN SECTION 16 BELOW, THEY INCLUDE A MANDATORY ARBITRATION AGREEMENT AND CLASS ACTION WAIVER WHICH (WITH LIMITED EXCEPTIONS) REQUIRE ANY DISPUTES BETWEEN US TO BE RESOLVED THROUGH INDIVIDUAL ARBITRATION RATHER THAN BY A JUDGE OR JURY IN COURT.
BY CLICKING TO ACCEPT, SIGN, AND/OR USING OUR SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS AND ALL OF THE TERMS INCORPORATED HEREIN BY REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICE.

Drops is not a wallet provider, exchange, broker, dealer, financial institution, payments processor, money services business, or creditor.
Drops provides a peer-to-peer web3 service that helps users discover and directly interact with each other and NFTs available on public blockchains.
We do not have custody or control over the NFTs or blockchains you are interacting with and we do not execute or effectuate purchases, transfers, or sales of NFTs. To use our Service, you must use a third-party wallet which allows you to engage in transactions on blockchains.
Drops is not party to any agreement between any users.
You bear full responsibility for verifying the identity, legitimacy, and authenticity of NFTs that you purchase from third-party sellers using the Service and we make no claims, guarantees, or recommendations about the identity, legitimacy, functionality, or authenticity of users or NFTs (and any content associated with such NFTs) visible on the Service.

Accessing the Service

Like much of web3, your blockchain address functions as your identity on Drops. Accordingly, you will need a blockchain address and a third-party wallet to access the Service.
Your account on the Service (“Account”) will be associated with your blockchain address; however, if you want to add some flair to your Drops persona, you can add additional information, such as a profile picture, to your Account.
Your Account on Drops will be associated with your linked blockchain address and display the NFTs for that blockchain address (and, if applicable, any content associated with such NFTs).
By using your wallet in connection with the Service, you agree that you are using that wallet under the terms and conditions of the applicable provider of the wallet.
Wallets are not operated by, maintained by, or affiliated with Drops, and Drops does not have custody or control over the contents of your wallet and has no ability to retrieve or transfer its contents.
Drops accepts no responsibility for, or liability to you, in connection with your use of a wallet and makes no representations or warranties regarding how the Service will operate with any specific wallet.
You are solely responsible for keeping your wallet secure and you should never share your wallet credentials or seed phrase with anyone. If you discover an issue related to your wallet, please contact your wallet provider.
Likewise, you are solely responsible for your Account and any associated wallet and we are not liable for any acts or omissions by you in connection with your Account or as a result of your Account or wallet being compromised.
You also represent and warrant that you will comply with all applicable laws (e.g., local, state, federal and other laws)in connection with using the Service.
In order to comply with our legal obligations and keep our users and platform safe, we may need to restrict, suspend, or terminate your access to the Service.
You acknowledge that Drops is under no obligation to disclose the details of its decision to take such action with you.
Without limiting the foregoing, by using the Service, you represent and warrant that: (a) you are not located in, ordinarily resident in, or organized under the laws of any jurisdiction that is subject to a comprehensive U.S. Government embargo ("Embargoed Jurisdiction"); (b) you are not subject to any sanctions administered by an agency of the U.S. Government, any other government, or the United Nations (collectively, “Sanctions”); (c) you are not owned or controlled, directly or indirectly, by any person that is subject to Sanctions, or that is located in, ordinarily resident in, or organized under the laws of, any Embargoed Jurisdiction; (d) none of your officers, managers, directors, shareholders or authorized representatives is subject to Sanctions, or is located in, ordinarily resident in, or organized under the laws of, any Embargoed Jurisdiction, or is owned or controlled, directly or indirectly, by any person that is subject to Sanctions or that is located in, ordinarily resident in, or organized under the laws of, any Embargoed Jurisdiction; (e) you have not transacted and will not transact with any person or entity falling into any of (a)-(d); (f) you have not transacted and will not transact for the benefit of any person or entity falling into any of (a)-(d).
You further covenant that the foregoing shall be true during the entire period of this agreement.
If you access or use the Service outside the United States, you are solely responsible for ensuring that your access and use of the Service in such country, territory or jurisdiction does not violate any applicable laws.
Drops may require you to provide additional information and documents in certain circumstances, such as at the request of any government authority, as any applicable law or regulation dictates, to provide you with a requested service, or to investigate a potential violation of these Terms. In such cases, Drops, in its sole discretion, may disable your Account and block your ability to access the Service until such additional information and documents are processed by Drops.
If you do not provide complete and accurate information in response to such a request, Drops may refuse to restore your access to the Service.
Your access and use of the Service may be interrupted from time to time for any of several reasons, including, without limitation, the malfunction of equipment, periodic updating, maintenance, or repair of the Service, geographic restrictions, potential violation of these Terms, or other actions that Drops, in its sole discretion, may elect to take.
You understand that Drops, in its sole discretion, may disable your Account and/or reassign your username or associated url.
We require all users to be at least 18 years old. If you are at least 13 years old but under 18 years old, you may only use Drops through a parent or guardian’s Account and with their approval and oversight. That account holder is responsible for your actions using the Account.
It is prohibited to use our Service if you are under 13 years old.

Intellectual Property Rights

You are solely responsible for your use of the Service and for any information you provide, including compliance with applicable laws, rules, and regulations, as well as these Terms, including the User Conduct requirements outlined above.
By using the Service in conjunction with creating, submitting, posting, promoting, or displaying content, or by complying with Drops’s metadata standards in your metadata API responses, you grant us a worldwide, non-exclusive, sublicensable, royalty-free license to use, copy, modify, and display any content, including but not limited to text, materials, images, files, communications, comments, feedback, suggestions, ideas, concepts, questions, data, or otherwise, that you submit or post on or through the Service for our current and future business purposes, including to provide, promote, and improve the Service.
This includes any digital file, art, or other material linked to or associated with any NFTs that are displayed on the Service.
Drops does not claim that submitting, posting, or displaying this content on or through the Service gives Drops any ownership of the content. We're not saying we own it. We're just saying we might use it and show it off a bit.
You represent and warrant that you have, or have obtained, all rights, licenses, consents, permissions, power and/or authority necessary to grant the rights granted herein for any content that you create, submit, post, promote, or display on or through the Service.
You are solely responsible for the content and metadata associated with NFTs and digital items you create.
You represent and warrant that such content does not contain material subject to copyright, trademark, publicity rights, or other intellectual property rights, unless you have necessary permission or are otherwise legally entitled to post the material and to grant Drops the license described above, and that the content does not violate any laws.
Drops will take down works in response to Digital Millennium Copyright Act (“DMCA”) takedown notices and/or other intellectual property infringement claims and will terminate a user's access to the Service if the user is determined to be a repeat infringer.
For us to process your infringement claim regarding content on the Service, you must be the rightsholder or someone authorized to act on behalf of the rightsholder.
Identification of the copyrighted work(s), trademark, publicity rights, or other intellectual property rights that you claim is being infringed;
Identification of the allegedly infringing material that is requested to be removed, including a description of the specific location (i.e., urls) on the Service of the material claimed to be infringing, so that we may locate the material;
Your contact information – at a minimum, your full legal name (not pseudonym) and email address;
A declaration that contains all of the following:
A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the intellectual property rights owner, its agent, or the law;
A statement that the information in the notice is accurate; and
A statement under penalty of perjury that you are authorized to act on behalf of the intellectual property owner of the intellectual property that is allegedly being infringed.
Your physical or electronic signature (of your full legal name).
Please note that we will forward your notice of intellectual property infringement, including your contact information, to the party who will have their content removed so they understand why it is no longer available on Drops and can also contact you to resolve any dispute.

Communication Preferences

YBy creating an Account, you consent to receive electronic communications from Drops (e.g., via email, push notification, text messages, or other types of messages).
These communications may include notices about your Account (e.g., transactional information) and are part of your relationship with us. We may also send you promotional communications via email we think will be of interest to you.
You understand that you are not required to provide this consent as a condition of using the Service and you may opt out of these communications through the Service or through your mobile device’s operating system (with the possible exception of important service announcements and administrative messages) by following the unsubscribe instructions provided or through your Account settings.

App Terms

You are responsible for providing the mobile device, wireless service plan, software, Internet connections, and/or other equipment or services that you need to download, install, and use the App.
We do not guarantee that the App can be accessed and used on any particular device or with any particular service plan. We do not guarantee that the App or Service will be available in any particular geographic location.
The following terms and conditions apply to you only if you are using the App from the Apple App Store: To the extent the other terms and conditions of these Terms are less restrictive than, or otherwise conflict with, the terms and conditions of this paragraph, the more restrictive or conflicting terms and conditions in this paragraph apply, but solely with respect to your use of the App from the Apple App Store.
You acknowledge and agree that these Terms are solely between you and Drops, not Apple, and that Apple has no responsibility for the App or content thereof. Your use of the App must comply with the App Store’s applicable terms of use.
You acknowledge that Apple has no obligation whatsoever to furnish any maintenance and support services with respect to the App.
In the event of any failure of the App to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price, if any, for the App to you.
To the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to the App, and any other claims, losses, liabilities, damages, costs or expenses attributable to any failure to conform to any warranty will be solely governed by these Terms. You acknowledge that Apple is not responsible for addressing any claims of yours or any third party relating to the App or your possession and/or use of the App, including, but not limited to: (a) product liability claims, (b) any claim that the App fails to conform to any applicable legal or regulatory requirement, and (c) claims arising under consumer protection or similar legislation.
You acknowledge that, in the event of any third-party claim that the App or your possession and use of that App infringes that third party’s intellectual property rights, Drops, not Apple, will be solely responsible for the investigation, defense, settlement and discharge of any such intellectual property infringement claim to the extent required by these Terms. You must comply with applicable third-party terms of agreement when using the App.
You acknowledge and agree that Apple, and Apple’s subsidiaries, are third-party beneficiaries of these Terms as they relate to your use of the App, and that, upon your acceptance of these Terms, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms against you as a third-party beneficiary thereof.

Indemnification

By agreeing to these Terms and accessing the Service, you agree, to the fullest extent permitted by applicable law, to indemnify, defend, and hold harmless Drops, and our respective past, present, and future employees, officers, directors, contractors, consultants, equity holders, suppliers, vendors, service providers, parent companies, subsidiaries, affiliates, agents, representatives, predecessors, successors, and assigns (individually and collectively, the “Drops Parties”), from and against all actual or alleged claims, damages, awards, judgments, losses, liabilities, obligations, taxes, penalties, interest, fees, expenses (including, without limitation, attorneys’ fees and expenses), and costs (including, without limitation, court costs, costs of settlement, and costs of pursuing indemnification and insurance), of every kind and nature whatsoever, whether known or unknown, foreseen or unforeseen, matured or unmatured, or suspected or unsuspected, in law or equity, whether in tort, contract, or otherwise (collectively, “Claims”), including, but not limited to, damages to property or personal injury, that are caused by, arise out of or are related to (a) your use or misuse of the Service, content, NFTs, or content linked to or associated with any NFTs (b) any Feedback you provide, (c) your violation or breach of any term of these Terms or applicable law, and (d) your violation of the rights of or obligations to a third party, including another user or third party, and (e) your negligence or wilful misconduct.
You agree to promptly notify Drops of any Claims and cooperate with the Drops Parties in defending such Claims. You further agree that the Drops Parties shall have control of the defense or settlement of any Claims. THIS INDEMNITY IS IN ADDITION TO, AND NOT IN LIEU OF, ANY OTHER INDEMNITIES SET FORTH IN A WRITTEN AGREEMENT BETWEEN YOU AND Drops.

Disclaimers

YOUR ACCESS TO AND USE OF THE SERVICE IS AT YOUR OWN RISK. YOU UNDERSTAND AND AGREE THAT THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS AND Drops EXPRESSLY DISCLAIMS WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED.
Drops (AND ITS SUPPLIERS) MAKE NO WARRANTY OR REPRESENTATION AND DISCLAIM ALL RESPONSIBILITY FOR WHETHER THE SERVICE: (A) WILL MEET YOUR REQUIREMENTS; (B) WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS; OR (C) WILL BE ACCURATE, RELIABLE, COMPLETE, LEGAL, OR SAFE.
Drops DISCLAIMS ALL OTHER WARRANTIES OR CONDITIONS, EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.
Drops WILL NOT BE LIABLE FOR ANY LOSS OF ANY KIND FROM ANY ACTION TAKEN OR TAKEN IN RELIANCE ON MATERIAL OR INFORMATION, CONTAINED ON THE SERVICE.
WHILE Drops ATTEMPTS TO MAKE YOUR ACCESS TO AND USE OF THE SERVICE SAFE, Drops CANNOT AND DOES NOT REPRESENT OR WARRANT THAT THE SERVICE, CONTENT, CONTENT LINKED TO OR ASSOCIATED WITH ANY NFTS, OR ANY NFTS YOU INTERACT WITH USING OUR SERVICE OR OUR SERVICE PROVIDERS’ SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
WE CANNOT GUARANTEE THE SECURITY OF ANY DATA THAT YOU DISCLOSE ONLINE. NO ADVICE OR INFORMATION, WHETHER ORAL OR OBTAINED FROM THE Drops PARTIES OR THROUGH THE SERVICE, WILL CREATE ANY WARRANTY OR REPRESENTATION NOT EXPRESSLY MADE HEREIN.
YOU ACCEPT THE INHERENT SECURITY RISKS OF PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET AND WILL NOT HOLD Drops RESPONSIBLE FOR ANY BREACH OF SECURITY.
WE WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS AND TAKE NO RESPONSIBILITY FOR, AND WILL NOT BE LIABLE TO YOU FOR, ANY USE OF OR LOSS OF USE OF NFTS, CONTENT, AND/OR CONTENT LINKED TO OR ASSOCIATED WITH NFTS, INCLUDING BUT NOT LIMITED TO ANY LOSSES, DAMAGES, OR CLAIMS ARISING FROM: (A) USER ERROR, INCORRECTLY CONSTRUCTED TRANSACTIONS, OR MISTYPED ADDRESSES; (B) SERVER FAILURE OR DATA LOSS; (C) UNAUTHORIZED ACCESS OR USE; (D) ANY UNAUTHORIZED THIRD-PARTY ACTIVITIES, INCLUDING WITHOUT LIMITATION THE USE OF VIRUSES, PHISHING, BRUTEFORCING OR OTHER MEANS OF ATTACK AGAINST THE SERVICE OR NFTS.
NFTS EXIST ONLY BY VIRTUE OF THE OWNERSHIP RECORD MAINTAINED IN THE ASSOCIATED BLOCKCHAIN (E.G., ETHEREUM NETWORK). ANY TRANSFERS OR SALES OCCUR ON THE ASSOCIATED BLOCKCHAIN (E.G., ETHEREUM).
Drops AND/OR ANY OTHER Drops PARTY CANNOT EFFECT OR OTHERWISE CONTROL THE TRANSFER OF TITLE OR RIGHT IN ANY NFTS OR UNDERLYING OR ASSOCIATED CONTENT OR ITEMS.
NO Drops PARTY IS RESPONSIBLE OR LIABLE FOR ANY SUSTAINED LOSSES OR INJURY DUE TO VULNERABILITY OR ANY KIND OF FAILURE, ABNORMAL BEHAVIOR OF SOFTWARE (E.G., WALLET, SMART CONTRACT), BLOCKCHAINS OR ANY OTHER FEATURES OF THE NFTS.
NO Drops PARTY IS RESPONSIBLE FOR LOSSES OR INJURY DUE TO LATE REPORTS BY DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES WITH THE BLOCKCHAIN SUPPORTING THE NFTS, INCLUDING FORKS, TECHNICAL NODE ISSUES OR ANY OTHER ISSUES HAVING LOSSES OR INJURY AS A RESULT.

Some jurisdictions do not allow the exclusion of implied warranties in contracts with consumers, so the above exclusion may not apply to you.

Modifications to the Service

We reserve the right in our sole discretion to modify, suspend, or discontinue, temporarily or permanently, the Service (or any features or parts thereof) at any time and without liability as a result.

Dispute Resolution; Arbitration

 Dispute Resolution. Please read the following arbitration agreement in this Section (“Arbitration Agreement”) carefully. It requires you to arbitrate disputes with Drops and limits the manner in which you can seek relief from us.
      This section does not govern disputes between users or between users and third parties. Drops does not provide dispute resolution services for such disagreements    
       and the parties must resolve those disputes directly.
 Applicability of Arbitration Agreement. You agree that any dispute, controversy, or claim relating in any way to your access or use of the Service, to any products sold or distributed through the Service, or to any aspect of your relationship with Drops, will be resolved by binding arbitration, rather than in court, including threshold questions of the arbitrability of such dispute, controversy, or claim except that (1) you or Drops may assert claims in small claims court, but only if the claims qualify, the claims remain only in such court, and the claims remain on an individual, non-representative, and non-class basis; and (2) you or Drops may seek injunctive or equitable relief in a court of proper jurisdiction if the claim relates to intellectual property infringement or other misuse of intellectual property rights.
 Dispute resolution process. You and Drops both agree to engage in good-faith efforts to resolve disputes prior to either party initiating an arbitration, small claims court proceeding, or equitable relief for intellectual property infringement.You must initiate this dispute resolution process by sending a letter describing the nature of your claim and desired resolution to: Drops, Attn: Legal Department, 228 Park Avenue South, #22014, New York, NY 10003. Both parties agree to meet and confer personally, by telephone, or by videoconference (hereinafter “Conference”) to discuss the dispute and attempt in good faith to reach a mutually beneficial outcome that avoids the expenses of arbitration or, where applicable, litigation.
       If you are represented by counsel, your counsel may participate in the Conference as well, but you agree to fully participate in the Conference.
       Likewise, if Drops is represented by counsel, its counsel may participate in the Conference as well, but Drops agrees to have a company representative fully participate      
       in the Conference.
       The statute of limitations and any filing fee deadlines shall be tolled while the parties engage in the informal dispute resolution process and Conference required by 
        this paragraph.
        If the parties do not reach agreement to resolve the dispute within thirty (30) days after initiation of this dispute resolution process, either party may commence    
        arbitration, file an action in small claims court, or file a claim for injunctive or equitable relief in a court of proper jurisdiction for matters relating to intellectual 
        property infringement, if the claims qualify.
 Arbitration Rules and Forum. The Federal Arbitration Act governs the interpretation and enforcement of this Arbitration Agreement.
       To begin an arbitration proceeding after participating in the dispute resolution process, you must send a letter requesting arbitration and describing your claim to our         
        registered agent at Drops, Attn: Legal Department, 228 Park Avenue South, #22014, New York, NY 10003. The arbitration will be conducted by JAMS, an established        
        alternative dispute resolution provider.
        Disputes involving claims and counterclaims under $250,000, not inclusive of attorneys’ fees, interest, claimed punitive or other damages, or any claim in excess of 
        the bona fide verifiable value of actual lost property shall be subject to JAMS’s most current version of the Streamlined Arbitration Rules and the JAMS Consumer 
        Minimum Standards then in effect; all other claims shall be subject to JAMS’s most current version of the Comprehensive Arbitration Rules and Procedures and the   
        JAMS Consumer Minimum Standards then in effect.
        JAMS’s rules are available at jamsadr.com or by calling JAMS at 800-352- 5267. If JAMS is not available to arbitrate, the parties will select an alternative arbitral forum.
        If the arbitrator finds that you cannot afford to pay JAMS filing, administrative, hearing, and/or other fees and cannot obtain a waiver from JAMS, Drops will pay them      
        for you if you complied with the dispute resolution process set forth above.
        In addition, Drops will reimburse all such JAMS filing, administrative, hearing, and/or other fees for claims totaling less than $10,000 unless (a) a resolution of your 
        claim results in a smaller monetary judgment than Drops may have offered you to settle the claim, at any point, or (b) the arbitrator determines the claims are frivolous 
        or you did not comply with the dispute resolution process set forth above, except that if you have initiated the arbitration claim, you will still be required to pay the 
        lesser of $250 or the maximum amount permitted under the JAMS Rules for arbitration claims initiated by you.
        You are still responsible for all additional costs that you incur in the arbitration, including without limitation, fees for attorneys or expert witnesses.
        You may choose to have the arbitration conducted by telephone or videoconference, based on written submissions, in person in your hometown area (if you live in the   
        United States), or at another mutually agreed upon location that is reasonably convenient to you.
        Any judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction.
󰐐Authority of Arbitrator. The arbitrator shall have exclusive authority to (a) determine the scope and enforceability of this Arbitration Agreement and (b) resolve any dispute related to the interpretation, applicability, enforceability, or formation of this Arbitration Agreement including, but not limited to, any claim that all or any part of this Arbitration Agreement is void or voidable.
       The arbitration will decide the rights and liabilities, if any, of you and Drops. The arbitration proceeding will not be consolidated with any other matters or joined with  
       any other cases or parties.
       The arbitrator shall have the authority to grant motions dispositive of all or part of any claim.
       The arbitrator shall have the authority to award monetary damages and to grant any non-monetary remedy or relief available to an individual under applicable law, the   
       arbitral forum’s rules, and these Terms. The arbitrator shall issue a written award and statement of decision describing the essential findings and conclusions on which  
       the award is based, including the calculation of any damages awarded.
       The arbitrator has the same authority to award relief on an individual basis that a judge in a court of law would have. The award of the arbitrator is final and binding  
       upon you and us.
 6. Waiver of Jury Trial. YOU AND Drops HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE  
       OR A JURY.
       You and Drops are instead electing that all claims and disputes shall be resolved by arbitration under this Arbitration Agreement, except as specified in the second    
       bullet of this Section 16, above (“Applicability of Arbitration Agreement”).
        An arbitrator can award on an individual basis the same damages and relief as a court and must follow these Terms as a court would. However, there is no judge or jury 
       in arbitration, and court review of an arbitration award is subject to very limited review.
󰘐Waiver of Class Actions and Class Arbitrations. ALL CLAIMS AND DISPUTES WITHIN THE SCOPE OF THIS ARBITRATION AGREEMENT MUST BE ARBITRATED ON AN INDIVIDUAL BASIS AND NOT ON A REPRESENTATIVE (INCLUDING, WITHOUT LIMITATION, PAGA) OR COLLECTIVE CLASS BASIS.
       ONLY INDIVIDUAL RELIEF IS AVAILABLE, AND CLAIMS OF MORE THAN ONE USER, PERSON, OR ENTITY CANNOT BE ARBITRATED OR CONSOLIDATED WITH THOSE OF    
       ANY OTHER USER, PERSON, OR ENTITY.
       Accordingly, under the arbitration procedures outlined in this section, an arbitrator shall not combine or consolidate more than one party’s claims without the written   
       consent of all affected parties to an arbitration proceeding.
       Without limiting the generality of the foregoing, you and Drops agree that no dispute shall proceed by way of class arbitration without the written consent of all 
        affected parties.
        If a decision is issued stating that applicable law precludes enforcement of any part of this subsection’s limitations as to a given claim for relief, then that claim must 
        be severed from the arbitration and brought in the state or federal courts located in New York County in the State of New York.
        All other claims shall be arbitrated.
󰜐Severability. Except as provided in this Section, if any part or parts of this Arbitration Agreement are found under the law to be invalid or unenforceable, then such specific part or parts shall be of no force and effect and shall be severed and the remainder of the Arbitration Agreement shall continue in full force and effect.
󰠐Survival of Agreement. This Arbitration Agreement will survive the termination of your relationship with Drops.
󰤐Modification. Notwithstanding any provision in these Terms to the contrary, we agree that if Drops makes any future material change to this Arbitration Agreement, you may reject that change within thirty (30) days of such change becoming effective by writing to Drops at the following address: Drops, Attn: Legal Department, 228 Park Avenue South, #22014, New York, NY 10003.

Governing Law and Venue

These Terms and your access to and use of the Service shall be governed by and construed and enforced in accordance with the laws of the State of New York (without regard to conflict of law rules or principles of the State of New York, or any other jurisdiction that would cause the application of the laws of any other jurisdiction).
Any dispute between the parties that is not subject to arbitration as set forth in Section 16 or cannot be heard in small claims court, shall be resolved in the state or federal courts of New York County in the State of New York, and the United States, respectively, sitting in the State of New York.

Termination

If you breach any of the provisions of these Terms, all licenses granted by Drops will terminate automatically.
Additionally, notwithstanding anything contained in these Terms, we reserve the right, with or without notice and in our sole discretion, to suspend, restrict, disable, terminate, or delete your Account and/or your ability to access or use the Service (or any part of the foregoing) at any time and for any or no reason, and you acknowledge and agree that we shall have no liability or obligation to you in such event and that you will not be entitled to a refund of any amounts that you have already paid to us.
If we terminate your Account or restrict your access or use of the Service, you retain ownership of your NFTs. You may still access your NFTs through public blockchains and other web3 wallets, platforms, and/or websites.

Severability

If any term, clause, or provision of these Terms is held invalid or unenforceable, then that term, clause, or provision will be severable from these Terms and will not affect the validity or enforceability of any remaining part of that term, clause, or provision, or any other term, clause, or provision of these Terms.

Injunctive Relief

You agree that a breach of these Terms will cause irreparable injury to Drops for which monetary damages would not be an adequate remedy and Drops shall be entitled to equitable relief in addition to any remedies it may have hereunder or at law without a bond, other security, or proof of damages.

Export Laws

You agree that you will not export or re-export, directly or indirectly, the Service, and/or other information or materials provided by Drops hereunder, to any country for which the United States or any other relevant jurisdiction requires any export license or other governmental approval at the time of export without first obtaining such license or approval.
In particular, but without limitation, the Service may not be exported or re-exported (a) into any U.S. embargoed countries or any country that has been designated by the U.S. Government as a “terrorist supporting” country, or (b) to anyone listed on any U.S. Government list of prohibited or restricted parties, including the U.S. Treasury Department’s list of Specially Designated Nationals or the U.S. Department of Commerce Denied Person’s List or Entity List. By using the Service, you represent and warrant that you are not located in any such country or on any such list. You are responsible for and hereby agree to comply at your sole expense with all applicable United States export laws and regulations.

Survival

All sections which by their nature should survive the termination of these Terms shall continue in full force and effect subsequent to and notwithstanding any termination of these Terms by Drops or you.
Termination will not limit any of Drops’s other rights or remedies at law or in equity.

Miscellaneous

These Terms (and any other applicable terms or policies incorporated by reference in these Terms) constitute the entire agreement between you and Drops relating to your access to and use of the Service.
These Terms, and any rights and licenses granted hereunder, may not be transferred or assigned by you without the prior written consent of Drops, and Drops’s failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
No waiver by either party of any breach or default hereunder shall be deemed to be a waiver of any preceding or subsequent breach or default. The section headings used herein are for reference only and shall not be read to have any legal effect.
The Service is operated by us in the United States. Those who choose to access the Service from locations outside the United States do so at their own initiative and are responsible for compliance with applicable local laws.
You and Drops agree that the United Nations Convention on Contracts for the International Sale of Goods will not apply to the interpretation or construction of these Terms.
Except as otherwise provided herein, these Terms are intended solely for the benefit of the parties and are not intended to confer third-party beneficiary rights upon any other person or entity.
`
}


