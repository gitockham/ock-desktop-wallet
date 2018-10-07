import truncateMiddle from '@/filters/truncate-middle'

export default {
  computed: {
    wallet_fromRoute () {
      const params = this.$route.params
      if (!params || !params.address) {
        return
      }

      const address = params.address
      let wallet = this.$store.getters['wallet/byAddress'](address)

      if (this.$store.getters['ledger/isConnected'] && !wallet) {
        const ledgerWallet = this.$store.getters['ledger/wallet'](address)
        if (ledgerWallet) {
          wallet = ledgerWallet
        }
      }

      return wallet
    }
  },

  methods: {
    wallet_formatAddress (address, truncateAmount) {
      const networkWallet = this.session_network.knownWallets[address]
      if (networkWallet) {
        return networkWallet
      }

      const profileWallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      const profileWallet = profileWallets.find(wallet => wallet.address === address)
      if (profileWallet) {
        return profileWallet.name
      }

      return Number.isFinite(truncateAmount) ? truncateMiddle(address, truncateAmount) : address
    }
  }
}