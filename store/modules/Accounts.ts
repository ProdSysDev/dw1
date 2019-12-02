import { State, Actions, types } from '~/store/modules/Contracts/Accounts'
import { GetterTree, MutationTree } from '~/node_modules/vuex'
import { RootState } from '~/store'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import * as Loader from '~/store/modules/Loader'
import { api } from '~/api/Axios'

export const name = 'accounts'

export const namespaced = true

export const state = (): State => ({
  isLoading: false,
  accounts: null,
  account: null,
  statement: null
})

export const getters: GetterTree<State, RootState> = {
  accounts: (state) => {
    return state.accounts
  },
  account: (state) => {
    return state.account
  },
  statement: (state) => {
    return state.statement
  },
  totalAvailableBalance: (state) => {
    if (state.accounts == null) {
      return 0
    }

    let total = 0

    state.accounts.account.forEach(
      (account: ManagedAccountsSchemas.ManagedAccount) => {
        if (account.balances.availableBalance) {
          if (account.currency === 'GBP') {
            total = total + parseInt(account.balances.availableBalance) * 1.16
          } else {
            total += parseInt(account.balances.availableBalance)
          }
        }
      }
    )

    return total
  },
  filteredStatement: (state) => {
    if (state.statement == null) {
      return []
    }

    return state.statement.entry.filter((element) => {
      return element.adjustment != 0
    })
  },
  isLoading: (state) => {
    return state.isLoading
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_ACCOUNTS](
    state,
    accounts: ManagedAccountsSchemas.ManagedAccounts
  ) {
    state.accounts = accounts
  },
  [types.SET_ACCOUNT](state, account: ManagedAccountsSchemas.ManagedAccount) {
    state.account = account
  },
  [types.SET_STATEMENT](
    state,
    statement: ManagedAccountsSchemas.ManagedAccountStatement
  ) {
    state.statement = statement
  },
  [types.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  }
}

export const actions: Actions<State, RootState> = {
  index({ commit }) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const body = {
      paging: {
        count: true,
        offset: 0,
        limit: 0
      }
    }

    const req = api.post('/app/api/managed_accounts/get', body)

    req.then((res) => {
      commit(types.SET_ACCOUNTS, res.data)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
    })

    return req
  },
  add({ commit }, request: ManagedAccountsSchemas.CreateManagedAccountRequest) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_accounts/_/create', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  get({ commit }, id: number) {
    const req = api.post('/app/api/managed_accounts/' + id + '/get', {})

    req.then((res) => {
      commit(types.SET_ACCOUNT, res.data)
    })

    return req
  },
  getStatement({ commit }, request) {
    const req = api.post(
      '/app/api/managed_accounts/' + request.id + '/statement/get',
      request.body
    )

    req.then((res) => {
      commit(types.SET_STATEMENT, res.data)
    })

    return req
  }
}
