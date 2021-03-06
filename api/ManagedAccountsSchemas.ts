import { Schemas } from './Schemas'

export module ManagedAccountsSchemas {
  import TypeId = Schemas.TypeId

  export interface CreateManagedAccountRequest {
    profileId: any
    tag?: string
    owner: TypeId
    friendlyName: string
    currency: string
    fiProvider: string
    createNow?: boolean
    channelProvider: string
  }

  export interface ManagedAccounts {
    account: ManagedAccount[]
    count: number
    responseCount: number
    action: []
  }

  export interface ManagedAccount {
    id: {
      type: string
      id: string
    }
    profileId: number
    tag?: string
    ownerId: {
      type: string
      id: number
    }
    friendlyName: string
    active?: boolean
    currency: string
    balances: ManagedInstrumentBalances
    state: InstrumentState
    fiProvider: string
    creationTimestamp: string
    action: ManagedAccountAction
    bankAccountDetails?: {
      beneficiary?: string
      address?: string
      beneficiaryBank?: string
      bankIdentifierCode?: string
      iban?: string
      paymentReference?: string
    }
  }

  export interface InstrumentState {
    [k: string]: number
  }

  export interface ManagedInstrumentBalances {
    availableBalance?: string
    actualBalance?: number
  }

  export enum ManagedAccountAction {
    UPDATE = 'UPDATE',
    BLOCK = 'BLOCK',
    UNBLOCK = 'UNBLOCK',
    DESTROY = 'DESTROY'
  }
}
