export default [
  {
    inputs: [{ internalType: 'address', name: 'router_', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: false, internalType: 'string', name: 'code', type: 'string' },
    ],
    name: 'RegisterCode',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newAccount', type: 'address' },
      { indexed: false, internalType: 'string', name: 'code', type: 'string' },
    ],
    name: 'SetCodeOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'referrer', type: 'address' },
      { indexed: false, internalType: 'uint8', name: 'tierId', type: 'uint8' },
    ],
    name: 'UpdateReferrerTier',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: false, internalType: 'string', name: 'code', type: 'string' },
    ],
    name: 'UpdateTraderReferralCode',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'UserReferralData',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tradeVolume', type: 'uint256' },
          { internalType: 'uint256', name: 'rebate', type: 'uint256' },
          { internalType: 'uint256', name: 'trades', type: 'uint256' },
        ],
        internalType: 'struct IReferralStorage.ReferrerData',
        name: 'referrerData',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'uint256', name: 'tradeVolume', type: 'uint256' },
          { internalType: 'uint256', name: 'rebate', type: 'uint256' },
        ],
        internalType: 'struct IReferralStorage.ReferreeData',
        name: 'referreeData',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '', type: 'string' }],
    name: 'codeOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8[3]', name: '_referrerTierStep', type: 'uint8[3]' },
      { internalType: 'uint32[3]', name: '_referrerTierDiscount', type: 'uint32[3]' },
    ],
    name: 'configure',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getTraderReferralInfo',
    outputs: [
      { internalType: 'string', name: 'code', type: 'string' },
      { internalType: 'address', name: 'referrer', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'operators',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'referrerTier',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    name: 'referrerTierDiscount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    name: 'referrerTierStep',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_code', type: 'string' }],
    name: 'registerCode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'router',
    outputs: [{ internalType: 'contract IBufferRouter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'state', type: 'bool' },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_referrer', type: 'address' },
      { internalType: 'uint8', name: 'tier', type: 'uint8' },
    ],
    name: 'setReferrerTier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'router_', type: 'address' }],
    name: 'setRouter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'string', name: '_code', type: 'string' },
    ],
    name: 'setTraderReferralCode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_code', type: 'string' }],
    name: 'setTraderReferralCodeByUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    name: 'tiers',
    outputs: [
      { internalType: 'uint256', name: 'totalRebate', type: 'uint256' },
      { internalType: 'uint256', name: 'discountShare', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'traderReferralCodes',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userCode',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
