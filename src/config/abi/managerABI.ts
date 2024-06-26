export default [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'rarity', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'floor', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'maticPrice', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'nvsPrice', type: 'uint256' },
    ],
    name: 'LandMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'floor', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'richness', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
    ],
    name: 'LandUpgrade',
    type: 'event',
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
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'Reset',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'level', type: 'uint256' },
    ],
    name: 'UpLevel',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: 'logic_', type: 'address' }],
    name: 'addGameLogic',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'autoMint', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'checkAutoMint',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'landId', type: 'uint256' }],
    name: 'checkEnoughPrice',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cost',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'newRichness', type: 'uint256' },
    ],
    name: 'enrich',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'exceedBal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'game',
    outputs: [{ internalType: 'contract IGame', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'gameLogic',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getInventory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSupport',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'increTax',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'infos',
    outputs: [
      { internalType: 'uint16', name: 'rarityType', type: 'uint16' },
      { internalType: 'uint16', name: 'floor', type: 'uint16' },
      { internalType: 'uint16', name: 'level', type: 'uint16' },
      { internalType: 'uint16', name: 'richness', type: 'uint16' },
      { internalType: 'uint64', name: 'currentNumber', type: 'uint64' },
      { internalType: 'uint64', name: 'resourceDeposit', type: 'uint64' },
      { internalType: 'uint32', name: 'isPaid', type: 'uint32' },
      { internalType: 'uint32', name: 'numEmty', type: 'uint32' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'essenceToken', type: 'uint256' },
      { internalType: 'uint256', name: 'removeToken', type: 'uint256' },
      { internalType: 'uint256', name: 'overTax', type: 'uint256' },
      { internalType: 'bool', name: 'isGameOver', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token_', type: 'address' },
      { internalType: 'address', name: 'nvs_', type: 'address' },
      { internalType: 'address', name: 'verifier_', type: 'address' },
      { internalType: 'address', name: 'land_', type: 'address' },
      { internalType: 'address', name: 'treasury_', type: 'address' },
      { internalType: 'uint256', name: 'cost_', type: 'uint256' },
      { internalType: 'uint256', name: 'nvsCost_', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'inventory',
    outputs: [{ internalType: 'contract IInventory', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isAutoMinted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'isUsed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'land',
    outputs: [{ internalType: 'contract ILand', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'landInfos',
    outputs: [
      {
        components: [
          { internalType: 'uint16', name: 'rarityType', type: 'uint16' },
          { internalType: 'uint16', name: 'floor', type: 'uint16' },
          { internalType: 'uint16', name: 'level', type: 'uint16' },
          { internalType: 'uint16', name: 'richness', type: 'uint16' },
          { internalType: 'uint64', name: 'currentNumber', type: 'uint64' },
          { internalType: 'uint64', name: 'resourceDeposit', type: 'uint64' },
          { internalType: 'uint32', name: 'isPaid', type: 'uint32' },
          { internalType: 'uint32', name: 'numEmty', type: 'uint32' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
          { internalType: 'uint256', name: 'essenceToken', type: 'uint256' },
          { internalType: 'uint256', name: 'removeToken', type: 'uint256' },
          { internalType: 'uint256', name: 'overTax', type: 'uint256' },
          { internalType: 'bool', name: 'isGameOver', type: 'bool' },
        ],
        internalType: 'struct ILandManager.LandInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'limitTax',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'randomNumber', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'mintLand',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'nextNumber',
    outputs: [{ internalType: 'bool', name: 'isReset', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nvs',
    outputs: [{ internalType: 'contract IERC20Upgradeable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nvsCost',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'operator',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
  { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'address', name: 'player', type: 'address' },
    ],
    name: 'payTax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'uint256', name: 'cost_', type: 'uint256' },
      { internalType: 'uint256', name: 'nvsCost_', type: 'uint256' },
    ],
    name: 'setCost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'curr', type: 'uint256' }],
    name: 'setCurrentId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'balance_', type: 'uint256' }],
    name: 'setDefaultBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'game_', type: 'address' }],
    name: 'setGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address[]', name: 'logic_', type: 'address[]' }],
    name: 'setGameLogic',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'inventory_', type: 'address' }],
    name: 'setInventory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'landId', type: 'uint256' },
      { internalType: 'uint16', name: 'level', type: 'uint16' },
      { internalType: 'uint256', name: 'bal', type: 'uint256' },
      { internalType: 'uint64', name: 'curr', type: 'uint64' },
      { internalType: 'uint16', name: 'richness', type: 'uint16' },
    ],
    name: 'setLevel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator_', type: 'address' },
      { internalType: 'bool', name: 'state', type: 'bool' },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'increTax_', type: 'uint256' },
      { internalType: 'uint256', name: 'limitTax_', type: 'uint256' },
    ],
    name: 'setOverTax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'stash_', type: 'address' }],
    name: 'setStash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'support_', type: 'address' }],
    name: 'setSupport',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stash',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'support',
    outputs: [{ internalType: 'contract ISupport', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IERC20Upgradeable', name: '', type: 'address' }],
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
    inputs: [],
    name: 'treasury',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bool', name: 'incre', type: 'bool' },
    ],
    name: 'updateBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bool', name: 'incre', type: 'bool' },
    ],
    name: 'updateEssenceToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'landId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'updateNumEmpty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'landId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'updateRemoveToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'landId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'updateResourceDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'upgradeFloor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'verifier',
    outputs: [{ internalType: 'contract ISignatureVerifier', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;
