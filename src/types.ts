/**
 * Token Ledger - Institutional Digital Asset Accounting Subledger
 * Core TypeScript Definitions & Domain Models
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'SGD' | 'MYR' | 'JPY';
export type AccountingFramework = 'IFRS' | 'US_GAAP' | 'CUSTOM';
export type CostBasisMethod = 'FIFO' | 'WAC'; // First-In First-Out or Weighted Average Cost

export type UserRole = 'CONTROLLER' | 'ACCOUNTANT' | 'AUDITOR' | 'CFO' | 'TREASURY' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarUrl?: string;
}

export interface LegalEntity {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  isDefault?: boolean;
}

export interface OrganizationSettings {
  id: string;
  name: string;
  reportingCurrency: CurrencyCode;
  framework: AccountingFramework;
  costBasisMethod: CostBasisMethod;
  periodCloseDate: string; // e.g. "2026-08-31"
  materialityThresholdUsd: number;
  materialityPercent: number;
  makerCheckerEnabled: boolean;
  activePeriod: string; // e.g. "August 2026"
}

export type SourceCategory =
  | 'BLOCKCHAIN'
  | 'EXCHANGE'
  | 'TOKENIZATION_PLATFORM'
  | 'BANKING'
  | 'INTERNAL_SYSTEMS'
  | 'MANUAL';

export type SourceType = 'WALLET' | 'CUSTODIAN' | 'EXCHANGE' | 'TOKENIZATION_PLATFORM' | 'BANK' | 'ERP' | 'CSV';

export type SourceProvider =
  | 'SOLANA'
  | 'COINBASE'
  | 'KRAKEN'
  | 'SECURITIZE'
  | 'BACKED'
  | 'CIMB'
  | 'ERP'
  | 'CSV'
  | 'CUSTOM_TOKENIZATION'
  | 'ETHEREUM'
  | 'VSYSTEM'
  | 'BITCOIN';

export interface DataSource {
  id: string;
  entityId: string;
  name: string;
  category: SourceCategory;
  type: SourceType;
  provider: SourceProvider;
  addressOrAccount: string;
  purpose: string;
  status: 'CONNECTED' | 'SYNCING' | 'ERROR' | 'IDLE' | 'WARNING';
  lastSyncAt: string;
  txCount: number;
  assetCount?: number;
  healthStatus?: 'HEALTHY' | 'EXCEPTION' | 'SYNCING';
  promoted?: boolean;
  network?: string;
  balanceEstimateUsd?: number;
  reconciliationExceptionCount?: number;
  isReadOnly?: boolean;
  walletName?: string;
  custodian?: string;
}

export type TransactionClassification =
  | 'PURCHASE'
  | 'SALE'
  | 'INTERNAL_TRANSFER'
  | 'EXTERNAL_TRANSFER'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'NETWORK_FEE'
  | 'CUSTODY_FEE'
  | 'TRADING_FEE'
  | 'STAKING_REWARD'
  | 'DISTRIBUTION'
  | 'AIRDROP'
  | 'TOKEN_MINT'
  | 'TOKEN_BURN'
  | 'INCOME'
  | 'EXPENSE'
  | 'RENT_EXEMPTION'
  | 'UNKNOWN';

export type ReconciliationStatus = 'RECONCILED' | 'BREAK' | 'PENDING' | 'UNMATCHED';
export type AccountingStatus = 'POSTED' | 'PENDING_APPROVAL' | 'UNPOSTED' | 'DRAFT';
export type ApprovalStatus = 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' | 'NONE';

export type LocationType =
  | 'SOLANA_WALLET'
  | 'COINBASE_ACCOUNT'
  | 'KRAKEN_ACCOUNT'
  | 'CUSTODIAN_ACCOUNT'
  | 'ISSUER_WALLET'
  | 'TOKENIZATION_PLATFORM'
  | 'BANK_SETTLEMENT'
  | 'OTHER';

export interface PositionByLocation {
  id: string;
  assetSymbol: string;
  locationName: string;
  locationType: LocationType;
  provider: string;
  walletOrAccount: string;
  legalEntity: string;
  quantity: number;
  nominalValue?: number;
  carryingValueUsd: number;
  fairValueUsd: number;
  currency: string;
  lastVerified: string;
  reconciliationStatus: ReconciliationStatus;
  notes?: string;
  chain?: string;
  custodian?: string;
}

export interface NormalizedMovement {
  id: string;
  asset: string;
  quantity: number;
  direction: 'IN' | 'OUT' | 'FEE';
  fiatValue: number;
  walletAddress?: string;
}

export interface NormalizedTransaction {
  id: string;
  externalTxId: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  network: string; // 'Solana Mainnet-Beta', 'Coinbase Institutional', etc.
  walletAccount: string;
  walletName?: string;
  custodian?: string;
  chain?: string;
  entityId: string;
  entityName: string;
  timestamp: string;
  businessDescription: string;
  txType: TransactionClassification;
  
  // Location & Source Tracking
  fromLocation?: string;
  toLocation?: string;
  fromSource?: string;
  toSource?: string;
  isInternalTransfer?: boolean;
  economicOwnershipUnchanged?: boolean;
  
  // Primary movement representations
  assetSent?: string;
  quantitySent?: number;
  assetReceived?: string;
  quantityReceived?: number;
  feeAsset?: string;
  feeQuantity?: number;
  feeFiatValue?: number;
  
  counterparty?: string;
  fiatValue: number;
  valuationCurrency: CurrencyCode;
  priceSource: string;
  
  // Accounting mapping
  classification: TransactionClassification;
  autoClassified: boolean;
  classificationConfidence?: number; // 0-100
  classificationRuleReason?: string;
  suggestedClassification?: TransactionClassification;
  
  debitAccountCode: string;
  debitAccountName: string;
  creditAccountCode: string;
  creditAccountName: string;
  costBasis?: number;
  realizedGainLoss?: number;
  
  // Controls & verification
  reconciliationStatus: ReconciliationStatus;
  reconciliationMatchMethod?: 'EXACT_HASH' | 'EXTERNAL_ID' | 'CROSS_SOURCE_MATCH' | 'TIMESTAMP_AMOUNT' | 'MANUAL';
  reconciliationNote?: string;
  
  // Cross-source verification details
  sourceRecordMatched?: boolean;
  destinationRecordMatched?: boolean;
  quantityMatched?: boolean;
  timestampMatched?: boolean;
  noDisposalRecognized?: boolean;
  rawSourceRecord?: Record<string, any>;
  rawDestinationRecord?: Record<string, any>;

  accountingStatus: AccountingStatus;
  approvalStatus: ApprovalStatus;
  preparedBy?: string;
  approverName?: string;
  approvedAt?: string;
  
  // Technical / DLT Evidence
  txHash: string;
  dltTxReference?: string;
  solanaSignature?: string;
  blockNumber?: number;
  rawData?: Record<string, any>;
  notes?: string;
  movements: NormalizedMovement[];
  
  createdAt: string;
  updatedAt: string;
}

export interface FiveWayReconciliationRecord {
  id: string;
  assetSymbol: string;
  assetName: string;
  assetType: 'TOKENIZED_FUND' | 'TOKENIZED_SECURITY' | 'TOKENIZED_DEPOSIT' | 'TOKENIZED_EQUITY' | 'CRYPTOCURRENCY';
  
  // 1. Solana / DLT Record
  solanaDltUnits: number;
  solanaDltVerified: boolean;
  solanaDltSource: string;
  solanaDltRef: string;
  
  // 2. Coinbase / Kraken Record
  exchangeUnits: number;
  exchangeBreakdown: string;
  exchangeVerified: boolean;
  exchangeSource: string;
  exchangeRef: string;
  
  // 3. Tokenization Platform / Issuer Record
  issuerPlatformUnits: number;
  issuerPlatformVerified: boolean;
  issuerPlatformSource: string;
  issuerPlatformRef: string;
  
  // 4. Token Ledger Subledger
  subledgerUnits: number;
  subledgerVerified: boolean;
  subledgerRef: string;
  
  // 5. General Ledger (ERP)
  generalLedgerValueUsd: number;
  generalLedgerUnits: number;
  generalLedgerVerified: boolean;
  generalLedgerAccount: string;
  
  totalCalculatedUnits: number;
  varianceUnits: number;
  varianceUsd: number;
  status: 'RECONCILED' | 'EXCEPTION' | 'PENDING';
  exceptionReason?: string;
  aiExplanation?: string;
  lastVerifiedTimestamp: string;
}

export interface ReconciliationBreakItem {
  id: string;
  asset: string;
  assetName?: string;
  blockchainBalance: number;
  exchangeBalance?: number;
  ledgerBalance: number;
  difference: number;
  fiatDifferenceUsd: number;
  isMaterial: boolean;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'APPROVED';
  breakCategory?: 'TRANSFER_TIMING' | 'UNMATCHED_TX' | 'FEE_VARIANCE' | 'POSITION_MISMATCH';
  sourceVenue?: string;
  destinationVenue?: string;
  expectedAmount?: number;
  receivedAmount?: number;
  potentialReason: string;
  aiDiagnostic?: string;
  owner: string;
  resolutionNote?: string;
  approver?: string;
  approvedAt?: string;
  relatedTxIds: string[];
  lastUpdated: string;
}

export interface ChartAccount {
  code: string;
  name: string;
  category: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  normalBalance: 'DEBIT' | 'CREDIT';
  balance: number;
  description: string;
  active: boolean;
  isDigitalAssetAccount?: boolean;
  supportedAssetSymbol?: string;
}

export interface AccountingRule {
  id: string;
  name: string;
  conditionDescription: string;
  sourceTypeMatch?: SourceType | 'ANY';
  txTypeMatch: TransactionClassification;
  assetMatch?: string;
  debitAccountCode: string;
  debitAccountName: string;
  creditAccountCode: string;
  creditAccountName: string;
  isPnLRecognized: boolean;
  explanationTemplate: string;
  active: boolean;
  autoAppliedCount: number;
}

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  assetSymbol?: string;
  quantity?: number;
  memo: string;
}

export interface JournalEntry {
  id: string;
  journalNumber: string; // e.g. "JE-2026-00842"
  date: string;
  entityId: string;
  sourceName: string;
  description: string;
  relatedTxId?: string;
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'POSTED';
  totalDebit: number;
  totalCredit: number;
  preparedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  ruleApplied?: string;
  lines: JournalLine[];
  evidenceHash?: string;
}

export interface AssetValuation {
  id?: string;
  assetSymbol: string;
  name: string;
  assetType: 'CRYPTOCURRENCY' | 'STABLECOIN' | 'TOKENIZED_SECURITY' | 'TOKENIZED_FUND' | 'TOKENIZED_EQUITY' | 'TOKENIZED_DEPOSIT' | 'OTHER';
  network: string;
  isinOrCusip?: string;
  issuer?: string;
  underlyingAsset?: string;
  walletName?: string;
  custodian?: string;
  chains?: string[];
  isSimulatedDemoNetwork?: boolean;
  demoNetworkNote?: string;
  nominalValue?: number;
  totalQuantity: number;
  quantity?: number;
  spotPriceUsd: number;
  currentPriceUsd?: number;
  marketValueUsd: number;
  costBasisUsd: number;
  unrealizedGainLossUsd: number;
  unrealizedGainLossPercent: number;
  priceSource: string;
  lastPriceTimestamp: string;
  change24hPercent: number;
  valuationLevel?: string;
  positionsByLocation?: PositionByLocation[];
}

export interface MonthEndTask {
  id: string;
  name: string;
  title?: string;
  category: 'DATA_INGESTION' | 'RECONCILIATION' | 'CLASSIFICATION' | 'VALUATION' | 'JOURNALS' | 'REPORTING' | 'SIGN_OFF';
  status: 'COMPLETED' | 'WARNING' | 'PENDING' | 'BLOCKED';
  owner: string;
  assignedToName?: string;
  dueDate: string;
  evidenceSummary: string;
  description?: string;
  blockingReason?: string;
  actionRoute?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  objectType: 'TRANSACTION' | 'RECONCILIATION' | 'JOURNAL' | 'ACCOUNTING_RULE' | 'DATA_SOURCE' | 'CLOSE_PERIOD' | 'PRICE_OVERRIDE';
  targetType?: string;
  objectId: string;
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
  details?: string;
}
